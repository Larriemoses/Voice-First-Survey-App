import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: "VITE_SUPABASE_URL") {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function getSupabaseAnonKey() {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (anonKey) {
    return anonKey;
  }

  const legacyPublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (legacyPublishableKey) {
    return legacyPublishableKey;
  }

  throw new Error("VITE_SUPABASE_ANON_KEY is required.");
}

function normalizeAppUrl(value: string | undefined) {
  if (!value) {
    return window.location.origin;
  }

  return value.replace(/\/+$/, "");
}

export const appUrl = normalizeAppUrl(import.meta.env.VITE_APP_URL);
const supabaseUrl = getRequiredEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = getSupabaseAnonKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export const publicSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
