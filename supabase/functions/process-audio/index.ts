import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { responseId, audioPath } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Download original audio
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("voice-surveys")
      .download(audioPath);

    if (downloadError) throw downloadError;

    const arrayBuffer = await fileData.arrayBuffer();

    // 2. Convert to MP3 (mock for now)
    // ⚠️ Real FFmpeg will come later
    const mp3Path = audioPath.replace(".webm", ".mp3");

    await supabase.storage
      .from("voice-surveys")
      .upload(mp3Path, arrayBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    // 3. Transcribe (OpenAI Whisper)
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([arrayBuffer], { type: "audio/webm" }),
      "audio.webm"
    );
    formData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: formData,
    });

    const result = await response.json();

    // 4. Save to DB
    await supabase
      .from("responses")
      .update({
        audio_path_mp3: mp3Path,
        transcript: result.text || "",
        transcript_status: "completed",
      })
      .eq("id", responseId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: "Processing failed" }),
      { status: 500 }
    );
  }
});
