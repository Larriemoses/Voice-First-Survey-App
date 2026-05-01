export type AuthErrorContext = "login" | "signup" | "reset" | "confirm";

export function mapAuthErrorMessage(
  input: string | null | undefined,
  context: AuthErrorContext,
) {
  const message = input?.trim();

  if (!message) {
    return "Something went wrong. Please try again.";
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "Check your email and password, then try again.";
  }

  if (
    normalized.includes("email not confirmed") ||
    normalized.includes("not confirmed")
  ) {
    return "Check your inbox and confirm your email before signing in.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("security purposes")
  ) {
    return "Too many attempts. Wait a moment, then try again.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("fetch")
  ) {
    return "There was a network issue. Check your connection and try again.";
  }

  if (context === "signup" && normalized.includes("already registered")) {
    return "That email already has an account. Try logging in instead.";
  }

  if (context === "reset" && normalized.includes("expired")) {
    return "This reset link has expired. Request a new password reset email.";
  }

  if (context === "confirm" && normalized.includes("expired")) {
    return "This confirmation link has expired. Request a new confirmation email.";
  }

  return message;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
};

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return { score: score as 0 | 1, label: "Weak" };
  }

  if (score === 2) {
    return { score: 2, label: "Fair" };
  }

  if (score === 3) {
    return { score: 3, label: "Strong" };
  }

  return { score: 4, label: "Very strong" };
}

export function getPasswordStrengthTone(score: PasswordStrength["score"]) {
  if (score <= 1) {
    return "bg-status-danger";
  }

  if (score === 2) {
    return "bg-brand-orange";
  }

  return "bg-status-success";
}

export function toInviteList(value: string) {
  return value
    .split(/[,\n]/)
    .map((email) => email.trim().toLowerCase())
    .filter((email, index, list) => email.length > 0 && list.indexOf(email) === index);
}
