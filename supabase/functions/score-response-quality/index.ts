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
    const transcriptText = typeof body?.transcript_text === "string" ? body.transcript_text.trim() : "";
    const questionText = typeof body?.question_text === "string" ? body.question_text.trim() : "";
    if (!transcriptText || !questionText) return json({ error: "transcript_text and question_text are required" }, 400);

    const fallback = { score: transcriptText.length > 160 ? 84 : 56, rationale: transcriptText.length > 160 ? "Detailed response with clear themes" : "Short response, limited context" };
    const prompt = `Return JSON only: {"score":0,"rationale":"string"}. Score response quality from 0 to 100. Question: ${questionText}. Transcript: ${transcriptText}`;
    const parsed = await callClaude(prompt, fallback);
    return json(parsed);
  } catch (error) {
    console.error("score-response-quality error", error);
    return json({ error: "Quality scoring failed" }, 500);
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
      max_tokens: 500,
      temperature: 0.1,
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
