import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Chip";
import { Input } from "../../components/ui/Input";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Textarea } from "../../components/ui/Textarea";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../hooks/useAuth";
import { createOrganization } from "../../lib/onboarding";
import { cn } from "../../utils/helpers";
import { AuthShell } from "./AuthShell";
import { toInviteList } from "./auth.utils";

const useCases = [
  "Customer feedback",
  "Product research",
  "Employee pulse",
  "Event follow-up",
  "Exit survey",
  "Other",
] as const;

const stepLabels = [
  "Organisation details",
  "Primary use case",
  "Invite your team",
] as const;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, refreshOrganization } = useAuth();
  const [step, setStep] = useState(0);
  const [organizationName, setOrganizationName] = useState(() => {
    const metadataValue = user?.user_metadata?.organization_name;
    return typeof metadataValue === "string" ? metadataValue : "";
  });
  const [primaryUseCase, setPrimaryUseCase] = useState<(typeof useCases)[number] | "">("");
  const [inviteDraft, setInviteDraft] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const inviteList = useMemo(() => toInviteList(inviteDraft), [inviteDraft]);
  const progressValue = ((step + 1) / stepLabels.length) * 100;

  function handleNext() {
    setError("");

    if (step === 0 && !organizationName.trim()) {
      setError("Enter the organisation name for this workspace.");
      return;
    }

    if (step === 1 && !primaryUseCase) {
      setError("Choose the main use case for this workspace.");
      return;
    }

    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
  }

  function handleBack() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function completeOnboarding() {
    setError("");
    setSaving(true);

    try {
      await createOrganization({
        name: organizationName,
      });

      const refreshResult = await refreshOrganization();

      if (refreshResult.error) {
        setError(refreshResult.error);
        return;
      }

      showToast({
        title: "Workspace created",
        description:
          inviteList.length > 0
            ? "Your workspace is ready. Add and manage team members from settings."
            : "Your workspace is ready.",
        variant: "success",
      });

      navigate("/dashboard", { replace: true });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We couldn't finish your workspace setup.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ProgressBar value={progressValue} visible />
      <AuthShell
        centered
        eyebrow="Workspace onboarding"
        title="Finish setting up Survica"
        description="A quick three-step setup makes sure protected routes, dashboard access, and workspace ownership are ready before you publish surveys."
        cardClassName="max-w-none"
      >
        <div className="space-y-6">
          <div className="grid gap-2 sm:grid-cols-3">
            {stepLabels.map((label, index) => {
              const active = index === step;
              const complete = index < step;

              return (
                <div
                  key={label}
                  className={cn(
                    "rounded-lg border p-3 text-left",
                    active
                      ? "border-brand-blue bg-brand-blue-light"
                      : complete
                        ? "border-status-success/30 bg-status-success/10"
                        : "border-border bg-surface-page",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      active
                        ? "text-brand-blue"
                        : complete
                          ? "text-status-success"
                          : "text-text-secondary",
                    )}
                  >
                    Step {index + 1}
                  </p>
                  <p className="mt-1 text-sm text-text-primary">{label}</p>
                </div>
              );
            })}
          </div>

          <Card variant="muted" hoverable={false} className="space-y-5">
            {step === 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium text-text-primary">
                    Name your organisation
                  </h2>
                  <p className="text-sm text-text-secondary">
                    This is the workspace name your team will see across surveys, results, analytics, and exports.
                  </p>
                </div>
                <Input
                  label="Organisation name"
                  name="organizationName"
                  placeholder="Acme customer team"
                  leadingIcon={<Building2 className="h-4 w-4" />}
                  value={organizationName}
                  onChange={(event) => setOrganizationName(event.target.value)}
                  error={step === 0 ? error || undefined : undefined}
                />
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium text-text-primary">
                    What will this workspace focus on first?
                  </h2>
                  <p className="text-sm text-text-secondary">
                    We use this only to tailor onboarding context. You can change direction later.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {useCases.map((option) => (
                    <Chip
                      key={option}
                      active={primaryUseCase === option}
                      onClick={() => setPrimaryUseCase(option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </div>
                {step === 1 && error ? (
                  <p className="text-sm text-status-danger">{error}</p>
                ) : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium text-text-primary">
                    Invite teammates
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Add email addresses separated by commas or new lines. Invites are optional here and can also be managed later from settings.
                  </p>
                </div>
                <Textarea
                  label="Team emails"
                  name="inviteEmails"
                  placeholder={"jane@company.com\nsam@company.com"}
                  leadingIcon={<Users className="h-4 w-4" />}
                  value={inviteDraft}
                  onChange={(event) => setInviteDraft(event.target.value)}
                />
                {inviteList.length > 0 ? (
                  <div className="rounded-lg border border-border bg-surface-card p-4">
                    <p className="text-sm font-medium text-text-primary">
                      {inviteList.length} teammate{inviteList.length === 1 ? "" : "s"} ready
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {inviteList.map((email) => (
                        <Chip key={email}>{email}</Chip>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border-strong bg-surface-card p-4 text-sm text-text-secondary">
                    Leave this blank if you want to finish setup first and invite your team later.
                  </div>
                )}
                {error ? <p className="text-sm text-status-danger">{error}</p> : null}
              </div>
            ) : null}
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={step === 0 || saving}
                leadingIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              {step === 2 ? (
                <Button
                  variant="ghost"
                  onClick={completeOnboarding}
                  disabled={saving}
                >
                  Skip for now
                </Button>
              ) : null}
            </div>

            {step < stepLabels.length - 1 ? (
              <Button
                onClick={handleNext}
                trailingIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                loading={saving}
                trailingIcon={!saving ? <ArrowRight className="h-4 w-4" /> : undefined}
              >
                Create workspace
              </Button>
            )}
          </div>
        </div>
      </AuthShell>
    </>
  );
}
