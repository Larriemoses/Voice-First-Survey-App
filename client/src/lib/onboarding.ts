import { supabase } from "./supabase";
import { getOrganizationByOwnerId, type Organization } from "./organization";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type CreateOrganizationInput = {
  name: string;
  slug?: string;
};

type OrganizationInsertRow = {
  id: string;
  name: string;
  slug: string | null;
  owner_id: string | null;
  created_at: string | null;
};

function mapOrganization(row: OrganizationInsertRow): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  };
}

export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<Organization> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const existingOrganization = await getOrganizationByOwnerId(user.id);

  if (existingOrganization) {
    throw new Error("You already own an organization.");
  }

  const finalSlug = toSlug(input.slug || input.name);

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name: input.name.trim(),
      slug: finalSlug,
      owner_id: user.id,
    })
    .select("id, name, slug, owner_id, created_at")
    .single<OrganizationInsertRow>();

  if (error) {
    throw error;
  }

  return mapOrganization(data);
}
