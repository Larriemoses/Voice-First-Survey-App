import { supabase } from "./supabase";
import { getMyOrganizationMembership } from "./organization";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createOrganization(input: {
  name: string;
  slug?: string;
}) {
  const existingMembership = await getMyOrganizationMembership();

  if (existingMembership?.organization) {
    throw new Error("You already belong to an organization.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  const user = userData.user;

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const finalSlug = toSlug(input.slug || input.name);

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: input.name,
      slug: finalSlug,
      owner_user_id: user.id,
    })
    .select()
    .single();

  if (orgError) throw orgError;

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: organization.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) throw memberError;

  return organization;
}
