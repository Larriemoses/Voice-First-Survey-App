// @ts-ignore
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const questions = Array.isArray(body?.questions) ? body.questions.filter((item: unknown) => typeof item === "string") : [];
    if (questions.length === 0) return json({ error: "questions are required" }, 400);

    const fallback = {
      score: 82,
      tips: [
        { message: "Trim the survey to 5 questions for higher completion.", field: "questions" },
        { message: "Add hint text to guide respondents on the pricing question.", field: "hint_text" },
      ],
    };

    const prompt = `
Return JSON only: {"score":0,"tips":[{"message":"string","field":"string"}]}.
Assess this voice survey for completion quality.
Question count: ${body?.question_count || questions.length}
Has intro: ${Boolean(body?.has_intro)}
Has hint texts: ${Boolean(body?.has_hint_texts)}
Questions: ${questions.join(" | ")}
`.trim();

    const parsed = await callClaude(prompt, fallback);
    return json(parsed);
  } catch (error) {
    console.error("generate-survey-health error", error);
    return json({ error: "Survey health generation failed" }, 500);
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
      max_tokens: 700,
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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
