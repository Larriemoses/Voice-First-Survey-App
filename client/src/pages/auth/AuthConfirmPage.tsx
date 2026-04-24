import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonBlock } from "../../components/ui/SkeletonBlock";
import { useToast } from "../../components/ui/Toast";
import {
  resendSignupConfirmationEmail,
  verifyEmailOtp,
} from "../../lib/auth";
import { AuthShell } from "./AuthShell";
import { mapAuthErrorMessage } from "./auth.utils";

type ConfirmStatus = "verifying" | "error";

export default function AuthConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [status, setStatus] = useState<ConfirmStatus>("verifying");
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const email = useMemo(() => searchParams.get("email"), [searchParams]);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  useEffect(() => {
    let active = true;

    async function confirmEmail() {
      try {
        if (!tokenHash || !type) {
          throw new Error("This confirmation link is missing required details.");
        }

        const { error } = await verifyEmailOtp(tokenHash, type);

        if (error) {
          throw error;
        }

        showToast({
          title: "Email confirmed",
          description: "Your account is verified. Redirecting to your workspace.",
          variant: "success",
        });

        navigate("/dashboard", { replace: true });
      } catch (caughtError) {
        if (active) {
          setError(
            mapAuthErrorMessage(
              caughtError instanceof Error
                ? caughtError.message
                : "We couldn't verify this email link.",
              "confirm",
            ),
          );
          setStatus("error");
        }
      }
    }

    void confirmEmail();

    return () => {
      active = false;
    };
  }, [navigate, showToast, tokenHash, type]);

  async function handleResend() {
    if (!email) {
      return;
    }

    setResendLoading(true);
    setResendMessage("");

    try {
      const { error: resendError } = await resendSignupConfirmationEmail(email);

      if (resendError) {
        setError(mapAuthErrorMessage(resendError.message, "confirm"));
        return;
      }

      setResendMessage(`A new confirmation email was sent to ${email}.`);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthShell
      centered
      eyebrow="Email confirmation"
      title="Confirming your email"
      description="Survica is verifying the confirmation token before opening your workspace."
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
      {status === "verifying" ? (
        <div className="space-y-4">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-16 rounded-lg" />
          <SkeletonBlock className="h-[46px]" />
        </div>
      ) : (
        <div className="space-y-4">
          <EmptyState
            icon={<MailCheck className="h-5 w-5" />}
            title="This confirmation link could not be used"
            description={error}
            action={
              email ? (
                <Button
                  variant="secondary"
                  onClick={handleResend}
                  loading={resendLoading}
                >
                  Request a new confirmation link
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => navigate("/signup")}>
                  Request a new confirmation link
                </Button>
              )
            }
          />
          {resendMessage ? <p className="text-sm text-status-success">{resendMessage}</p> : null}
        </div>
      )}
    </AuthShell>
  );
}
