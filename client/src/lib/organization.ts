import { supabase } from "./supabase";

type OrganizationRow = {
  id: string;
  name: string;
  slug: string | null;
  owner_user_id: string | null;
  created_at: string | null;
};

type MembershipRow = {
  id: string;
  role: string;
  created_at: string | null;
  organization: OrganizationRow | OrganizationRow[] | null;
};

export type Organization = {
  id: string;
  name: string;
  slug: string | null;
  ownerId: string | null;
  createdAt: string | null;
};

export type OrganizationMembership = {
  id: string;
  role: string;
  created_at: string | null;
  organization: Organization;
};

function mapOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    ownerId: row.owner_user_id,
    createdAt: row.created_at,
  };
}

export async function getMyOrganizationMembership(): Promise<OrganizationMembership | null> {
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
    .limit(1)
    .returns<MembershipRow[]>();

  if (error) throw error;
  if (!data?.length) return null;

  const membership = data[0];
  const organization = Array.isArray(membership.organization)
    ? membership.organization[0]
    : membership.organization;

  if (!organization) return null;

  return {
    id: membership.id,
    role: membership.role,
    created_at: membership.created_at,
    organization: mapOrganization(organization),
  };
}
