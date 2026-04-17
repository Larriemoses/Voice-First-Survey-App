import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Copy,
  Eye,
  FileImage,
  Link2,
  Lock,
  PencilLine,
  Rocket,
  Save,
  Sparkles,
  Trash2,
  Upload,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import {
  addQuestion,
  closeSurvey,
  deleteQuestion,
  deleteSurvey,
  generateSurveyDraftFromBrief,
  getSurveyById,
  getSurveyQuestions,
  publishSurvey,
  updateQuestion,
  updateSurvey,
  uploadSurveyLogo,
} from "../lib/surveys";
import { Badge } from "../components/ui/Badge";
import { Button, type ButtonVariant } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { Textarea } from "../components/ui/Textarea";
import { Tooltip } from "../components/ui/Tooltip";
import { cn } from "../utils/helpers";
import {
  getSurveyPath,
  getSurveySharePath,
  trimTrailingSlash,
} from "../lib/branding";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "closed";
  logo_url?: string | null;
  header_text?: string | null;
};

type Question = {
  id: string;
  prompt: string;
  order_index: number;
  max_duration_seconds: number | null;
};

type GeneratedQuestion = {
  prompt: string;
  max_duration_seconds: number;
};

type GeneratedSurveyDraft = {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
};

type BuilderSectionId = "branding" | "draft" | "question";

type ConfirmationState =
  | {
      type: "deleteQuestion";
      question: Question;
    }
  | {
      type: "closeSurvey";
    }
  | {
      type: "deleteSurvey";
    }
  | null;

type BuilderAccordionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  badge?: ReactNode;
  children: ReactNode;
};

type BuilderActionButtonProps = {
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

function BuilderAccordionCard({
  title,
  description,
  icon: Icon,
  open,
  onToggle,
  badge,
  children,
}: BuilderAccordionCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-[var(--color-surface)] sm:px-6"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-[var(--color-surface)] text-[var(--color-primary)]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-[var(--color-text)] sm:text-xl">
                {title}
              </h2>
              {badge}
            </div>
            <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] sm:inline">
            {open ? "Hide" : "Open"}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]">
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
            />
          </span>
        </div>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[var(--color-border-subtle)] p-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}

function BuilderActionButton({
  label,
  icon,
  variant = "secondary",
  onClick,
  href,
  loading = false,
  disabled = false,
  disabledReason,
}: BuilderActionButtonProps) {
  const compactButton = (
    <Button
      variant={variant}
      size="sm"
      iconOnly
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      disabledReason={disabledReason}
      title={label}
      aria-label={label}
      leadingIcon={!loading ? icon : undefined}
    >
      {label}
    </Button>
  );

  const fullButton = (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      disabledReason={disabledReason}
      title={label}
      aria-label={label}
      leadingIcon={!loading ? icon : undefined}
      className="hidden lg:inline-flex"
    >
      {label}
    </Button>
  );

  return (
    <>
      <Tooltip content={label}>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="lg:hidden">
            {compactButton}
          </a>
        ) : (
          <span className="lg:hidden">{compactButton}</span>
        )}
      </Tooltip>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer">
          {fullButton}
        </a>
      ) : (
        fullButton
      )}
    </>
  );
}

function SurveyStatusBadge({ status }: { status: Survey["status"] }) {
  if (status === "published") return <Badge variant="success" dot>Live</Badge>;
  if (status === "closed") return <Badge variant="default">Closed</Badge>;
  return <Badge variant="warning" dot>Draft</Badge>;
}

