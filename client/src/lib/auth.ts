import type { EmailOtpType } from "@supabase/supabase-js";
import { supabase, appUrl } from "./supabase";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildRedirectUrl(path: string) {
  return `${appUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildAuthConfirmPath(email?: string | null) {
  const params = new URLSearchParams();

  if (email) {
    params.set("email", normalizeEmail(email));
  }

  const query = params.toString();
  return `/auth/confirm${query ? `?${query}` : ""}`;
}

function trimOrUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
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

type SignUpMetadata = {
  fullName?: string;
  organizationName?: string;
};

export async function signUpWithPassword(
  email: string,
  password: string,
  metadata?: SignUpMetadata,
) {
  const normalizedEmail = normalizeEmail(email);

  // Supabase Auth settings should use the same base value as VITE_APP_URL for
  // the site URL, and its redirect allow-list should include:
  // /auth-check, /auth/confirm, and /reset-password.
  return supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: buildRedirectUrl(buildAuthConfirmPath(normalizedEmail)),
      data: {
        full_name: trimOrUndefined(metadata?.fullName),
        organization_name: trimOrUndefined(metadata?.organizationName),
      },
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

export function isGoogleOAuthEnabled() {
  const value = import.meta.env.VITE_AUTH_GOOGLE_ENABLED;

  if (typeof value !== "string" || value.length === 0) {
    return true;
  }

  return value === "true";
}

export async function signOutUser() {
  return supabase.auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
    redirectTo: buildRedirectUrl("/reset-password"),
  });
}

export async function resendSignupConfirmationEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  return supabase.auth.resend({
    type: "signup",
    email: normalizedEmail,
    options: {
      emailRedirectTo: buildRedirectUrl(buildAuthConfirmPath(normalizedEmail)),
    },
  });
}

function isEmailOtpType(value: string): value is EmailOtpType {
  return [
    "signup",
    "magiclink",
    "invite",
    "recovery",
    "email_change",
    "email",
  ].includes(value);
}

export async function verifyEmailOtp(tokenHash: string, type: string) {
  if (!tokenHash || !isEmailOtpType(type)) {
    throw new Error("This confirmation link is invalid or incomplete.");
  }

  return supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });
}

export type RecoveryHashSession = {
  accessToken: string | null;
  refreshToken: string | null;
  type: string | null;
  errorCode: string | null;
  errorDescription: string | null;
};

export function parseRecoveryHash(hash: string): RecoveryHashSession {
  const rawHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(rawHash);

  return {
    accessToken: params.get("access_token"),
    refreshToken: params.get("refresh_token"),
    type: params.get("type"),
    errorCode: params.get("error"),
    errorDescription: params.get("error_description"),
  };
}

export async function restoreRecoverySession(hash: string) {
  const recovery = parseRecoveryHash(hash);

  if (recovery.errorDescription) {
    throw new Error(decodeURIComponent(recovery.errorDescription));
  }

  if (!recovery.accessToken || !recovery.refreshToken) {
    throw new Error("This password reset link is invalid or has expired.");
  }

  return supabase.auth.setSession({
    access_token: recovery.accessToken,
    refresh_token: recovery.refreshToken,
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

export async function updateCurrentUserPassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }

  return data.user;
}
