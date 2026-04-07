import { supabase } from "./supabase";

export async function getMyOrganizationMembership() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      id,
      role,
      created_at,
      organization:organizations (
        id,
        name,
        slug,
        owner_user_id,
        created_at
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const membership = data[0];

  return {
    id: membership.id,
    role: membership.role,
    created_at: membership.created_at,
    organization: Array.isArray(membership.organization)
      ? (membership.organization[0] ?? null)
      : membership.organization,
  };
}
