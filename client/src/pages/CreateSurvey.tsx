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
      setError(
        err instanceof Error ? err.message : "We couldn't upload that logo.",
      );
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Add a survey title before you continue.");
      return;
    }

    try {
      setLoading(true);
      const survey = await createSurvey({
        title: title.trim(),
        description: description.trim(),
        logo_url: logoUrl || null,
      });
      navigate(`/surveys/${survey.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't create your survey.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader title="Create Survey" backHref="/surveys" />

      <div className="mx-auto max-w-3xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Tell your team what this survey should uncover."
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
                    onChange={(e) =>
                      handleLogoUpload(e.target.files?.[0] || null)
                    }
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
              <Feedback
                variant="error"
                title="Your survey isn't ready yet"
                description={error}
              />
            ) : null}

            <Button
              type="submit"
              loading={loading}
              size="lg"
              trailingIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {loading ? "Creating your survey" : "Continue to builder"}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
