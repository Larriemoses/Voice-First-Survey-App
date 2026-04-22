import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  KeyRound,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AuthCard from "../components/AuthCard";
import PageMeta from "../components/PageMeta";
import { signInWithGoogle, signInWithPassword } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Add your email and password so we can sign you in.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signInWithPassword(cleanEmail, password);

      if (error) {
        const lowered = error.message.toLowerCase();

        if (
          lowered.includes("invalid login credentials") ||
          lowered.includes("invalid credentials")
        ) {
          setError("That email and password don't match. Try again.");
        } else if (
          lowered.includes("email not confirmed") ||
          lowered.includes("email_not_confirmed")
        ) {
          setError(
            "You still need to confirm your email. Check your inbox, then come right back.",
          );
        } else {
          setError(error.message);
        }

        return;
      }

      if (!data?.session) {
        setError(
          "We couldn't finish signing you in yet. Confirm your email first.",
        );
        return;
      }

      setSuccessMessage("You're in. Taking you to your workspace now.");
      window.setTimeout(() => navigate("/auth-check"), 700);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "We couldn't sign you in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    clearMessages();
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  }

  return (
    <>
      <PageMeta
        title="Welcome Back | Survica"
        description="Sign in to manage your voice surveys and team workflows"
      />

      <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden md:block">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                Voice feedback, without the friction
              </div>

              <div className="space-y-3">
                <h1 className="text-5xl font-semibold text-[var(--text)]">
                  Hear what people mean, not just what they typed
                </h1>
                <p className="max-w-lg text-base leading-7 text-[var(--text-muted)]">
                  Survica helps your team launch voice-first surveys, collect
                  clear spoken responses, and review insights without chasing
                  recordings across tools.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="space-y-3">
                  <ShieldCheck className="h-5 w-5 text-[var(--success)]" />
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    Built for trust
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    Give respondents a flow that feels simple, private, and easy
                    to finish.
                  </p>
                </Card>
                <Card className="space-y-3" variant="flat">
                  <ArrowRight className="h-5 w-5 text-[var(--accent)]" />
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    Move faster
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    Publish faster, review transcripts sooner, and keep your
                    team aligned.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          <AuthCard
            mode="login"
            title="Welcome Back"
            subtitle="Sign in to pick up right where you left off"
          >
            <div className="space-y-5">
              <Button
                onClick={handleGoogle}
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                leadingIcon={
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="h-5 w-5"
                  />
                }
              >
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border)]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[var(--surface)] px-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Or use email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.tar.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  leadingIcon={<Mail className="h-4 w-4" />}
                />

                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Add your password"
                  autoComplete="current-password"
                  leadingIcon={<KeyRound className="h-4 w-4" />}
                />

                {error ? (
                  <Feedback
                    variant="error"
                    title="We couldn't sign you in"
                    description={error}
                  />
                ) : null}

                {successMessage ? (
                  <Feedback
                    variant="success"
                    title="You're on your way"
                    description={successMessage}
                  />
                ) : null}

                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  className="w-full"
                  trailingIcon={
                    !loading ? <ArrowRight className="h-4 w-4" /> : undefined
                  }
                >
                  {loading ? "Signing you in" : "Sign in"}
                </Button>
              </form>

              <p className="text-center text-sm text-[var(--color-text-muted)]">
                New here?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-[var(--accent)]"
                >
                  Create your account
                </Link>
              </p>
            </div>
          </AuthCard>
        </div>
      </div>
    </>
  );
}
