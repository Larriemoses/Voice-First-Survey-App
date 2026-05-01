import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { AuthShell } from "./AuthShell";
import { isValidEmail, mapAuthErrorMessage } from "./auth.utils";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter the email address for your account.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.error) {
        setError(mapAuthErrorMessage(result.error, "reset"));
        return;
      }

      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      centered
      eyebrow="Password recovery"
      title="Reset your password"
      description="Enter your email and we’ll send a secure link to reset your password."
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-brand-blue-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      }
    >
      {submitted ? (
        <EmptyState
          icon={<Mail className="h-5 w-5" />}
          title="Check your inbox"
          description={`A password reset link was sent to ${email.trim().toLowerCase()}. Open it on this device to set a new password.`}
        />
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Account email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error || undefined}
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
