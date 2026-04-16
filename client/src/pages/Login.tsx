import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { signInWithGoogle, signInWithPassword } from "../lib/auth";

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
      setError("Please enter your email and password.");
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
          setError("Invalid email or password.");
        } else if (
          lowered.includes("email not confirmed") ||
          lowered.includes("email_not_confirmed")
        ) {
          setError(
            "Your email is not confirmed yet. Please check your inbox and confirm your account first.",
          );
        } else {
          setError(error.message);
        }

        return;
      }

      if (!data?.session) {
        setError(
          "Login could not be completed. Please confirm your email first or try again.",
        );
        return;
      }

      setSuccessMessage("Signed in successfully. Redirecting...");

      window.setTimeout(() => {
        navigate("/auth-check");
      }, 700);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    clearMessages();

    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to manage your organization surveys."
      >
        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            type="button"
            className="brand-btn-secondary w-full cursor-pointer py-3 text-slate-700"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="brand-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="brand-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="brand-btn-primary w-full cursor-pointer py-3"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-indigo-700">
              Sign up
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
}
