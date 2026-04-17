import { CheckCircle2 } from "lucide-react";
import PageMeta from "../components/PageMeta";
import { Card } from "../components/ui/Card";

export default function SurveyThankYou() {
  return (
    <>
      <PageMeta
        title="Response Submitted | Survica"
        description="Your voice response has been submitted successfully"
      />

      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg text-center" variant="elevated">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-success)_14%,transparent)] text-[var(--color-success)]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-[var(--color-text)]">
            Thanks, you're all set
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            Your voice responses are safely recorded. You can close this tab whenever you're ready.
          </p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Powered by Survica
          </p>
        </Card>
      </div>
    </>
  );
}
