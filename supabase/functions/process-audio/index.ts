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
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Publishable/anon client for validating the incoming JWT
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

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
        }
      );
    }

    const { responseId, audioPath } = await req.json();

    if (!responseId || !audioPath) {
      return new Response(
        JSON.stringify({ error: "responseId and audioPath are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Service-role client for storage/database work
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await admin
      .from("responses")
      .update({ transcript_status: "processing" })
      .eq("id", responseId);

    // 1. Download original audio
    const { data: fileData, error: downloadError } = await admin.storage
      .from("voice-surveys")
      .download(audioPath);

    if (downloadError) throw downloadError;

    const arrayBuffer = await fileData.arrayBuffer();

    // 2. MVP placeholder MP3 path
    const mp3Path = audioPath.replace(".webm", ".mp3");

    const { error: mp3UploadError } = await admin.storage
      .from("voice-surveys")
      .upload(mp3Path, arrayBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (mp3UploadError) {
      console.error("MP3 upload error:", mp3UploadError);
    }

    // 3. OpenAI Whisper transcription
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([arrayBuffer], { type: "audio/webm" }),
      "audio.webm"
    );
    formData.append("model", "whisper-1");

    const openaiRes = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        },
        body: formData,
      }
    );

    const result = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI transcription error:", result);

      await admin
        .from("responses")
        .update({ transcript_status: "failed" })
        .eq("id", responseId);

      return new Response(
        JSON.stringify({
          error: "Transcription failed",
          details: result,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { error: updateError } = await admin
      .from("responses")
      .update({
        transcript: result.text || "",
        transcript_status: "completed",
        audio_path_mp3: mp3Path,
      })
      .eq("id", responseId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        transcript: result.text || "",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
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
      }
    );
  }
});