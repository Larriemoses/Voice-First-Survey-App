import { supabase } from "./supabase";
import { getMyOrganizationMembership } from "./organization";

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
  return data;
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

export async function publishSurvey(surveyId: string) {
  const { data, error } = await supabase
    .from("surveys")
    .update({ status: "published" })
    .eq("id", surveyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function closeSurvey(surveyId: string) {
  const { data, error } = await supabase
    .from("surveys")
    .update({ status: "closed" })
    .eq("id", surveyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPublicSurveyById(surveyId: string) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", surveyId)
    .eq("status", "published")
    .single();

  if (error) throw error;
  return data;
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
