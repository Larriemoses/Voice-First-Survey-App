import { supabase } from "./supabase";

type OrganizationRow = {
  id: string;
  name: string;
  slug: string | null;
  owner_id: string | null;
  created_at: string | null;
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
  role: "owner";
  created_at: string | null;
  organization: {
    id: string;
    name: string;
    slug: string | null;
    owner_id: string | null;
    created_at: string | null;
  };
};

function mapOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  };
}

export async function getOrganizationByOwnerId(
  userId: string,
): Promise<Organization | null> {
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, slug, owner_id, created_at")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .maybeSingle<OrganizationRow>();

  if (error) {
    throw error;
  }

  return data ? mapOrganization(data) : null;
}

export async function getMyOrganizationMembership(): Promise<OrganizationMembership | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const organization = await getOrganizationByOwnerId(user.id);

  if (!organization) {
    return null;
  }

  return {
    id: organization.id,
    role: "owner",
    created_at: organization.createdAt,
    organization: {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      owner_id: organization.ownerId,
      created_at: organization.createdAt,
    },
  };
}
