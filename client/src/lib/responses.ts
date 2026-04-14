import { supabase } from "./supabase";
import * as XLSX from "xlsx";

export type ResponseItem = {
  id: string;
  audio_path: string;
  audio_path_mp3?: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  created_at: string;
  transcript?: string | null;
  transcript_status?: string | null;
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

function buildResponseFilePath(input: {
  surveyId: string;
  respondentId: string;
  questionId: string;
}) {
  const fileExt = "webm";
  return `survey_${input.surveyId}/respondent_${input.respondentId}/question_${input.questionId}.${fileExt}`;
}

function sanitizeSheetName(name: string) {
  return name.replace(/[\\/*[\]:?]/g, "").slice(0, 31) || "Survey";
}

function sanitizeFileName(name: string) {
  return name.replace(/[<>:"/\\|?*]+/g, "").trim() || "survey-export";
}

export async function uploadSurveyResponse(input: {
  surveyId: string;
  respondentId: string;
  questionId: string;
  audioBlob: Blob;
  durationSeconds: number;
}) {
  const filePath = buildResponseFilePath({
    surveyId: input.surveyId,
    respondentId: input.respondentId,
    questionId: input.questionId,
  });

  const mimeType = input.audioBlob.type || "audio/webm";

  const { error: uploadError } = await supabase.storage
    .from("voice-surveys")
    .upload(filePath, input.audioBlob, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(uploadError.message || "Failed to upload audio.");
  }

  const { error: responseError } = await supabase.from("responses").upsert(
    {
      survey_id: input.surveyId,
      respondent_id: input.respondentId,
      question_id: input.questionId,
      audio_path: filePath,
      mime_type: mimeType,
      file_size_bytes: input.audioBlob.size,
      duration_seconds: input.durationSeconds,
    },
    {
      onConflict: "respondent_id,question_id",
    },
  );

  if (responseError) {
    console.error("Response insert/upsert error:", responseError);
    throw new Error(responseError.message || "Failed to save response.");
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
      audio_path_mp3,
      mime_type,
      file_size_bytes,
      duration_seconds,
      created_at,
      transcript,
      transcript_status,
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
    transcript: item.transcript || "",
  }));

  if (rows.length === 0) {
    return [
      "respondent_name,respondent_email,respondent_phone,question_order,question_prompt,transcript",
    ].join("\n");
  }

  const headers = Object.keys(rows[0]);

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

export function buildSurveyWorkbook(params: {
  surveyTitle: string;
  responses: ResponseItem[];
}) {
  const { surveyTitle, responses } = params;

  const grouped = new Map<
    string,
    {
      serial: number;
      name: string;
      email: string;
      phone: string;
      answers: Record<string, string>;
      durations: number[];
    }
  >();

  const orderedQuestions = Array.from(
    new Map(
      responses
        .filter((item) => item.question?.id)
        .map((item) => [
          item.question!.id,
          {
            id: item.question!.id,
            prompt: item.question?.prompt || "",
            order_index: item.question?.order_index || 0,
          },
        ]),
    ).values(),
  ).sort((a, b) => a.order_index - b.order_index);

  let serialCounter = 1;

  for (const item of responses) {
    const respondentKey = item.respondent?.id || `unknown-${item.id}`;

    if (!grouped.has(respondentKey)) {
      grouped.set(respondentKey, {
        serial: serialCounter++,
        name: item.respondent?.display_name || "Anonymous Respondent",
        email: item.respondent?.email || "",
        phone: item.respondent?.phone || "",
        answers: {},
        durations: [],
      });
    }

    const current = grouped.get(respondentKey)!;
    const questionPrompt = item.question?.prompt || "Untitled Question";

    current.answers[questionPrompt] = item.transcript || "";
    current.durations.push(item.duration_seconds || 0);
  }

  const responseRows = Array.from(grouped.values()).map((entry) => {
    const row: Record<string, string | number> = {
      "S/N": entry.serial,
      Name: entry.name,
      Email: entry.email,
      Phone: entry.phone,
    };

    orderedQuestions.forEach((question) => {
      row[question.prompt] = entry.answers[question.prompt] || "";
    });

    return row;
  });

  const totalResponses = responses.length;
  const totalRespondents = grouped.size;
  const completedTranscripts = responses.filter(
    (item) => item.transcript_status === "completed",
  ).length;
  const processingTranscripts = responses.filter(
    (item) => item.transcript_status === "processing",
  ).length;
  const failedTranscripts = responses.filter(
    (item) => item.transcript_status === "failed",
  ).length;
  const averageDuration =
    responses.length > 0
      ? Math.round(
          responses.reduce((sum, item) => sum + (item.duration_seconds || 0), 0) /
            responses.length,
        )
      : 0;

  const analyticsRows = [
    { Metric: "Survey Title", Value: surveyTitle },
    { Metric: "Total Respondents", Value: totalRespondents },
    { Metric: "Total Responses", Value: totalResponses },
    { Metric: "Completed Transcripts", Value: completedTranscripts },
    { Metric: "Processing Transcripts", Value: processingTranscripts },
    { Metric: "Failed Transcripts", Value: failedTranscripts },
    { Metric: "Average Response Duration (seconds)", Value: averageDuration },
    { Metric: "Total Questions", Value: orderedQuestions.length },
  ];

  const workbook = XLSX.utils.book_new();

  const responsesSheet = XLSX.utils.json_to_sheet(responseRows);
  const analyticsSheet = XLSX.utils.json_to_sheet(analyticsRows);

  XLSX.utils.book_append_sheet(
    workbook,
    responsesSheet,
    sanitizeSheetName("Responses"),
  );
  XLSX.utils.book_append_sheet(
    workbook,
    analyticsSheet,
    sanitizeSheetName("Analytics"),
  );

  return {
    workbook,
    fileName: `${sanitizeFileName(surveyTitle)}.xlsx`,
  };
}