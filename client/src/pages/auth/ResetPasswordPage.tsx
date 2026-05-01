import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { SkeletonBlock } from "../../components/ui/SkeletonBlock";
import { useToast } from "../../components/ui/Toast";
import {
  getCurrentSession,
  restoreRecoverySession,
  updateCurrentUserPassword,
} from "../../lib/auth";
import { AuthShell } from "./AuthShell";
import { getPasswordStrength, mapAuthErrorMessage } from "./auth.utils";

type ResetState = "preparing" | "ready" | "error";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState<ResetState>("preparing");
  const [setupError, setSetupError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    let active = true;

    async function prepareRecoverySession() {
      try {
        if (window.location.hash) {
          const { error } = await restoreRecoverySession(window.location.hash);

          if (error) {
            throw error;
          }

          window.history.replaceState(
            null,
            document.title,
            `${window.location.pathname}${window.location.search}`,
          );
        }

        const session = await getCurrentSession();

        if (!session?.user) {
          throw new Error("This password reset link is invalid or has expired.");
        }

        if (active) {
          setStatus("ready");
        }
      } catch (error) {
        if (active) {
          setSetupError(
            mapAuthErrorMessage(
              error instanceof Error ? error.message : "We couldn't verify this reset link.",
              "reset",
            ),
          );
          setStatus("error");
        }
      }
    }

    void prepareRecoverySession();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (!password) {
      setSubmitError("Enter your new password.");
      return;
    }

    if (password.length < 8) {
      setSubmitError("Use at least 8 characters for your new password.");
      return;
    }

    if (confirmPassword !== password) {
      setSubmitError("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      await updateCurrentUserPassword(password);
      showToast({
        title: "Password updated",
        description: "Your password has been changed. Redirecting to your workspace.",
        variant: "success",
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(
        mapAuthErrorMessage(
          error instanceof Error ? error.message : "We couldn't update your password.",
          "reset",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthShell
      centered
      eyebrow="Set a new password"
      title="Choose your new password"
      description="This reset flow is session-based. Once the link is verified, your new password is saved immediately to the current account."
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
      {status === "preparing" ? (
        <div className="space-y-4">
          <SkeletonBlock className="h-10 w-32" />
          <SkeletonBlock className="h-[38px]" />
          <SkeletonBlock className="h-[38px]" />
          <SkeletonBlock className="h-[46px]" />
        </div>
      ) : null}

      {status === "error" ? (
        <EmptyState
          icon={<LockKeyhole className="h-5 w-5" />}
          title="This reset link is not available"
          description={setupError}
          action={
            <Button variant="secondary" onClick={() => navigate("/forgot-password")}>
              Request a new reset link
            </Button>
          }
        />
      ) : null}

      {status === "ready" ? (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="New password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder="Create a new password"
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
          <p className="text-sm text-text-secondary">
            Password strength:{" "}
            <span className="font-medium text-text-primary">
              {password ? strength.label : "Not set"}
            </span>
          </p>
          <Input
            label="Confirm new password"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={submitError || undefined}
          />
          <Button type="submit" size="lg" className="w-full" loading={saving}>
            Save new password
          </Button>
        </form>
      ) : null}
    </AuthShell>
  );
}