export default function SurveyBuilder() {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prompt, setPrompt] = useState("");
  const [maxDuration, setMaxDuration] = useState("120");
  const [brief, setBrief] = useState("");
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedSurveyDraft | null>(null);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState("");
  const [editingDuration, setEditingDuration] = useState("120");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copying, setCopying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [addingGenerated, setAddingGenerated] = useState(false);
  const [closingSurvey, setClosingSurvey] = useState(false);
  const [deletingSurvey, setDeletingSurvey] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null);
  const [openSections, setOpenSections] = useState<Record<BuilderSectionId, boolean>>({
    branding: true,
    draft: false,
    question: false,
  });

  async function loadData() {
    if (!surveyId) return;

    try {
      setLoading(true);
      setError("");
      const [surveyData, questionData] = await Promise.all([
        getSurveyById(surveyId),
        getSurveyQuestions(surveyId),
      ]);

      setSurvey(surveyData);
      setSurveyTitle(surveyData.title || "");
      setSurveyDescription(surveyData.description || "");
      setHeaderText(surveyData.header_text || "");
      setLogoUrl(surveyData.logo_url || "");
      setQuestions(questionData);
    } catch (err) {
      console.error(err);
      setError("We couldn't load this survey right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [surveyId]);

  useEffect(() => {
    if (generatedDraft) {
      setOpenSections((current) => ({ ...current, draft: true }));
    }
  }, [generatedDraft]);

  useEffect(() => {
    if (!loading && questions.length === 0) {
      setOpenSections((current) => ({ ...current, question: true }));
    }
  }, [loading, questions.length]);

  function clearFeedback() {
    setError("");
    setSuccessMessage("");
  }

  function toggleSection(section: BuilderSectionId) {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  async function handleSaveBranding() {
    if (!surveyId) return;

    clearFeedback();

    if (!surveyTitle.trim()) {
      setError("Give your survey a title before saving the branding.");
      return;
    }

    try {
      setSavingBranding(true);
      const updated = await updateSurvey(surveyId, {
        title: surveyTitle.trim(),
        description: surveyDescription.trim() || null,
        header_text: headerText.trim() || null,
        logo_url: logoUrl || null,
      });
      setSurvey(updated);
      setSuccessMessage("Your survey details are saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't save your changes.");
    } finally {
      setSavingBranding(false);
    }
  }

  async function handleLogoUpload(file: File | null) {
    if (!file || !surveyId) return;

    clearFeedback();

    try {
      setLogoUploading(true);
      const uploaded = await uploadSurveyLogo(surveyId, file);
      setLogoUrl(uploaded.signedUrl);
      setSuccessMessage("Your logo is uploaded. Save the survey to apply it.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't upload that image.");
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    clearFeedback();

    if (!surveyId || !prompt.trim()) {
      setError("Add a question prompt before you save it.");
      return;
    }

    try {
      setSaving(true);
      await addQuestion({
        survey_id: surveyId,
        prompt: prompt.trim(),
        order_index: questions.length + 1,
        max_duration_seconds: Number(maxDuration) || 120,
      });

      setPrompt("");
      setMaxDuration("120");
      setSuccessMessage("Your question is added.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't add that question.");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateSurvey() {
    clearFeedback();

    if (!brief.trim()) {
      setError("Paste a short brief so we know what kind of survey to generate.");
      return;
    }

    try {
      setGenerating(true);
      const draft = await generateSurveyDraftFromBrief(brief.trim());
      setGeneratedDraft({
        title: draft.title || "",
        description: draft.description || "",
        questions: Array.isArray(draft.questions) ? draft.questions : [],
      });
      setSurveyTitle(draft.title || surveyTitle);
      setSurveyDescription(draft.description || surveyDescription);
      setSuccessMessage("Your draft is ready to review.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't generate a draft.");
    } finally {
      setGenerating(false);
    }
  }

  function handleGeneratedQuestionChange(
    index: number,
    field: keyof GeneratedQuestion,
    value: string,
  ) {
    setGeneratedDraft((prev) => {
      if (!prev) return prev;

      const updated = [...prev.questions];
      updated[index] = {
        ...updated[index],
        [field]:
          field === "max_duration_seconds"
            ? Math.max(10, Math.min(600, Number(value) || 120))
            : value,
      };

      return { ...prev, questions: updated };
    });
  }

  function handleRemoveGeneratedQuestion(index: number) {
    setGeneratedDraft((prev) =>
      prev
        ? { ...prev, questions: prev.questions.filter((_, itemIndex) => itemIndex !== index) }
        : prev,
    );
  }

  async function handleAddGeneratedQuestions() {
    if (!surveyId || !generatedDraft) return;

    clearFeedback();
    const valid = generatedDraft.questions.filter((question) => question.prompt.trim());

    if (!valid.length) {
      setError("Keep at least one generated question before adding the draft.");
      return;
    }

    try {
      setAddingGenerated(true);
      await updateSurvey(surveyId, {
        title: surveyTitle.trim() || generatedDraft.title,
        description: surveyDescription.trim() || generatedDraft.description,
        header_text: headerText.trim() || null,
        logo_url: logoUrl || null,
      });

      for (let index = 0; index < valid.length; index += 1) {
        await addQuestion({
          survey_id: surveyId,
          prompt: valid[index].prompt.trim(),
          order_index: questions.length + index + 1,
          max_duration_seconds: Number(valid[index].max_duration_seconds) || 120,
        });
      }

      setGeneratedDraft(null);
      setBrief("");
      setSuccessMessage("Your generated questions are now in the survey.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't add those questions.");
    } finally {
      setAddingGenerated(false);
    }
  }

  function startEditingQuestion(question: Question) {
    setEditingQuestionId(question.id);
    setEditingPrompt(question.prompt);
    setEditingDuration(String(question.max_duration_seconds || 120));
    clearFeedback();
  }

  function cancelEditingQuestion() {
    setEditingQuestionId(null);
    setEditingPrompt("");
    setEditingDuration("120");
  }

  async function handleSaveQuestion(questionId: string) {
    clearFeedback();

    if (!editingPrompt.trim()) {
      setError("A question can't be empty.");
      return;
    }

    try {
      setUpdatingQuestionId(questionId);
      await updateQuestion(questionId, {
        prompt: editingPrompt.trim(),
        max_duration_seconds: Number(editingDuration) || 120,
      });

      cancelEditingQuestion();
      setSuccessMessage("Your question is updated.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't update that question.");
    } finally {
      setUpdatingQuestionId(null);
    }
  }

  async function executeDeleteQuestion(questionId: string) {
    clearFeedback();

    try {
      setDeletingQuestionId(questionId);
      await deleteQuestion(questionId);
      if (editingQuestionId === questionId) cancelEditingQuestion();
      setSuccessMessage("That question is removed.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't delete that question.");
    } finally {
      setDeletingQuestionId(null);
    }
  }

  async function handlePublishSurvey() {
    if (!surveyId) return;

    clearFeedback();

    if (!surveyTitle.trim()) {
      setError("Add a survey title before you publish.");
      return;
    }

    if (!questions.length) {
      setError("Add at least one question before you publish.");
      return;
    }

    try {
      setPublishing(true);
      await updateSurvey(surveyId, {
        title: surveyTitle.trim(),
        description: surveyDescription.trim() || null,
        header_text: headerText.trim() || null,
        logo_url: logoUrl || null,
      });

      const updated = await publishSurvey(surveyId);
      setSurvey(updated);
      setSuccessMessage("Your survey is now live.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't publish your survey.");
    } finally {
      setPublishing(false);
    }
  }

  async function executeCloseSurvey() {
    if (!surveyId) return;

    clearFeedback();

    try {
      setClosingSurvey(true);
      const updated = await closeSurvey(surveyId);
      setSurvey(updated);
      setSuccessMessage("Your survey is closed. It won't accept new responses.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't close your survey.");
    } finally {
      setClosingSurvey(false);
    }
  }

  async function executeDeleteSurvey() {
    if (!surveyId) return;

    clearFeedback();

    try {
      setDeletingSurvey(true);
      await deleteSurvey(surveyId);
      navigate("/surveys");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't delete your survey.");
    } finally {
      setDeletingSurvey(false);
    }
  }

  async function handleCopyLink() {
    clearFeedback();

    try {
      setCopying(true);
      await navigator.clipboard.writeText(shareLink);
      setSuccessMessage("Your public link is copied with a preview-friendly share URL.");
    } catch {
      setError("We couldn't copy the public link.");
    } finally {
      setCopying(false);
    }
  }

  async function confirmAction() {
    if (!confirmation) return;

    if (confirmation.type === "deleteQuestion") {
      await executeDeleteQuestion(confirmation.question.id);
    }

    if (confirmation.type === "closeSurvey") {
      await executeCloseSurvey();
    }

    if (confirmation.type === "deleteSurvey") {
      await executeDeleteSurvey();
    }

    setConfirmation(null);
  }

  const appUrl = trimTrailingSlash(window.location.origin);
  const publicPath = surveyId ? getSurveyPath(surveyId) : "";
  const publicLink = publicPath ? `${appUrl}${publicPath}` : appUrl;
  const sharePath = surveyId ? getSurveySharePath(surveyId) : "";
  const shareLink = sharePath ? `${appUrl}${sharePath}` : appUrl;

  const validGeneratedCount = useMemo(
    () => generatedDraft?.questions.filter((question) => question.prompt.trim()).length || 0,
    [generatedDraft],
  );

  const publishDisabledReason = !surveyTitle.trim()
    ? "Add a title before you publish"
    : questions.length === 0
      ? "Add at least one question before you publish"
      : undefined;

  if (loading) {
    return (
      <DashboardShell>
        <PageHeader title="Survey Builder" subtitle="Loading your survey" backHref="/surveys" />
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <Card className="space-y-4">
              <Skeleton className="h-12 rounded-[20px]" />
              <Skeleton className="h-32 rounded-[24px]" />
            </Card>
            <Card className="space-y-4">
              <Skeleton className="h-24 rounded-[24px]" />
              <Skeleton className="h-24 rounded-[24px]" />
            </Card>
          </div>
          <Card className="space-y-4">
            <Skeleton className="h-20 rounded-[24px]" />
            <Skeleton className="h-48 rounded-[24px]" />
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <PageHeader
        title={surveyTitle || "Untitled Survey"}
        backHref="/surveys"
        actions={
          <>
            {survey?.status ? <SurveyStatusBadge status={survey.status} /> : null}
            <BuilderActionButton
              label="View responses"
              onClick={() => navigate(`/surveys/${surveyId}/responses`)}
              icon={<Eye className="h-4 w-4" />}
            />

            {survey?.status === "published" ? (
              <>
                <BuilderActionButton
                  label="Copy link"
                  onClick={handleCopyLink}
                  loading={copying}
                  icon={<Copy className="h-4 w-4" />}
                />
                <BuilderActionButton
                  label="Open survey"
                  href={publicLink}
                  variant="primary"
                  icon={<Link2 className="h-4 w-4" />}
                />
                <BuilderActionButton
                  label="Close survey"
                  variant="danger"
                  onClick={() => setConfirmation({ type: "closeSurvey" })}
                  icon={<Lock className="h-4 w-4" />}
                  loading={closingSurvey}
                />
              </>
            ) : survey?.status === "closed" ? (
              <BuilderActionButton
                label="Delete survey"
                variant="danger"
                onClick={() => setConfirmation({ type: "deleteSurvey" })}
                icon={<Trash2 className="h-4 w-4" />}
                loading={deletingSurvey}
              />
            ) : (
              <>
                <BuilderActionButton
                  label="Delete survey"
                  onClick={() => setConfirmation({ type: "deleteSurvey" })}
                  icon={<Trash2 className="h-4 w-4" />}
                />
                <BuilderActionButton
                  label="Publish survey"
                  variant="primary"
                  onClick={handlePublishSurvey}
                  icon={<Rocket className="h-4 w-4" />}
                  loading={publishing}
                  disabled={!!publishDisabledReason}
                  disabledReason={publishDisabledReason}
                />
              </>
            )}
          </>
        }
      />

      <div className="space-y-4">
        {error ? (
          <Feedback variant="error" title="The builder hit a snag" description={error} />
        ) : null}

        {successMessage ? (
          <Feedback
            variant="success"
            title="You're up to date"
            description={successMessage}
          />
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <BuilderAccordionCard
              title="Survey branding"
              description="Keep the title, intro, and logo tucked away until you need them."
              icon={FileImage}
              open={openSections.branding}
              onToggle={() => toggleSection("branding")}
            >
              <div className="grid gap-4">
                <Input
                  label="Survey title"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                  placeholder="e.g. Customer Experience Survey"
                />

                <Input
                  label="Header text"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="e.g. We'd love to hear how your visit went"
                />

                <Textarea
                  label="Description"
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  placeholder="Tell respondents what this survey is about and what kind of answers you're hoping to hear"
                />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Survey logo
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface)] sm:w-auto">
                      <Upload className="h-4 w-4" />
                      {logoUploading ? "Uploading image" : "Upload logo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                      />
                    </label>

                    {logoUrl ? (
                      <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                        <img
                          src={logoUrl}
                          alt="Survey logo"
                          className="h-10 w-auto max-w-[7rem] object-contain"
                        />
                        <Badge variant="success" dot>
                          Ready
                        </Badge>
                      </div>
                    ) : null}
                  </div>
                </div>

                <Button
                  onClick={handleSaveBranding}
                  loading={savingBranding}
                  leadingIcon={!savingBranding ? <Save className="h-4 w-4" /> : undefined}
                >
                  Save survey details
                </Button>
              </div>
            </BuilderAccordionCard>

            <BuilderAccordionCard
              title="Generate a draft"
              description="Turn a rough brief into a starting point, then edit the questions before you add them."
              icon={WandSparkles}
              open={openSections.draft}
              onToggle={() => toggleSection("draft")}
              badge={
                generatedDraft ? (
                  <Badge variant="info" dot>
                    {validGeneratedCount} ready
                  </Badge>
                ) : undefined
              }
            >
              <Textarea
                label="Brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. We want a short post-purchase voice survey for retail customers. Keep it warm, conversational, and focused on service, product satisfaction, and whether they'd return."
              />

              <Button
                onClick={handleGenerateSurvey}
                loading={generating}
                leadingIcon={!generating ? <WandSparkles className="h-4 w-4" /> : undefined}
              >
                {generating ? "Generating your draft" : "Generate survey draft"}
              </Button>

              {generatedDraft ? (
                <div className="space-y-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        Draft review
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {validGeneratedCount} ready-to-add question{validGeneratedCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Badge variant="info" dot>
                      Generated
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {generatedDraft.questions.map((question, index) => (
                      <Card key={`${question.prompt}-${index}`} variant="flat" className="space-y-3">
                        <Textarea
                          label={`Question ${index + 1}`}
                          value={question.prompt}
                          onChange={(e) =>
                            handleGeneratedQuestionChange(index, "prompt", e.target.value)
                          }
                          placeholder="Add a clear voice-friendly question"
                        />
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                          <Input
                            label="Max duration"
                            type="number"
                            value={String(question.max_duration_seconds)}
                            onChange={(e) =>
                              handleGeneratedQuestionChange(
                                index,
                                "max_duration_seconds",
                                e.target.value,
                              )
                            }
                            placeholder="120"
                            containerClassName="sm:max-w-[11rem]"
                          />
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveGeneratedQuestion(index)}
                            leadingIcon={<Trash2 className="h-4 w-4" />}
                          >
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={handleAddGeneratedQuestions}
                    loading={addingGenerated}
                    leadingIcon={!addingGenerated ? <Sparkles className="h-4 w-4" /> : undefined}
                  >
                    {addingGenerated ? "Adding generated questions" : "Add generated questions"}
                  </Button>
                </div>
              ) : null}
            </BuilderAccordionCard>

            <BuilderAccordionCard
              title="Add a question"
              description="Open this when you're ready to add another spoken question to the flow."
              icon={PencilLine}
              open={openSections.question}
              onToggle={() => toggleSection("question")}
              badge={
                <Badge variant="default">
                  {questions.length} question{questions.length === 1 ? "" : "s"}
                </Badge>
              }
            >
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <Textarea
                  label="Question prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Tell us about the moment that stood out most during your visit"
                />
                <Input
                  label="Max duration in seconds"
                  type="number"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  placeholder="120"
                  containerClassName="sm:max-w-[14rem]"
                />
                <Button
                  type="submit"
                  loading={saving}
                  leadingIcon={!saving ? <ArrowRight className="h-4 w-4" /> : undefined}
                >
                  {saving ? "Adding your question" : "Add question"}
                </Button>
              </form>
            </BuilderAccordionCard>

            <Card className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  Survey questions
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Review each question before you publish so the voice flow stays natural
                </p>
              </div>

              {questions.length === 0 ? (
                <EmptyState
                  icon={<PencilLine className="h-6 w-6" />}
                  title="No questions yet"
                  description="Add your first question or generate a draft above to start shaping the survey."
                />
              ) : (
                <div className="space-y-3">
                  {questions.map((question) => {
                    const isEditing = editingQuestionId === question.id;

                    return (
                      <Card key={question.id} variant="flat" className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <Badge variant="info">Question {question.order_index}</Badge>
                            {!isEditing ? (
                              <>
                                <p className="text-base font-semibold text-[var(--color-text)]">
                                  {question.prompt}
                                </p>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                  Respondents get up to {question.max_duration_seconds || 120} seconds for this answer.
                                </p>
                              </>
                            ) : null}
                          </div>
                          {!isEditing ? (
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingQuestion(question)}
                                leadingIcon={<PencilLine className="h-4 w-4" />}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setConfirmation({ type: "deleteQuestion", question })
                                }
                                leadingIcon={<Trash2 className="h-4 w-4" />}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : null}
                        </div>

                        {isEditing ? (
                          <div className="space-y-4">
                            <Textarea
                              label="Question prompt"
                              value={editingPrompt}
                              onChange={(e) => setEditingPrompt(e.target.value)}
                              placeholder="Keep your question short and easy to answer"
                            />
                            <Input
                              label="Max duration in seconds"
                              type="number"
                              value={editingDuration}
                              onChange={(e) => setEditingDuration(e.target.value)}
                              containerClassName="sm:max-w-[14rem]"
                            />
                            <div className="flex flex-col gap-3 sm:flex-row">
                              <Button
                                onClick={() => handleSaveQuestion(question.id)}
                                loading={updatingQuestionId === question.id}
                                leadingIcon={
                                  updatingQuestionId !== question.id ? (
                                    <Save className="h-4 w-4" />
                                  ) : undefined
                                }
                              >
                                {updatingQuestionId === question.id
                                  ? "Saving your edit"
                                  : "Save question"}
                              </Button>
                              <Button variant="secondary" onClick={cancelEditingQuestion}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <Card variant="flat" className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text)]">
                    Survey summary
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    See the state of the survey at a glance
                  </p>
                </div>
                {survey?.status ? <SurveyStatusBadge status={survey.status} /> : null}
              </div>

              <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Questions
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--color-text)]">
                    {questions.length}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Draft queue
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--color-text)]">
                    {validGeneratedCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  Public link
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Share this once the survey is live. The copied URL includes a richer preview in supported apps.
                </p>
              </div>

              {survey?.status === "published" ? (
                <>
                  <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)]">
                    {shareLink}
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="secondary"
                      onClick={handleCopyLink}
                      loading={copying}
                      leadingIcon={!copying ? <Copy className="h-4 w-4" /> : undefined}
                    >
                      Copy public link
                    </Button>
                    <a href={publicLink} target="_blank" rel="noreferrer">
                      <Button className="w-full" leadingIcon={<Link2 className="h-4 w-4" />}>
                        Open public survey
                      </Button>
                    </a>
                  </div>
                </>
              ) : (
                <Feedback
                  variant="info"
                  title="Publish first"
                  description="Your public link appears here as soon as the survey goes live."
                />
              )}
            </Card>

            <Card variant="flat" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  Live preview
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  A quick feel for what respondents will see first
                </p>
              </div>

              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Survey logo preview"
                    className="mb-4 h-10 w-auto max-w-[8rem] object-contain"
                  />
                ) : (
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]">
                    <FileImage className="h-5 w-5" />
                  </div>
                )}

                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {surveyTitle || "Your survey title will show here"}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                  {headerText || "Add a header that welcomes respondents in a warm, clear way"}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                  {surveyDescription ||
                    "A short description helps respondents understand what they're answering and why it matters."}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        open={!!confirmation}
        onClose={() => setConfirmation(null)}
        title={
          confirmation?.type === "deleteQuestion"
            ? "Delete question"
            : confirmation?.type === "closeSurvey"
              ? "Close survey"
              : "Delete survey"
        }
        description={
          confirmation?.type === "deleteQuestion"
            ? "This question will be removed from the survey immediately."
            : confirmation?.type === "closeSurvey"
              ? "Respondents won't be able to submit new answers after you close this survey."
              : "This will remove the survey and every question inside it. You can't undo this."
        }
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirmation(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmAction}
              loading={
                confirmation?.type === "closeSurvey"
                  ? closingSurvey
                  : confirmation?.type === "deleteSurvey"
                    ? deletingSurvey
                    : deletingQuestionId === confirmation?.question.id
              }
            >
              {confirmation?.type === "closeSurvey"
                ? "Close survey"
                : confirmation?.type === "deleteSurvey"
                  ? "Delete survey"
                  : "Delete question"}
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">
          {confirmation?.type === "deleteQuestion"
            ? `Question ${confirmation.question.order_index} will be removed from the survey.`
            : confirmation?.type === "closeSurvey"
              ? "You can still review responses and survey details after closing it."
              : "If you're sure, we'll take you back to your survey list once the delete finishes."}
        </p>
      </Modal>
    </DashboardShell>
  );
}
