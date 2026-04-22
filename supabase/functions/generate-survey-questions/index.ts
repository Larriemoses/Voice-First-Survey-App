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
    const brief = typeof body?.brief === "string" ? body.brief.trim() : "";

    if (!brief) {
      return json({ error: "brief is required" }, 400);
    }

    const fallback = [
      { question_text: "What was the most valuable part of your experience?", type: "voice", hint_text: "Share the moment or detail that mattered most." },
      { question_text: "Where did the process feel unclear or slower than expected?", type: "voice", hint_text: "Mention any friction, delays, or missing context." },
      { question_text: "What would make you more likely to recommend us?", type: "voice", hint_text: "Describe the improvement or proof point that would help." },
    ];

    const prompt = `
You are a survey insights specialist for Survica, a voice-first survey platform.
Return JSON only, with no markdown or preamble.
Create ${body?.length || "Medium 6-8q"} open-ended voice survey questions.
Each item must have: question_text, type, hint_text.
Industry: ${body?.industry || "general"}
Goal: ${body?.goal || "customer feedback"}
Brief: ${brief}
`.trim();

    const parsed = await callClaude(prompt, { questions: fallback });
    return json(Array.isArray(parsed?.questions) ? parsed.questions : fallback);
  } catch (error) {
    console.error("generate-survey-questions error", error);
    return json({ error: "Question generation failed" }, 500);
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
      max_tokens: 1400,
      temperature: 0.4,
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
