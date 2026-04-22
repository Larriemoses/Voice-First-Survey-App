import { supabase } from "./supabase";

export type GeneratedQuestion = {
  question_text: string;
  type: "voice";
  hint_text: string;
};

export type AnalyticsInsightResult = {
  summary: string;
  themes: Array<{ label: string; count: number }>;
  sentiment_score: number;
  emotion: string;
  recommendations: string[];
  per_question: Array<{ question_id: string; summary: string }>;
};

export async function generateSurveyQuestions(input: {
  brief: string;
  industry?: string;
  goal?: string;
  length?: string;
}) {
  const { data, error } = await supabase.functions.invoke<GeneratedQuestion[]>("generate-survey-questions", {
    body: input,
  });

  if (error) throw error;
  return data ?? [];
}

export async function generateAnalyticsInsights(input: {
  survey_id: string;
  transcripts: string[];
}) {
  const { data, error } = await supabase.functions.invoke<AnalyticsInsightResult>("generate-analytics-insights", {
    body: input,
  });

  if (error) throw error;
  return data;
}

export async function suggestFollowupQuestion(question_text: string) {
  const { data, error } = await supabase.functions.invoke<{ suggestions: string[] }>("suggest-followup-question", {
    body: { question_text },
  });

  if (error) throw error;
  return data?.suggestions ?? [];
}

export async function scoreResponseQuality(input: {
  transcript_text: string;
  question_text: string;
}) {
  const { data, error } = await supabase.functions.invoke<{ score: number; rationale: string }>("score-response-quality", {
    body: input,
  });

  if (error) throw error;
  return data;
}

export async function generateSurveyHealth(input: {
  questions: string[];
  question_count: number;
  has_intro: boolean;
  has_hint_texts: boolean;
}) {
  const { data, error } = await supabase.functions.invoke<{ score: number; tips: Array<{ message: string; field: string }> }>("generate-survey-health", {
    body: input,
  });

  if (error) throw error;
  return data;
}
