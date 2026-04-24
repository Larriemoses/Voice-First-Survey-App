import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import {
  isGoogleOAuthEnabled,
  resendSignupConfirmationEmail,
  signInWithGoogle,
} from "../../lib/auth";
import { cn } from "../../utils/helpers";
import { AuthShell } from "./AuthShell";
import {
  getPasswordStrength,
  getPasswordStrengthTone,
  isValidEmail,
  mapAuthErrorMessage,
} from "./auth.utils";

type SignUpFields = {
  organizationName: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type SignUpFieldName = keyof SignUpFields;
type SignUpErrors = Partial<Record<SignUpFieldName, string>>;
type SignUpTouched = Partial<Record<SignUpFieldName, boolean>>;

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

function validateField(name: SignUpFieldName, fields: SignUpFields) {
  switch (name) {
    case "organizationName":
      return fields.organizationName.trim()
        ? ""
        : "Enter the organisation name for this workspace.";
    case "fullName":
      return fields.fullName.trim() ? "" : "Enter your full name.";
    case "email":
      if (!fields.email.trim()) {
        return "Enter your work email.";
      }

      return isValidEmail(fields.email) ? "" : "Enter a valid email address.";
    case "password":
      if (!fields.password) {
        return "Choose a password.";
      }

      return fields.password.length >= 8
        ? ""
        : "Use at least 8 characters.";
    case "confirmPassword":
      if (!fields.confirmPassword) {
        return "Confirm your password.";
      }

      return fields.confirmPassword === fields.password
        ? ""
        : "Passwords do not match.";
    case "acceptedTerms":
      return fields.acceptedTerms
        ? ""
        : "Accept the terms to create your workspace.";
    default:
      return "";
  }
}

function validateAll(fields: SignUpFields): SignUpErrors {
  return {
    organizationName: validateField("organizationName", fields),
    fullName: validateField("fullName", fields),
    email: validateField("email", fields),
    password: validateField("password", fields),
    confirmPassword: validateField("confirmPassword", fields),
    acceptedTerms: validateField("acceptedTerms", fields),
  };
}

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [fields, setFields] = useState<SignUpFields>({
    organizationName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [touched, setTouched] = useState<SignUpTouched>({});
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const googleEnabled = useMemo(() => isGoogleOAuthEnabled(), []);
  const passwordStrength = getPasswordStrength(fields.password);

  function updateField<Name extends SignUpFieldName>(
    name: Name,
    value: SignUpFields[Name],
  ) {
    setFields((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleBlur(name: SignUpFieldName) {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, fields),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setResendMessage("");

    const nextErrors = validateAll(fields);
    setErrors(nextErrors);
    setTouched({
      organizationName: true,
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptedTerms: true,
    });

    const firstError = Object.values(nextErrors).find((value) => value);

    if (firstError) {
      setFormError(firstError);
      return;
    }

    setSubmitting(true);

    try {
      const result = await signUp({
        email: fields.email,
        password: fields.password,
        fullName: fields.fullName,
        organizationName: fields.organizationName,
      });

      if (result.error) {
        setFormError(mapAuthErrorMessage(result.error, "signup"));
        return;
      }

      if (result.data?.requiresEmailConfirmation) {
        setConfirmationEmail(fields.email.trim().toLowerCase());
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendConfirmation() {
    if (!confirmationEmail) {
      return;
    }

    setResendMessage("");
    setResendLoading(true);

    try {
      const { error } = await resendSignupConfirmationEmail(confirmationEmail);

      if (error) {
        setFormError(mapAuthErrorMessage(error.message, "confirm"));
        return;
      }

      setResendMessage(`Another confirmation email was sent to ${confirmationEmail}.`);
    } finally {
      setResendLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setFormError("");
    setGoogleLoading(true);

    try {
      const { error } = await signInWithGoogle("/onboarding");

      if (error) {
        setFormError(mapAuthErrorMessage(error.message, "signup"));
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  if (confirmationEmail) {
    return (
      <AuthShell
        centered
        eyebrow="Check your inbox"
        title="Confirm your email to finish setup"
        description="We sent a confirmation link so Survica can safely activate your account."
        footer={
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-brand-blue-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to login
          </Link>
        }
      >
        <div className="space-y-5">
          <EmptyState
            icon={<MailCheck className="h-5 w-5" />}
            title="Confirmation email sent"
            description={`Open the message we sent to ${confirmationEmail} and follow the link to continue.`}
            action={
              <Button
                variant="secondary"
                onClick={handleResendConfirmation}
                loading={resendLoading}
              >
                Resend confirmation email
              </Button>
            }
          />
          {formError ? <p className="text-sm text-status-danger">{formError}</p> : null}
          {resendMessage ? <p className="text-sm text-status-success">{resendMessage}</p> : null}
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your Survica workspace"
      description="Set up your account, confirm your email, and continue into workspace onboarding."
      footer={
        <p className="text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-blue hover:text-brand-blue-dark">
            Log in
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
              onClick={handleGoogleSignUp}
              loading={googleLoading}
              leadingIcon={!googleLoading ? <GoogleIcon /> : undefined}
            >
              Sign up with Google
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
            label="Organisation name"
            name="organizationName"
            placeholder="Acme customer team"
            value={fields.organizationName}
            onChange={(event) => updateField("organizationName", event.target.value)}
            onBlur={() => handleBlur("organizationName")}
            error={touched.organizationName ? errors.organizationName : undefined}
          />
          <Input
            label="Full name"
            name="fullName"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={fields.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            onBlur={() => handleBlur("fullName")}
            error={touched.fullName ? errors.fullName : undefined}
          />
          <Input
            label="Work email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            error={touched.email ? errors.email : undefined}
          />
          <div className="space-y-3">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={fields.password}
              onChange={(event) => updateField("password", event.target.value)}
              onBlur={() => handleBlur("password")}
              error={touched.password ? errors.password : undefined}
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
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((segment) => (
                  <div
                    key={segment}
                    className={cn(
                      "h-2 rounded-full bg-surface-muted",
                      segment < passwordStrength.score
                        ? getPasswordStrengthTone(passwordStrength.score)
                        : "",
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-text-secondary">
                Password strength:{" "}
                <span className="font-medium text-text-primary">
                  {fields.password ? passwordStrength.label : "Not set"}
                </span>
              </p>
            </div>
          </div>
          <Input
            label="Confirm password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={fields.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          <div className="space-y-2">
            <label className="flex items-start gap-3 rounded-lg border border-border bg-surface-page p-4 text-sm text-text-secondary">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border text-brand-blue focus:ring-brand-blue"
                checked={fields.acceptedTerms}
                onChange={(event) => updateField("acceptedTerms", event.target.checked)}
                onBlur={() => handleBlur("acceptedTerms")}
              />
              <span>
                I agree to the terms and acknowledge that Survica will process workspace data for survey operations and analytics.
              </span>
            </label>
            {touched.acceptedTerms && errors.acceptedTerms ? (
              <p className="text-sm text-status-danger">{errors.acceptedTerms}</p>
            ) : null}
          </div>

          {formError ? <p className="text-sm text-status-danger">{formError}</p> : null}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={submitting}
            trailingIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Create account
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
