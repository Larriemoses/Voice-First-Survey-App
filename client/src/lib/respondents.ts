import { supabase } from "./supabase";

export async function createRespondent(input: {
  survey_id: string;
  display_name?: string;
  email?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from("respondents")
    .insert({
      survey_id: input.survey_id,
      display_name: input.display_name || null,
      email: input.email || null,
      phone: input.phone || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
