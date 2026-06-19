import { supabase } from "./supabase";
import { getMyOrganizationMembership, type Organization } from "./organization";

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
}): Promise<Organization> {
  const existingMembership = await getMyOrganizationMembership();

  if (existingMembership?.organization) {
    throw new Error("You already belong to an organization.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  const user = userData.user;

  if (!user) throw new Error("You must be logged in.");

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .insert({
      name: input.name.trim(),
      slug: toSlug(input.slug || input.name),
      owner_user_id: user.id,
    })
    .select("id, name, slug, owner_user_id, created_at")
    .single();

  if (organizationError) throw organizationError;

  const { error: membershipError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: organization.id,
      user_id: user.id,
      role: "owner",
    });

  if (membershipError) throw membershipError;

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    ownerId: organization.owner_user_id,
    createdAt: organization.created_at,
  };
}
