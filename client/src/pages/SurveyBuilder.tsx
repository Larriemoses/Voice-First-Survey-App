import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  ImagePlus,
  MessageSquareText,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import { SurveyStatusBadge } from "../components/surveys/SurveyStatusBadge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import {
  DropdownMenu,
  type DropdownMenuItem,
} from "../components/ui/DropdownMenu";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { Textarea } from "../components/ui/Textarea";
import { useToast } from "../components/ui/Toast";
import {
  closeSurvey,
  addQuestion,
  deleteQuestion,
  deleteSurvey,
  getSurveyById,
  getSurveyQuestions,
  publishSurvey,
  updateQuestion,
  updateSurvey,
  uploadSurveyLogo,
} from "../lib/surveys";
import { getSurveyPath } from "../lib/branding";

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

type BannerState =
  | {
      variant: "success" | "error" | "warning" | "info";
      title: string;
      description?: string;
    }
  | null;

type ConfirmationState =
  | { type: "closeSurvey" }
  | { type: "deleteSurvey" }
  | { type: "deleteQuestion"; question: Question }
  | null;

export default function SurveyBuilder() {
  const { surveyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [newQuestionPrompt, setNewQuestionPrompt] = useState("");
  const [newQuestionDuration, setNewQuestionDuration] = useState("120");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState("");
  const [editingDuration, setEditingDuration] = useState("120");
  const [banner, setBanner] = useState<BannerState>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null);
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [closing, setClosing] = useState(false);
  const [deletingSurveyState, setDeletingSurveyState] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!surveyId) {
        setLoading(false);
        setBanner({
          variant: "error",
          title: "Survey not found",
          description: "This survey link is incomplete.",
        });
        return;
      }

      try {
        setLoading(true);
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
      } catch (error) {
        console.error("Survey builder load error:", error);
        setBanner({
          variant: "error",
          title: "Survey unavailable",
          description: "We couldn't load this survey right now.",
        });
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [surveyId]);

  useEffect(() => {
    if (!loading && location.hash) {
      const target = document.getElementById(location.hash.replace("#", ""));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, location.hash]);

  const publishDisabledReason = useMemo(() => {
    if (!surveyTitle.trim()) {
      return "Add a survey title to publish";
    }

    if (questions.length === 0) {
      return "Add at least one question to publish";
    }

    return "";
  }, [questions.length, surveyTitle]);

  const publicSurveyUrl = surveyId
    ? `${window.location.origin}${getSurveyPath(surveyId)}`
    : "";

  async function handleSaveDetails() {
    if (!surveyId || !survey) {
      return;
    }

    if (!surveyTitle.trim()) {
      setBanner({
        variant: "error",
        title: "Survey not saved",
        description: "Add a survey title before saving.",
      });
      return;
    }

    const previousSurvey = survey;
    const optimisticSurvey = {
      ...survey,
      title: surveyTitle.trim(),
      description: surveyDescription.trim() || null,
    };

    setSurvey(optimisticSurvey);
    setSavingDetails(true);
    setBanner(null);

    try {
      const updated = await updateSurvey(surveyId, {
        title: surveyTitle.trim(),
        description: surveyDescription.trim() || null,
      });

      setSurvey(updated);
      setBanner({
        variant: "success",
        title: "Survey details saved",
      });
    } catch (error) {
      console.error("Save survey details error:", error);
      setSurvey(previousSurvey);
      setBanner({
        variant: "error",
        title: "Survey not saved",
        description: "We couldn't save your changes right now.",
      });
    } finally {
      setSavingDetails(false);
    }
  }

  async function handleSaveBranding() {
    if (!surveyId || !survey) {
      return;
    }

    const previousSurvey = survey;
    const optimisticSurvey = {
      ...survey,
      logo_url: logoUrl || null,
      header_text: headerText.trim() || null,
    };

    setSurvey(optimisticSurvey);
    setSavingBranding(true);
    setBanner(null);

    try {
      const updated = await updateSurvey(surveyId, {
        logo_url: logoUrl || null,
        header_text: headerText.trim() || null,
      });

      setSurvey(updated);
      setBanner({
        variant: "success",
        title: "Branding saved",
      });
    } catch (error) {
      console.error("Save branding error:", error);
      setSurvey(previousSurvey);
      setBanner({
        variant: "error",
        title: "Branding not saved",
        description: "We couldn't save your branding right now.",
      });
    } finally {
      setSavingBranding(false);
    }
  }

  async function handleLogoUpload(file: File | null) {
    if (!file || !surveyId) {
      return;
    }

    try {
      setUploadingLogo(true);
      setBanner(null);
      const uploaded = await uploadSurveyLogo(surveyId, file);
      setLogoUrl(uploaded.signedUrl);
      showToast({
        variant: "success",
        title: "Logo uploaded",
        description: "Save branding to apply it to the public survey page.",
      });
    } catch (error) {
      console.error("Upload logo error:", error);
      setBanner({
        variant: "error",
        title: "Logo not uploaded",
        description: "We couldn't upload that logo right now.",
      });
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleAddQuestion() {
    if (!surveyId) {
      return;
    }

    if (!newQuestionPrompt.trim()) {
      setBanner({
        variant: "error",
        title: "Question not added",
        description: "Add a question prompt before saving.",
      });
      return;
    }

    const tempQuestion: Question = {
      id: `temp-${Date.now()}`,
      prompt: newQuestionPrompt.trim(),
      order_index: questions.length,
      max_duration_seconds: Number.parseInt(newQuestionDuration, 10) || 120,
    };

    setQuestions((current) => [...current, tempQuestion]);
    setNewQuestionPrompt("");
    setNewQuestionDuration("120");
    setAddingQuestion(true);
    setBanner(null);

    try {
      const created = await addQuestion({
        survey_id: surveyId,
        prompt: tempQuestion.prompt,
        order_index: tempQuestion.order_index,
        max_duration_seconds: tempQuestion.max_duration_seconds,
      });

      setQuestions((current) =>
        current.map((question) =>
          question.id === tempQuestion.id ? (created as Question) : question,
        ),
      );
    } catch (error) {
      console.error("Add question error:", error);
      setQuestions((current) =>
        current.filter((question) => question.id !== tempQuestion.id),
      );
      setNewQuestionPrompt(tempQuestion.prompt);
      setNewQuestionDuration(String(tempQuestion.max_duration_seconds || 120));
      setBanner({
        variant: "error",
        title: "Question not added",
        description: "We couldn't add that question right now.",
      });
    } finally {
      setAddingQuestion(false);
    }
  }

  function startEditingQuestion(question: Question) {
    setEditingQuestionId(question.id);
    setEditingPrompt(question.prompt);
    setEditingDuration(String(question.max_duration_seconds || 120));
  }

  async function handleSaveQuestion(question: Question) {
    const nextPrompt = editingPrompt.trim();

    if (!nextPrompt) {
      setBanner({
        variant: "error",
        title: "Question not saved",
        description: "Add a question prompt before saving.",
      });
      return;
    }

    const previousQuestions = questions;
    const optimisticQuestions = questions.map((item) =>
      item.id === question.id
        ? {
            ...item,
            prompt: nextPrompt,
            max_duration_seconds: Number.parseInt(editingDuration, 10) || 120,
          }
        : item,
    );

    setQuestions(optimisticQuestions);
    setUpdatingQuestionId(question.id);
    setEditingQuestionId(null);
    setBanner(null);

    try {
      const updated = await updateQuestion(question.id, {
        prompt: nextPrompt,
        max_duration_seconds: Number.parseInt(editingDuration, 10) || 120,
      });

      setQuestions((current) =>
        current.map((item) =>
          item.id === question.id ? (updated as Question) : item,
        ),
      );
    } catch (error) {
      console.error("Update question error:", error);
      setQuestions(previousQuestions);
      setEditingQuestionId(question.id);
      setBanner({
        variant: "error",
        title: "Question not saved",
        description: "We couldn't save that question right now.",
      });
    } finally {
      setUpdatingQuestionId(null);
    }
  }

  async function handleDeleteQuestion(question: Question) {
    const previousQuestions = questions;
    setQuestions((current) => current.filter((item) => item.id !== question.id));
    setDeletingQuestionId(question.id);
    setBanner(null);

    try {
      await deleteQuestion(question.id);
    } catch (error) {
      console.error("Delete question error:", error);
      setQuestions(previousQuestions);
      setBanner({
        variant: "error",
        title: "Question not deleted",
        description: "We couldn't delete that question right now.",
      });
    } finally {
      setDeletingQuestionId(null);
      setConfirmation(null);
    }
  }

  async function handleCopyPublicLink() {
    try {
      await navigator.clipboard.writeText(publicSurveyUrl);
      showToast({
        variant: "success",
        title: "Public link copied",
      });
    } catch (error) {
      console.error("Copy public link error:", error);
      showToast({
        variant: "error",
        title: "Link not copied",
        description: "Clipboard access is blocked in this browser.",
      });
    }
  }

  async function handlePublish() {
    if (!surveyId || !survey) {
      return;
    }

    if (publishDisabledReason) {
      setBanner({
        variant: "error",
        title: "Survey not published",
        description: publishDisabledReason,
      });
      return;
    }

    const previousSurvey = survey;
    setSurvey({ ...survey, status: "published" });
    setPublishing(true);
    setBanner(null);

    try {
      const updated = await publishSurvey(surveyId);
      setSurvey(updated);
      setBanner({
        variant: "success",
        title: "Survey published",
        description: "Your public link is now live.",
      });
    } catch (error) {
      console.error("Publish survey error:", error);
      setSurvey(previousSurvey);
      setBanner({
        variant: "error",
        title: "Survey not published",
        description: "We couldn't publish this survey right now.",
      });
    } finally {
      setPublishing(false);
    }
  }

  async function handleCloseSurvey() {
    if (!surveyId || !survey) {
      return;
    }

    const previousSurvey = survey;
    setSurvey({ ...survey, status: "closed" });
    setClosing(true);
    setBanner(null);

    try {
      const updated = await closeSurvey(surveyId);
      setSurvey(updated);
      setBanner({
        variant: "success",
        title: "Survey closed",
        description: "Respondents can no longer access the public link.",
      });
    } catch (error) {
      console.error("Close survey error:", error);
      setSurvey(previousSurvey);
      setBanner({
        variant: "error",
        title: "Survey not closed",
        description: "We couldn't close this survey right now.",
      });
    } finally {
      setClosing(false);
      setConfirmation(null);
    }
  }

  async function handleDeleteSurvey() {
    if (!surveyId) {
      return;
    }

    try {
      setDeletingSurveyState(true);
      await deleteSurvey(surveyId);
      navigate("/surveys");
    } catch (error) {
      console.error("Delete survey error:", error);
      setBanner({
        variant: "error",
        title: "Survey not deleted",
        description: "We couldn't delete this survey right now.",
      });
    } finally {
      setDeletingSurveyState(false);
      setConfirmation(null);
    }
  }

  const rawMenuItems: Array<DropdownMenuItem | null> = [
    survey?.status === "published"
      ? {
          label: "Copy public link",
          icon: <Copy className="h-4 w-4" />,
          onSelect: handleCopyPublicLink,
        }
      : null,
    {
      label: "View responses",
      icon: <MessageSquareText className="h-4 w-4" />,
      onSelect: () => navigate(`/surveys/${surveyId}/responses`),
    },
    survey?.status === "published"
      ? {
          label: closing ? "Closing survey" : "Close survey",
          icon: <X className="h-4 w-4" />,
          onSelect: () => setConfirmation({ type: "closeSurvey" }),
        }
      : null,
    {
      label: "Delete survey",
      icon: <Trash2 className="h-4 w-4" />,
      tone: "danger" as const,
      onSelect: () => setConfirmation({ type: "deleteSurvey" }),
    },
  ];
  const menuItems = rawMenuItems.filter(
    (item) => item !== null,
  ) as DropdownMenuItem[];

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-52" />
          </div>
          <Card className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-11 w-32" />
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="sticky top-[calc(3rem+env(safe-area-inset-top))] z-20 -mx-4 border-b border-[var(--border-sub)] bg-[color:color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 py-4 backdrop-blur md:top-0 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/surveys")}
                className="-ml-2 mb-2"
                leadingIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-[var(--text)] sm:text-2xl">
                  {surveyTitle.trim() || "Untitled survey"}
                </h1>
                {survey ? <SurveyStatusBadge status={survey.status} /> : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {survey?.status === "published" ? (
                <Button
                  onClick={() => window.open(publicSurveyUrl, "_blank", "noopener,noreferrer")}
                  leadingIcon={<ExternalLink className="h-4 w-4" />}
                >
                  Open survey
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  loading={publishing}
                  title={publishDisabledReason || "Publish survey"}
                  aria-disabled={!!publishDisabledReason}
                  className={publishDisabledReason ? "opacity-55" : undefined}
                >
                  {publishing ? "Publishing survey" : "Publish survey"}
                </Button>
              )}

              <DropdownMenu label="Survey actions" items={menuItems} />
            </div>
          </div>
        </div>

        {banner ? (
          <Feedback
            variant={banner.variant}
            title={banner.title}
            description={banner.description}
            dismissible
            onDismiss={() => setBanner(null)}
          />
        ) : null}

        <SectionCard
          id="details"
          title="Survey details"
          description="Name the survey and add a short description so your team knows what it is for."
          footer={
            <Button
              variant="secondary"
              loading={savingDetails}
              onClick={handleSaveDetails}
              leadingIcon={!savingDetails ? <Save className="h-4 w-4" /> : undefined}
            >
              {savingDetails ? "Saving details" : "Save details"}
            </Button>
          }
        >
          <div className="grid gap-4">
            <Input
              label="Survey title"
              value={surveyTitle}
              onChange={(event) => setSurveyTitle(event.target.value)}
              placeholder="e.g. Customer Satisfaction Q3"
            />
            <Textarea
              label="Survey description"
              value={surveyDescription}
              onChange={(event) => setSurveyDescription(event.target.value)}
              placeholder="Explain what this survey helps your team learn."
            />
          </div>
        </SectionCard>

        <SectionCard
          id="branding"
          title="Branding"
          description="Upload the logo respondents should see and write a short heading for the public page."
          footer={
            <Button
              variant="secondary"
              loading={savingBranding}
              onClick={handleSaveBranding}
              leadingIcon={!savingBranding ? <Save className="h-4 w-4" /> : undefined}
            >
              {savingBranding ? "Saving branding" : "Save branding"}
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <Card className="p-4" variant="flat">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[var(--text)]">Survey logo</p>
                {logoUrl ? (
                  <div className="h-20 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4">
                    <img
                      src={logoUrl}
                      alt="Survey logo preview"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--text-muted)]">
                    No logo uploaded yet.
                  </div>
                )}

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)]">
                  <ImagePlus className="h-4 w-4" />
                  {uploadingLogo ? "Uploading logo" : "Upload logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleLogoUpload(event.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
            </Card>

            <div className="grid gap-4">
              <Textarea
                label="Public page heading"
                value={headerText}
                onChange={(event) => setHeaderText(event.target.value)}
                placeholder="e.g. We'd love to hear your experience"
                helperText="This appears above the respondent form."
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="questions"
          title="Questions"
          description="Add at least one voice prompt before publishing the survey."
        >
          <div className="space-y-4">
            <Card className="grid gap-4 p-4" variant="flat">
              <Textarea
                label="Question prompt"
                value={newQuestionPrompt}
                onChange={(event) => setNewQuestionPrompt(event.target.value)}
                placeholder="e.g. Tell us about the part of your experience that stood out most."
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <Input
                  label="Max duration (seconds)"
                  type="number"
                  min="30"
                  step="15"
                  value={newQuestionDuration}
                  onChange={(event) => setNewQuestionDuration(event.target.value)}
                  placeholder="120"
                  containerClassName="sm:max-w-[13rem]"
                />
                <Button
                  variant="secondary"
                  loading={addingQuestion}
                  onClick={handleAddQuestion}
                  leadingIcon={!addingQuestion ? <Plus className="h-4 w-4" /> : undefined}
                >
                  {addingQuestion ? "Adding question" : "Add question"}
                </Button>
              </div>
            </Card>

            {questions.length === 0 ? (
              <EmptyState
                icon={<Plus className="h-6 w-6" />}
                title="No questions yet"
                description="Add the first voice question so this survey can be published."
              />
            ) : (
              <div className="space-y-3">
                {questions
                  .slice()
                  .sort((left, right) => left.order_index - right.order_index)
                  .map((question, index) => (
                    <Card key={question.id} className="p-4" variant="flat">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            Question {index + 1}
                          </p>

                          {editingQuestionId === question.id ? (
                            <div className="space-y-3">
                              <Textarea
                                label="Question prompt"
                                value={editingPrompt}
                                onChange={(event) => setEditingPrompt(event.target.value)}
                              />
                              <Input
                                label="Max duration (seconds)"
                                type="number"
                                min="30"
                                step="15"
                                value={editingDuration}
                                onChange={(event) => setEditingDuration(event.target.value)}
                                containerClassName="max-w-[13rem]"
                              />
                              <div className="flex flex-wrap gap-3">
                                <Button
                                  variant="secondary"
                                  loading={updatingQuestionId === question.id}
                                  onClick={() => handleSaveQuestion(question)}
                                >
                                  {updatingQuestionId === question.id
                                    ? "Saving question"
                                    : "Save question"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => setEditingQuestionId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-base font-semibold text-[var(--text)]">
                                {question.prompt}
                              </p>
                              <p className="text-sm text-[var(--text-muted)]">
                                Max {question.max_duration_seconds || 120} seconds
                              </p>
                            </>
                          )}
                        </div>

                        {editingQuestionId === question.id ? null : (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingQuestion(question)}
                            >
                              Edit
                            </Button>
                            <DropdownMenu
                              label="Question actions"
                              items={[
                                {
                                  label:
                                    deletingQuestionId === question.id
                                      ? "Deleting question"
                                      : "Delete question",
                                  icon: <Trash2 className="h-4 w-4" />,
                                  tone: "danger",
                                  onSelect: () =>
                                    setConfirmation({
                                      type: "deleteQuestion",
                                      question,
                                    }),
                                },
                              ]}
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <Modal
        open={confirmation?.type === "closeSurvey"}
        onClose={() => setConfirmation(null)}
        title="Close survey"
        description="Respondents will no longer be able to open the public link."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirmation(null)}>
              Keep survey open
            </Button>
            <Button variant="danger" loading={closing} onClick={handleCloseSurvey}>
              {closing ? "Closing survey" : "Close survey"}
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          You can publish the survey again later if you want to reopen responses.
        </p>
      </Modal>

      <Modal
        open={confirmation?.type === "deleteSurvey"}
        onClose={() => setConfirmation(null)}
        title="Delete survey"
        description="This deletes all responses permanently."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirmation(null)}>
              Keep survey
            </Button>
            <Button
              variant="danger"
              loading={deletingSurveyState}
              onClick={handleDeleteSurvey}
            >
              {deletingSurveyState ? "Deleting survey" : "Delete survey"}
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          This removes the survey, its questions, and every collected response.
        </p>
      </Modal>

      <Modal
        open={confirmation?.type === "deleteQuestion"}
        onClose={() => setConfirmation(null)}
        title="Delete question"
        description="Existing answers for this question will no longer appear in the survey flow."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirmation(null)}>
              Keep question
            </Button>
            <Button
              variant="danger"
              loading={
                confirmation?.type === "deleteQuestion" &&
                deletingQuestionId === confirmation.question.id
              }
              onClick={() =>
                confirmation?.type === "deleteQuestion"
                  ? handleDeleteQuestion(confirmation.question)
                  : undefined
              }
            >
              Delete question
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          Use this only when you are sure the question should be removed from the survey.
        </p>
      </Modal>
    </DashboardShell>
  );
}

function SectionCard({
  id,
  title,
  description,
  children,
  footer,
}: {
  id?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card id={id} className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      </div>

      {children}

      {footer ? <div className="flex justify-start">{footer}</div> : null}
    </Card>
  );
}
