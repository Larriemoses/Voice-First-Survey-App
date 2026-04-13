// @ts-ignore
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type GeneratedSurveyDraft = {
  title: string;
  description: string;
  questions: Array<{
    prompt: string;
    max_duration_seconds: number;
  }>;
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse(
        { error: "Missing or invalid Authorization header" },
        401,
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
      return jsonResponse(
        { error: "Missing required environment variables" },
        500,
      );
    }

    // Validate incoming JWT with anon client
    const authClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data: userData, error: userError } =
      await authClient.auth.getUser(token);

    if (userError || !userData.user) {
      return jsonResponse({ error: "Invalid JWT" }, 401);
    }

    const body = await req.json().catch(() => null);
    const brief = body?.brief;

    if (!brief || typeof brief !== "string" || !brief.trim()) {
      return jsonResponse(
        { error: "brief is required and must be a non-empty string" },
        400,
      );
    }

    const trimmedBrief = brief.trim();

    const systemPrompt = `
You are an expert survey strategist for a voice-first survey platform called Survica.

Your job:
- Read a user's pasted brand brief, research thought, customer problem, or survey plan.
- Generate a practical survey draft for spoken-response interviews.
- The output must be concise, useful, and realistic.
- Questions should be designed for voice responses, not yes/no answers.
- Keep questions open-ended, natural, and easy to answer verbally.
- Avoid repetitive questions.
- Focus on clarity, depth, and business usefulness.

Rules:
- Return 4 to 8 questions.
- Each question must be open-ended and suitable for voice recording.
- Each max_duration_seconds should usually be between 60 and 180.
- Title should be short and professional.
- Description should explain what the survey is trying to learn.
- Do not include markdown.
- Do not include any text outside the JSON schema.
`.trim();

    const userPrompt = `
Create a survey draft from this input:

${trimmedBrief}
`.trim();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "generated_survey_draft",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                questions: {
                  type: "array",
                  minItems: 4,
                  maxItems: 8,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      prompt: {
                        type: "string",
                      },
                      max_duration_seconds: {
                        type: "number",
                      },
                    },
                    required: ["prompt", "max_duration_seconds"],
                  },
                },
              },
              required: ["title", "description", "questions"],
            },
          },
        },
      }),
    });

    const openaiResult = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI generate-survey-draft error:", openaiResult);

      return jsonResponse(
        {
          error: "Survey draft generation failed",
          details: openaiResult,
        },
        500,
      );
    }

    const rawContent =
      openaiResult?.choices?.[0]?.message?.content;

    if (!rawContent || typeof rawContent !== "string") {
      console.error("Unexpected OpenAI response shape:", openaiResult);

      return jsonResponse(
        { error: "Invalid AI response format" },
        500,
      );
    }

    let parsed: GeneratedSurveyDraft;

    try {
      parsed = JSON.parse(rawContent) as GeneratedSurveyDraft;
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", rawContent, parseError);

      return jsonResponse(
        { error: "Failed to parse generated survey draft" },
        500,
      );
    }

    // Final safety cleanup
    const cleaned: GeneratedSurveyDraft = {
      title: sanitizeText(parsed.title, 120),
      description: sanitizeText(parsed.description, 500),
      questions: (parsed.questions || [])
        .filter((q) => q?.prompt && typeof q.prompt === "string")
        .slice(0, 8)
        .map((q) => ({
          prompt: sanitizeText(q.prompt, 300),
          max_duration_seconds: clampDuration(q.max_duration_seconds),
        })),
    };

    if (!cleaned.title || !cleaned.description || cleaned.questions.length === 0) {
      return jsonResponse(
        { error: "Generated survey draft was incomplete" },
        500,
      );
    }

    return jsonResponse(cleaned, 200);
  } catch (err) {
    console.error("FUNCTION ERROR:", err);

    return jsonResponse(
      { error: "Processing failed" },
      500,
    );
  }
});

function clampDuration(value: unknown): number {
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 120;

  if (!Number.isFinite(num)) return 120;

  return Math.min(180, Math.max(45, Math.round(num)));
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}