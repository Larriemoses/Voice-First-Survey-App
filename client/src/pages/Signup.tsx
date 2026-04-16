import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { signInWithGoogle, signUpWithPassword } from "../lib/auth";

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
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signUpWithPassword(cleanEmail, password);

      if (error) {
        const lowered = error.message.toLowerCase();

        if (lowered.includes("already registered")) {
          setError("This email is already registered. Try signing in instead.");
        } else {
          setError(error.message);
        }
        return;
      }

      // If confirm email is enabled, Supabase typically returns user but no session.
      if (data?.session) {
        setSuccessMessage("Account created successfully. Redirecting...");
        window.setTimeout(() => {
          navigate("/auth-check");
        }, 900);
        return;
      }

      setSuccessMessage(
        "Account created successfully. Please check your email to confirm your account before signing in.",
      );
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create account.",
      );
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
        title="Create your account"
        subtitle="Start building voice-first surveys for your organization."
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
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                className="brand-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
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
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
}
