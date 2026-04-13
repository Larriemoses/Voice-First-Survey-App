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
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Validate incoming JWT manually
    const authClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data: userData, error: userError } =
      await authClient.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid JWT" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const body = await req.json().catch(() => null);
    const brief = body?.brief;

    if (!brief || typeof brief !== "string" || !brief.trim()) {
      return new Response(
        JSON.stringify({ error: "brief is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const systemPrompt = `
You are an expert survey strategist for a voice-first survey platform called Survica.

Return ONLY valid JSON with this exact structure:

{
  "title": "string",
  "description": "string",
  "questions": [
    {
      "prompt": "string",
      "max_duration_seconds": 120
    }
  ]
}

Rules:
- Return 4 to 8 questions.
- Each question must use the key "prompt".
- Each question must use the key "max_duration_seconds".
- Questions must be open-ended and suitable for spoken answers.
- Avoid yes/no questions.
- Avoid repetition.
- Title must be short and professional.
- Description must explain what the survey is trying to learn.
- Do not include markdown.
- Do not include any text outside the JSON object.
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
            content: `Create a survey draft from this input:\n\n${brief.trim()}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const result = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI generation error:", result);

      return new Response(
        JSON.stringify({
          error: "Survey draft generation failed",
          details: result,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const rawContent = result?.choices?.[0]?.message?.content;

    console.log("RAW OPENAI CONTENT:", rawContent);

    if (!rawContent || typeof rawContent !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    let parsed: any;

    try {
      parsed = JSON.parse(rawContent);
    } catch (err) {
      console.error("JSON parse error:", err, rawContent);

      return new Response(
        JSON.stringify({
          error: "Failed to parse generated survey draft",
          rawContent,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const rawQuestions = Array.isArray(parsed.questions)
      ? parsed.questions
      : Array.isArray(parsed.items)
        ? parsed.items
        : Array.isArray(parsed.survey_questions)
          ? parsed.survey_questions
          : [];

    const cleanedQuestions = rawQuestions
      .map((q: any) => ({
        prompt: sanitizeText(q?.prompt || q?.question || q?.text || "", 300),
        max_duration_seconds: clampDuration(
          q?.max_duration_seconds ?? q?.duration ?? 120,
        ),
      }))
      .filter((q: any) => q.prompt);

    const cleaned: GeneratedSurveyDraft = {
      title: sanitizeText(
        parsed.title || parsed.survey_title || "Generated Survey Draft",
        120,
      ),
      description: sanitizeText(
        parsed.description ||
          parsed.summary ||
          parsed.survey_description ||
          "AI-generated survey draft.",
        500,
      ),
      questions: cleanedQuestions.slice(0, 8),
    };

    console.log("CLEANED DRAFT:", cleaned);

    if (cleaned.questions.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Generated survey draft was incomplete",
          debug: {
            parsed,
            cleaned,
          },
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(JSON.stringify(cleaned), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("FUNCTION ERROR:", err);

    return new Response(
      JSON.stringify({ error: "Processing failed" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
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