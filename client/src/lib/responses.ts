import { supabase } from "./supabase";

export type ResponseItem = {
  id: string;
  audio_path: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  created_at: string;
  respondent: {
    id: string;
    display_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  question: {
    id: string;
    prompt: string;
    order_index: number;
  } | null;
};

type RelationValue<T> = T | T[] | null;

type ResponseQueryRow = Omit<ResponseItem, "respondent" | "question"> & {
  respondent: RelationValue<NonNullable<ResponseItem["respondent"]>>;
  question: RelationValue<NonNullable<ResponseItem["question"]>>;
};

function normalizeRelation<T>(value: RelationValue<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export async function uploadSurveyResponse(input: {
  surveyId: string;
  respondentId: string;
  questionId: string;
  audioBlob: Blob;
  durationSeconds: number;
}) {
  const fileExt = "webm";
  const filePath = `survey_${input.surveyId}/respondent_${input.respondentId}/question_${input.questionId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("voice-surveys")
    .upload(filePath, input.audioBlob, {
      contentType: input.audioBlob.type || "audio/webm",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw uploadError;
  }

  const { error: responseError } = await supabase.from("responses").upsert(
    {
      survey_id: input.surveyId,
      respondent_id: input.respondentId,
      question_id: input.questionId,
      audio_path: filePath,
      mime_type: input.audioBlob.type || "audio/webm",
      file_size_bytes: input.audioBlob.size,
      duration_seconds: input.durationSeconds,
    },
    {
      onConflict: "respondent_id,question_id",
    },
  );

  if (responseError) {
    console.error("Response insert/upsert error:", responseError);
    throw responseError;
  }

  return { success: true, audio_path: filePath };
}

export async function getSurveyResponsesForAdmin(
  surveyId: string,
): Promise<ResponseItem[]> {
  const { data, error } = await supabase
    .from("responses")
    .select(
      `
      id,
      audio_path,
      mime_type,
      file_size_bytes,
      duration_seconds,
      created_at,
      respondent:respondents (
        id,
        display_name,
        email,
        phone
      ),
      question:questions (
        id,
        prompt,
        order_index
      )
    `,
    )
    .eq("survey_id", surveyId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as ResponseQueryRow[];

  return rows.map((item) => ({
    ...item,
    respondent: normalizeRelation(item.respondent),
    question: normalizeRelation(item.question),
  }));
}

export async function downloadResponseAudio(audioPath: string) {
  const { data, error } = await supabase.storage
    .from("voice-surveys")
    .createSignedUrl(audioPath, 120);

  if (error) throw error;
  return data.signedUrl;
}

export async function exportSurveyResponsesAsCSV(surveyId: string) {
  const responses = await getSurveyResponsesForAdmin(surveyId);

  const rows = responses.map((item) => ({
    respondent_name: item.respondent?.display_name || "",
    respondent_email: item.respondent?.email || "",
    respondent_phone: item.respondent?.phone || "",
    question_order: item.question?.order_index || "",
    question_prompt: item.question?.prompt || "",
    audio_path: item.audio_path || "",
    mime_type: item.mime_type || "",
    file_size_bytes: item.file_size_bytes || "",
    duration_seconds: item.duration_seconds || "",
    created_at: item.created_at || "",
  }));

  const headers = Object.keys(rows[0] || {});
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = String(row[header as keyof typeof row] ?? "");
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  return csv;
}
