import { supabase, appUrl } from "./supabase";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildRedirectUrl(path: string) {
  return `${appUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function sanitizeRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });
}

export async function signUpWithPassword(email: string, password: string) {
  return supabase.auth.signUp({
    email: normalizeEmail(email),
    password,
    options: {
      emailRedirectTo: buildRedirectUrl("/auth-check"),
    },
  });
}

export async function signInWithGoogle(redirectPath?: string | null) {
  const redirect = sanitizeRedirectPath(redirectPath);
  const query = redirect
    ? `?redirect=${encodeURIComponent(redirect)}`
    : "";

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildRedirectUrl(`/auth-check${query}`),
    },
  });
}

export async function signOutUser() {
  return supabase.auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
    redirectTo: buildRedirectUrl("/login"),
  });
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export async function updateCurrentUserProfile(input: { fullName: string }) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: input.fullName.trim(),
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}
