import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { isGoogleOAuthEnabled, signInWithGoogle } from "../../lib/auth";
import { AuthShell } from "./AuthShell";
import { mapAuthErrorMessage } from "./auth.utils";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.1 3.2v2.7h3.4c2-1.8 3.4-4.5 3.4-7.9Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.8l-3.4-2.7c-.9.6-2.2 1-3.8 1-2.9 0-5.3-1.9-6.2-4.6H2.3v2.8C4.1 20.4 7.8 23 12 23Z" />
      <path fill="#FBBC05" d="M5.8 13.9c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2V7.1H2.3C1.6 8.5 1.2 10.2 1.2 12s.4 3.5 1.1 4.9l3.5-3Z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1C17.5 2.1 15 1 12 1 7.8 1 4.1 3.6 2.3 7.1l3.5 2.8C6.7 7.3 9.1 5.4 12 5.4Z" />
    </svg>
  );
}

export default function LoginPage() {
  const { signIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const redirect = searchParams.get("redirect");

  const googleEnabled = useMemo(() => isGoogleOAuthEnabled(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signIn({
        email,
        password,
        redirectTo: redirect,
      });

      if (result.error) {
        setError(mapAuthErrorMessage(result.error, "login"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);

    try {
      const { error: googleError } = await signInWithGoogle(redirect);

      if (googleError) {
        setError(mapAuthErrorMessage(googleError.message, "login"));
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthShell
      title="Log in to your workspace"
      description="Access surveys, transcripts, analytics, and exports from one protected Survica workspace."
      footer={
        <p className="text-center text-sm text-text-secondary">
          New to Survica?{" "}
          <Link to="/signup" className="font-medium text-brand-blue hover:text-brand-blue-dark">
            Create an account
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        {googleEnabled ? (
          <>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignIn}
              loading={googleLoading}
              leadingIcon={!googleLoading ? <GoogleIcon /> : undefined}
            >
              Sign in with Google
            </Button>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-sm text-text-hint">or continue with email</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Work email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            labelAction={
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue transition-colors duration-150 hover:text-brand-blue-dark"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            }
          />

          <div className="flex items-center justify-between gap-3">
            <div className="min-h-5">
              {error ? <p className="text-sm text-status-danger">{error}</p> : null}
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand-blue transition-colors duration-150 hover:text-brand-blue-dark"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={submitting}
            trailingIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Sign in
          </Button>
        </form>

        <div className="rounded-lg border border-border bg-surface-page p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
              <KeyRound className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-text-primary">
                Sign-in redirects stay predictable
              </h2>
              <p className="text-sm text-text-secondary">
                If you followed a protected deep link, Survica returns you there after login. New accounts without a workspace continue to onboarding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
