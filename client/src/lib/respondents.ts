import { supabase } from "./supabase";

export type CreateRespondentInput = {
  survey_id: string;
  display_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type Respondent = {
  id: string;
  survey_id: string;
  display_name: string | null;
  email: string | null;
  phone: string | null;
};

export async function createRespondent(input: CreateRespondentInput) {
  const respondentId = crypto.randomUUID();

  const payload: Respondent = {
    id: respondentId,
    survey_id: input.survey_id,
    display_name: input.display_name?.trim() || null,
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
  };

  const { error } = await supabase.from("respondents").insert(payload);

  if (error) {
    console.error("Respondent insert error:", error);
    throw new Error(error.message || "Failed to create respondent.");
  }

  return payload;
}