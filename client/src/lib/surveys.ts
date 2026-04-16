import { supabase } from "./supabase";
import { getMyOrganizationMembership } from "./organization";

export type SurveyStatus = "draft" | "published" | "closed";

export type SurveyRecord = {
  id: string;
  title: string;
  description: string | null;
  status: SurveyStatus;
  organization_id?: string;
  created_by?: string;
  created_at?: string;
  logo_url?: string | null;
  header_text?: string | null;
};

export type GeneratedSurveyDraft = {
  title: string;
  description: string;
  questions: {
    prompt: string;
    max_duration_seconds: number;
  }[];
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_");
}

export async function getMySurveys() {
  const membership = await getMyOrganizationMembership();

  if (!membership?.organization?.id) {
    return [];
  }

  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("organization_id", membership.organization.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSurvey(input: {
  title: string;
  description?: string;
}) {
  const [{ data: userData, error: userError }, membership] = await Promise.all([
    supabase.auth.getUser(),
    getMyOrganizationMembership(),
  ]);

  if (userError) throw userError;

  const user = userData.user;
  if (!user) throw new Error("You must be logged in.");

  if (!membership?.organization?.id) {
    throw new Error("No organization found for this account.");
  }

  const { data, error } = await supabase
    .from("surveys")
    .insert({
      title: input.title,
      description: input.description || null,
      organization_id: membership.organization.id,
      created_by: user.id,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSurveyById(surveyId: string) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", surveyId)
    .single();

  if (error) throw error;
  return data as SurveyRecord;
}

export async function updateSurvey(
  surveyId: string,
  input: {
    title?: string;
    description?: string | null;
    status?: SurveyStatus;
    logo_url?: string | null;
    header_text?: string | null;
  },
) {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.status !== undefined) payload.status = input.status;
  if (input.logo_url !== undefined) payload.logo_url = input.logo_url;
  if (input.header_text !== undefined) payload.header_text = input.header_text;

  const { data, error } = await supabase
    .from("surveys")
    .update(payload)
    .eq("id", surveyId)
    .select()
    .single();

  if (error) throw error;
  return data as SurveyRecord;
}

export async function uploadSurveyLogo(surveyId: string, file: File) {
  const fileExt = file.name.split(".").pop() || "png";
  const filePath = `survey-branding/${surveyId}/${Date.now()}-${sanitizeFileName(
    file.name.replace(`.${fileExt}`, ""),
  )}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("voice-surveys")
    .upload(filePath, file, {
      contentType: file.type || "image/png",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data, error: signedUrlError } = await supabase.storage
    .from("voice-surveys")
    .createSignedUrl(filePath, 60 * 60 * 24 * 365);

  if (signedUrlError) throw signedUrlError;

  return {
    path: filePath,
    signedUrl: data.signedUrl,
  };
}

export async function deleteSurvey(surveyId: string) {
  const { error: questionsError } = await supabase
    .from("questions")
    .delete()
    .eq("survey_id", surveyId);

  if (questionsError) throw questionsError;

  const { error } = await supabase.from("surveys").delete().eq("id", surveyId);

  if (error) throw error;
}

export async function getSurveyQuestions(surveyId: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", surveyId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addQuestion(input: {
  survey_id: string;
  prompt: string;
  order_index: number;
  max_duration_seconds?: number | null;
}) {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      survey_id: input.survey_id,
      prompt: input.prompt,
      order_index: input.order_index,
      max_duration_seconds: input.max_duration_seconds ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuestion(
  questionId: string,
  input: {
    prompt?: string;
    max_duration_seconds?: number | null;
    order_index?: number;
  },
) {
  const payload: Record<string, unknown> = {};

  if (input.prompt !== undefined) payload.prompt = input.prompt;
  if (input.max_duration_seconds !== undefined) {
    payload.max_duration_seconds = input.max_duration_seconds;
  }
  if (input.order_index !== undefined) payload.order_index = input.order_index;

  const { data, error } = await supabase
    .from("questions")
    .update(payload)
    .eq("id", questionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuestion(questionId: string) {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (error) throw error;
}

export async function publishSurvey(surveyId: string) {
  const { data, error } = await supabase
    .from("surveys")
    .update({ status: "published" })
    .eq("id", surveyId)
    .select()
    .single();

  if (error) throw error;
  return data as SurveyRecord;
}

export async function closeSurvey(surveyId: string) {
  const { data, error } = await supabase
    .from("surveys")
    .update({ status: "closed" })
    .eq("id", surveyId)
    .select()
    .single();

  if (error) throw error;
  return data as SurveyRecord;
}

export async function getPublicSurveyById(surveyId: string) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", surveyId)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data as SurveyRecord | null;
}

export async function getPublicSurveyQuestions(surveyId: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", surveyId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function generateSurveyDraftFromBrief(brief: string) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const session = sessionData.session;

  if (!session?.access_token) {
    throw new Error("You must be logged in.");
  }

  const { data, error } = await supabase.functions.invoke(
    "generate-survey-draft",
    {
      body: { brief },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );

  if (error) {
    console.error("generate-survey-draft invoke error:", error);

    const maybeContext = (error as { context?: { text?: () => Promise<string> } })
      ?.context;

    if (maybeContext && typeof maybeContext.text === "function") {
      const rawText = await maybeContext.text();
      console.error("generate-survey-draft raw error response:", rawText);

      try {
        const parsed = JSON.parse(rawText);
        throw new Error(
          parsed?.error ||
            parsed?.message ||
            parsed?.details?.error?.message ||
            rawText,
        );
      } catch {
        throw new Error(rawText || "Failed to generate survey draft.");
      }
    }

    throw new Error(error.message || "Failed to generate survey draft.");
  }

  if (
    !data ||
    typeof data.title !== "string" ||
    typeof data.description !== "string" ||
    !Array.isArray(data.questions)
  ) {
    console.error("Invalid AI response:", data);
    throw new Error("Generated survey draft has an invalid shape.");
  }

  return data as GeneratedSurveyDraft;
}
