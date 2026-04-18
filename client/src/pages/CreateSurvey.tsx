import { useState } from "react";
import { ArrowRight, ClipboardList, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { createSurvey, uploadSurveyLogo } from "../lib/surveys";
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
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogoUpload(file: File | null) {
    if (!file) return;

    setError("");

    try {
      setLogoUploading(true);
      const uploaded = await uploadSurveyLogo("draft", file);
      setLogoUrl(uploaded.signedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't upload that logo.");
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Give your survey a clear title so your team knows what it's for.");
      return;
    }

    try {
      setLoading(true);
      const survey = await createSurvey({
        title,
        description,
        logo_url: logoUrl || null,
      });
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

      <div className="grid gap-4 md:grid-cols-[1fr_0.82fr]">
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

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Brand logo
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] sm:w-auto">
                  <Upload className="h-4 w-4" />
                  {logoUploading ? "Uploading logo" : "Add brand logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                  />
                </label>

                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Selected brand logo"
                    className="h-12 w-auto max-w-[10rem] object-contain"
                  />
                ) : null}
              </div>
            </div>

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
              A clear setup helps your team move into the builder with less friction
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
