import { useState } from "react";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { createOrganization } from "../lib/onboarding";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Give your workspace a name so your team can recognize it.");
      return;
    }

    try {
      setLoading(true);
      await createOrganization({ name, slug });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't create your workspace.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        title="Workspace Setup"
        subtitle="Let's give your survey workspace a name and a clean home base"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Workspace name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Northwind Research Team"
              leadingIcon={<Building2 className="h-4 w-4" />}
              helperText="This is what your team will see around the app"
            />

            <Input
              label="Workspace slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. northwind-research"
              helperText="We'll create one for you if you leave this blank"
            />

            {error ? (
              <Feedback variant="error" title="Your workspace isn't ready yet" description={error} />
            ) : null}

            <Button
              type="submit"
              loading={loading}
              size="lg"
              trailingIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {loading ? "Saving your workspace" : "Save workspace"}
            </Button>
          </form>
        </Card>

        <Card variant="flat" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              What happens next
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              You're one step away from creating your first survey
            </p>
          </div>

          {[
            "Your workspace becomes the home for every survey you publish",
            "You can create surveys, publish links, and review responses in one place",
            "You can come back later and refine the setup whenever you need to",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--color-success)]" />
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">{item}</p>
            </div>
          ))}
        </Card>
      </div>
    </DashboardShell>
  );
}
