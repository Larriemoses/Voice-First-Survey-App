import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, KeyRound, Mail, Sparkles, Users } from "lucide-react";
import AuthCard from "../components/AuthCard";
import PageMeta from "../components/PageMeta";
import { signInWithGoogle, signUpWithPassword } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!cleanEmail || !password || !confirmPassword) {
      setError("Add your email and choose a password to get started.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Those passwords don't match yet. Try one more time.");
      return;
    }

    if (password.length < 6) {
      setError("Use at least 6 characters so your account stays secure.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signUpWithPassword(cleanEmail, password);

      if (error) {
        const lowered = error.message.toLowerCase();
        if (lowered.includes("already registered")) {
          setError("That email's already in use. Try signing in instead.");
        } else {
          setError(error.message);
        }
        return;
      }

      if (data?.session) {
        setSuccessMessage("Your account is ready. Taking you into setup now.");
        window.setTimeout(() => navigate("/auth-check"), 900);
        return;
      }

      setSuccessMessage(
        "Your account is ready. Check your inbox to confirm your email, then sign in.",
      );
    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "We couldn't create your account.");
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
        title="Create Account | Survica"
        description="Create your Survica account and start building voice-first surveys"
      />

      <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 md:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden md:block">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                Set up your survey workspace
              </div>

              <div className="space-y-3">
                <h1 className="text-5xl font-semibold text-[var(--text)]">
                  Build a calmer way to collect honest feedback
                </h1>
                <p className="max-w-lg text-base leading-7 text-[var(--text-muted)]">
                  Create your workspace, publish voice surveys, and review responses in a UI that helps your team move with confidence.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="space-y-3">
                  <Users className="h-5 w-5 text-[var(--accent)]" />
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    Team-ready from day one
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    Start with your workspace, then invite your team into a clean survey flow.
                  </p>
                </Card>
                <Card className="space-y-3" variant="flat">
                  <ArrowRight className="h-5 w-5 text-[var(--accent)]" />
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    Go from draft to live
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    Launch your first survey in minutes and keep the experience smooth for respondents.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          <AuthCard
            mode="signup"
            title="Create Account"
            subtitle="Let's get your workspace ready so you can launch your first survey"
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  leadingIcon={<Mail className="h-4 w-4" />}
                />

                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password"
                  autoComplete="new-password"
                  leadingIcon={<KeyRound className="h-4 w-4" />}
                  helperText="Use at least 6 characters"
                />

                <Input
                  type="password"
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  leadingIcon={<KeyRound className="h-4 w-4" />}
                />

                {error ? (
                  <Feedback variant="error" title="We couldn't create your account" description={error} />
                ) : null}

                {successMessage ? (
                  <Feedback
                    variant="success"
                    title="You're almost there"
                    description={successMessage}
                  />
                ) : null}

                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  className="w-full"
                  trailingIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
                >
                  {loading ? "Creating your account" : "Create account"}
                </Button>
              </form>

              <p className="text-center text-sm text-[var(--color-text-muted)]">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[var(--accent)]">
                  Sign in
                </Link>
              </p>
            </div>
          </AuthCard>
        </div>
      </div>
    </>
  );
}
