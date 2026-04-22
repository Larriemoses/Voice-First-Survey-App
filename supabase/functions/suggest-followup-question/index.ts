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
    const questionText = typeof body?.question_text === "string" ? body.question_text.trim() : "";
    if (!questionText) return json({ error: "question_text is required" }, 400);

    const fallback = {
      suggestions: [
        "What made that experience feel different?",
        "How would you explain that issue to a colleague?",
        "What should we do next to improve it?",
      ],
    };

    const prompt = `Return JSON only: {"suggestions":["string"]}. Suggest 2 to 3 open-ended voice follow-up questions for: ${questionText}`;
    const parsed = await callClaude(prompt, fallback);
    return json(parsed);
  } catch (error) {
    console.error("suggest-followup-question error", error);
    return json({ error: "Suggestion failed" }, 500);
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
      temperature: 0.3,
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
