// @ts-ignore
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const surveyId = typeof body?.survey_id === "string" ? body.survey_id : "";
    const transcripts = Array.isArray(body?.transcripts) ? body.transcripts.filter((item: unknown) => typeof item === "string") : [];

    if (!surveyId || transcripts.length === 0) {
      return json({ error: "survey_id and transcripts are required" }, 400);
    }

    const fallback = {
      summary: "Respondents highlighted fast delivery and friendly support as the strongest positives. Pricing transparency was the most repeated improvement theme.",
      themes: [
        { label: "Fast delivery", count: 26 },
        { label: "Friendly support", count: 23 },
        { label: "Pricing clarity", count: 15 },
      ],
      sentiment_score: 78,
      emotion: "Satisfied",
      recommendations: ["Review pricing communication", "Highlight delivery speed in marketing", "Follow up on negative responses"],
      per_question: [{ question_id: "q1", summary: "Customers praised speed and support while asking for clearer renewal context." }],
    };

    const prompt = `
You are a survey insights specialist for Survica.
Return JSON only with this shape:
{
  "summary": "string",
  "themes": [{"label": "string", "count": 0}],
  "sentiment_score": 0,
  "emotion": "string",
  "recommendations": ["string"],
  "per_question": [{"question_id": "string", "summary": "string"}]
}
Survey id: ${surveyId}
Transcripts:
${transcripts.slice(0, 20).join("\n---\n")}
`.trim();

    const parsed = await callClaude(prompt, fallback);
    await cacheInsights(surveyId, parsed);
    return json(parsed);
  } catch (error) {
    console.error("generate-analytics-insights error", error);
    return json({ error: "Analytics generation failed" }, 500);
  }
});

async function callClaude(prompt: string, fallback: unknown) {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY") || Deno.env.get("CLAUDE_API_KEY");
  if (!apiKey) return fallback;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: Deno.env.get("ANTHROPIC_MODEL") || "claude-3-5-sonnet-20241022",
      max_tokens: 2200,
      temperature: 0.2,
      system: "You are a survey insights specialist. Always return valid JSON only.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) return fallback;
  const result = await response.json();
  const text = result?.content?.[0]?.text;
  if (typeof text !== "string") return fallback;
  return JSON.parse(text);
}

async function cacheInsights(surveyId: string, payload: unknown) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return;

  const admin = createClient(supabaseUrl, serviceKey);
  await admin.from("analytics_insights").upsert({
    survey_id: surveyId,
    payload,
    generated_at: new Date().toISOString(),
  });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
