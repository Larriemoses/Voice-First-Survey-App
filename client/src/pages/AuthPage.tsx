import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { PublicNav } from "../components/layout/PublicNav";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { signInWithGoogle, signInWithPassword, signUpWithPassword } from "../lib/auth";

type AuthPageProps = {
  mode: "login" | "signup";
};

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim() || !password) {
      setError("Add your email and password to continue.");
      return;
    }

    try {
      setLoading(true);
      const result = isSignup
        ? await signUpWithPassword(email, password)
        : await signInWithPassword(email, password);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data.session) {
        navigate("/dashboard");
        return;
      }

      setMessage("Check your inbox to confirm your email, then sign in.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setMessage("");
    setError("");
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <main className="mx-auto grid max-w-5xl gap-6 px-5 py-12 md:grid-cols-[1fr_420px] md:items-center md:py-20">
        <section>
          <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
            Secure workspace access
          </span>
          <h1 className="mt-5 max-w-xl text-3xl font-medium leading-tight text-gray-900">
            {isSignup ? "Create your Survica workspace." : "Log in to your Survica workspace."}
          </h1>
          <p className="mt-4 max-w-lg text-md leading-7 text-gray-500">
            Public visitors can learn about Survica and answer shared surveys. Survey creation, dashboards, analytics, team settings, and exports stay inside authenticated workspaces.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Card>
              <ShieldCheck className="h-5 w-5 text-success" />
              <h2 className="mt-4 text-base font-medium text-gray-900">Admin-only insights</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">Reports, transcripts, exports, and team tools require a signed-in account.</p>
            </Card>
            <Card>
              <Mail className="h-5 w-5 text-primary-500" />
              <h2 className="mt-4 text-base font-medium text-gray-900">No respondent login</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">People answering public survey links still get a simple, anonymous voice flow.</p>
            </Card>
          </div>
        </section>

        <Card className="p-6">
          <h2 className="text-xl font-medium text-gray-900">{isSignup ? "Get started free" : "Welcome back"}</h2>
          <p className="mt-2 text-sm text-gray-500">
            {isSignup ? "Create an account to build and analyse surveys." : "Enter your details to access your dashboard."}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="mt-6 w-full"
            onClick={handleGoogleAuth}
            leadingIcon={<GoogleIcon />}
          >
            {isSignup ? "Sign up with Google" : "Sign in with Google"}
          </Button>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or use email</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isSignup ? "Choose a password" : "Enter your password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}
            {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-success">{message}</p> : null}
            <Button type="submit" loading={loading} className="w-full" trailingIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}>
              {isSignup ? "Create account" : "Log in"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-500">
            {isSignup ? "Already have an account?" : "New to Survica?"}{" "}
            <Link to={isSignup ? "/login" : "/signup"} className="font-medium text-primary-500">
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}

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
