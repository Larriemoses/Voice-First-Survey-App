import { useState } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { createSurvey } from "../lib/surveys";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { Textarea } from "../components/ui/Textarea";

export default function CreateSurvey() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Give your survey a clear title so your team knows what it's for.");
      return;
    }

    try {
      setLoading(true);
      const survey = await createSurvey({ title, description });
      navigate(`/surveys/${survey.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't create your survey.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        title="Create Survey"
        subtitle="Start with a strong title and a short description, then add your questions next"
        backHref="/surveys"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Survey title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer Satisfaction Q3"
              leadingIcon={<ClipboardList className="h-4 w-4" />}
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your team what this survey should uncover and who it's meant for"
            />

            {error ? (
              <Feedback variant="error" title="Your survey isn't ready yet" description={error} />
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                loading={loading}
                size="lg"
                trailingIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
              >
                {loading ? "Creating your survey" : "Create survey"}
              </Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => navigate("/surveys")}>
                Go back
              </Button>
            </div>
          </form>
        </Card>

        <Card variant="flat" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              Good survey titles are specific
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              A strong setup makes the builder feel easier from the first screen
            </p>
          </div>

          {[
            "Customer onboarding experience",
            "Retail staff satisfaction check-in",
            "Post-event attendee feedback",
          ].map((example) => (
            <div key={example} className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-sm font-medium text-[var(--color-text)]">
              {example}
            </div>
          ))}
        </Card>
      </div>
    </DashboardShell>
  );
}
