import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaMicrophoneAlt,
  FaPlus,
  FaClipboardList,
  FaClock,
  FaRocket,
  FaLink,
  FaEye,
  FaCopy,
  FaCheckCircle,
  FaHandSparkles,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaImage,
  FaPalette,
} from "react-icons/fa";
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

function SectionToggleButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {open ? <FaTimes className="h-4 w-4" /> : <FaPlus className="h-4 w-4" />}
      <span>{open ? "Close" : "Open"}</span>
    </button>
  );
}

export default function SurveyBuilder() {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prompt, setPrompt] = useState("");
  const [maxDuration, setMaxDuration] = useState("120");

  const [brief, setBrief] = useState("");
  const [generatedDraft, setGeneratedDraft] =
    useState<GeneratedSurveyDraft | null>(null);

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
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
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null,
  );
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showBrandingPanel, setShowBrandingPanel] = useState(false);
  const [showGeneratorPanel, setShowGeneratorPanel] = useState(false);
  const [showAddQuestionPanel, setShowAddQuestionPanel] = useState(false);

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
      console.error("Survey builder load error:", err);
      setError("Failed to load survey data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [surveyId]);

  function clearFeedback() {
    setError("");
    setSuccessMessage("");
  }

  async function handleSaveBranding() {
    if (!surveyId) return;

    clearFeedback();

    if (!surveyTitle.trim()) {
      setError("Survey title is required.");
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
      setSuccessMessage("Survey branding updated successfully.");
    } catch (err) {
      console.error("Save branding error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save survey branding.",
      );
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
      setSuccessMessage(
        "Logo uploaded successfully. Save branding to apply it.",
      );
    } catch (err) {
      console.error("Logo upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload logo.");
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    clearFeedback();

    if (!surveyId) return;

    if (!prompt.trim()) {
      setError("Question prompt is required.");
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
      setSuccessMessage("Question added successfully.");
      await loadData();
    } catch (err) {
      console.error("Add question error:", err);
      setError(err instanceof Error ? err.message : "Failed to add question.");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateSurvey() {
    clearFeedback();

    if (!brief.trim()) {
      setError(
        "Paste your brand brief, research thought, or survey plan first.",
      );
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
      setSuccessMessage("Survey draft generated. Review and edit it below.");
    } catch (err) {
      console.error("Generate survey draft error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate survey draft.",
      );
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

      const updatedQuestions = [...prev.questions];
      const current = updatedQuestions[index];
      if (!current) return prev;

      updatedQuestions[index] = {
        ...current,
        [field]:
          field === "max_duration_seconds"
            ? Math.max(10, Math.min(600, Number(value) || 120))
            : value,
      };

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  }

  function handleRemoveGeneratedQuestion(index: number) {
    setGeneratedDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      };
    });
  }

  async function handleAddGeneratedQuestions() {
    if (!surveyId || !generatedDraft) return;

    clearFeedback();

    const validQuestions = generatedDraft.questions.filter((item) =>
      item.prompt.trim(),
    );

    if (validQuestions.length === 0) {
      setError("Add at least one valid generated question.");
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

      for (let i = 0; i < validQuestions.length; i++) {
        const item = validQuestions[i];

        await addQuestion({
          survey_id: surveyId,
          prompt: item.prompt.trim(),
          order_index: questions.length + i + 1,
          max_duration_seconds: Number(item.max_duration_seconds) || 120,
        });
      }

      setGeneratedDraft(null);
      setBrief("");
      setSuccessMessage("Generated questions added to the survey.");
      await loadData();
    } catch (err) {
      console.error("Add generated questions error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add generated questions.",
      );
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
      setError("Question prompt cannot be empty.");
      return;
    }

    try {
      setUpdatingQuestionId(questionId);

      await updateQuestion(questionId, {
        prompt: editingPrompt.trim(),
        max_duration_seconds: Number(editingDuration) || 120,
      });

      cancelEditingQuestion();
      setSuccessMessage("Question updated successfully.");
      await loadData();
    } catch (err) {
      console.error("Update question error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update question.",
      );
    } finally {
      setUpdatingQuestionId(null);
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?",
    );
    if (!confirmed) return;

    clearFeedback();

    try {
      setDeletingQuestionId(questionId);
      await deleteQuestion(questionId);

      if (editingQuestionId === questionId) {
        cancelEditingQuestion();
      }

      setSuccessMessage("Question deleted successfully.");
      await loadData();
    } catch (err) {
      console.error("Delete question error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete question.",
      );
    } finally {
      setDeletingQuestionId(null);
    }
  }

  async function handlePublishSurvey() {
    if (!surveyId) return;

    clearFeedback();

    if (!surveyTitle.trim()) {
      setError("Survey title is required before publishing.");
      return;
    }

    if (questions.length === 0) {
      setError("Add at least one question before publishing.");
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
      setSuccessMessage("Survey published successfully.");
    } catch (err) {
      console.error("Publish survey error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to publish survey.",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function handleCloseSurvey() {
    if (!surveyId) return;

    const confirmed = window.confirm(
      "Are you sure you want to close this survey? Respondents will no longer be able to submit responses.",
    );
    if (!confirmed) return;

    clearFeedback();

    try {
      setClosingSurvey(true);
      const updated = await closeSurvey(surveyId);
      setSurvey(updated);
      setSuccessMessage("Survey closed successfully.");
    } catch (err) {
      console.error("Close survey error:", err);
      setError(err instanceof Error ? err.message : "Failed to close survey.");
    } finally {
      setClosingSurvey(false);
    }
  }

  async function handleDeleteSurvey() {
    if (!surveyId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this entire survey? This action cannot be undone.",
    );
    if (!confirmed) return;

    clearFeedback();

    try {
      setDeletingSurvey(true);
      await deleteSurvey(surveyId);
      navigate("/surveys");
    } catch (err) {
      console.error("Delete survey error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete survey.");
    } finally {
      setDeletingSurvey(false);
    }
  }

  async function handleCopyLink() {
    clearFeedback();

    try {
      setCopying(true);
      await navigator.clipboard.writeText(publicLink);
      setSuccessMessage("Public survey link copied.");
    } catch (err) {
      console.error("Copy link error:", err);
      setError("Failed to copy link.");
    } finally {
      setCopying(false);
    }
  }

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const publicLink = `${appUrl}/take-survey/${surveyId}`;

  const validGeneratedCount = useMemo(() => {
    return generatedDraft?.questions.filter((q) => q.prompt.trim()).length || 0;
  }, [generatedDraft]);

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-5">
        {loading ? (
          <div className="brand-card p-5 sm:p-6">
            <p className="text-sm text-slate-500">Loading survey builder...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#eef2ff] p-3 text-[#4f46e5]">
                    <FaClipboardList className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">
                      Survey Builder
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Build, brand, and publish your voice survey.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                <button
                  onClick={() => navigate(`/surveys/${surveyId}/responses`)}
                  className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  type="button"
                >
                  <FaEye className="h-4 w-4" />
                  View Responses
                </button>

                {survey?.status === "published" ? (
                  <>
                    <button
                      onClick={handleCopyLink}
                      disabled={copying}
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
                      type="button"
                    >
                      <FaCopy className="h-4 w-4" />
                      {copying ? "Copying..." : "Copy Link"}
                    </button>

                    <button
                      onClick={handleCloseSurvey}
                      disabled={closingSurvey}
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-60 sm:w-auto"
                      type="button"
                    >
                      <FaLock className="h-4 w-4" />
                      {closingSurvey ? "Closing..." : "Close Survey"}
                    </button>

                    <a
                      href={publicLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4338ca]"
                    >
                      <FaLink className="h-4 w-4" />
                      Open Public Survey
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handlePublishSurvey}
                      disabled={publishing}
                      className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4338ca] disabled:opacity-60"
                      type="button"
                    >
                      <FaRocket className="h-4 w-4" />
                      {publishing ? "Publishing..." : "Publish Survey"}
                    </button>

                    <button
                      onClick={handleDeleteSurvey}
                      disabled={deletingSurvey}
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60 sm:w-auto"
                      type="button"
                    >
                      <FaTrash className="h-4 w-4" />
                      {deletingSurvey ? "Deleting..." : "Delete Survey"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <FaCheckCircle className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
                <div className="brand-card p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-2xl bg-[#eef2ff] p-3 text-[#4f46e5]">
                        <FaPalette className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-slate-900">
                          Survey Branding
                        </h3>
                        <p className="truncate text-sm text-slate-500">
                          Make the survey feel branded and trustworthy.
                        </p>
                      </div>
                    </div>

                    <SectionToggleButton
                      open={showBrandingPanel}
                      onClick={() => setShowBrandingPanel((s) => !s)}
                    />
                  </div>

                  {showBrandingPanel ? (
                    <div className="mt-4 grid gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Survey Title
                        </label>
                        <input
                          value={surveyTitle}
                          onChange={(e) => setSurveyTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                          placeholder="Customer Experience Survey"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Survey Description
                        </label>
                        <textarea
                          value={surveyDescription}
                          onChange={(e) => setSurveyDescription(e.target.value)}
                          className="min-h-[90px] w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                          placeholder="Tell respondents what this survey is about."
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Header Text
                        </label>
                        <input
                          value={headerText}
                          onChange={(e) => setHeaderText(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                          placeholder="We value your honest feedback."
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Company Logo
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            <FaImage className="h-4 w-4" />
                            {logoUploading ? "Uploading..." : "Upload Logo"}
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
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                              <img
                                src={logoUrl}
                                alt="Survey logo"
                                className="h-9 w-auto max-w-[110px] object-contain"
                              />
                              <span className="text-xs text-slate-500">
                                Ready
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveBranding}
                        disabled={savingBranding}
                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60 sm:w-fit"
                      >
                        <FaSave className="h-4 w-4" />
                        {savingBranding ? "Saving..." : "Save Branding"}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="brand-card p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-2xl bg-[#ecfeff] p-3 text-[#0891b2]">
                        <FaHandSparkles className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-slate-900">
                          AI Survey Generator
                        </h3>
                        <p className="truncate text-sm text-slate-500">
                          Generate draft questions from your survey brief.
                        </p>
                      </div>
                    </div>

                    <SectionToggleButton
                      open={showGeneratorPanel}
                      onClick={() => setShowGeneratorPanel((s) => !s)}
                    />
                  </div>

                  {showGeneratorPanel ? (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Brand / Research / Survey Brief
                        </label>
                        <textarea
                          value={brief}
                          onChange={(e) => setBrief(e.target.value)}
                          className="min-h-[110px] w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                          placeholder="Paste your brand brief, audience context, research goals, or product direction..."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateSurvey}
                        disabled={generating}
                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60 sm:w-fit"
                      >
                        <FaHandSparkles className="h-4 w-4" />
                        {generating ? "Generating..." : "Generate Draft"}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="brand-card p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-2xl bg-[#ecfeff] p-3 text-[#0891b2]">
                        <FaMicrophoneAlt className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-slate-900">
                          Add Question Manually
                        </h3>
                        <p className="truncate text-sm text-slate-500">
                          Create one question at a time.
                        </p>
                      </div>
                    </div>

                    <SectionToggleButton
                      open={showAddQuestionPanel}
                      onClick={() => setShowAddQuestionPanel((s) => !s)}
                    />
                  </div>

                  {showAddQuestionPanel ? (
                    <form
                      onSubmit={handleAddQuestion}
                      className="mt-4 grid gap-3"
                    >
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Question Prompt
                        </label>
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[96px] w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                          placeholder="What would you like respondents to answer by voice?"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Max Duration (seconds)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="600"
                          value={maxDuration}
                          onChange={(e) => setMaxDuration(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60 sm:w-fit"
                      >
                        <FaPlus className="h-4 w-4" />
                        {saving ? "Adding..." : "Add Question"}
                      </button>
                    </form>
                  ) : null}
                </div>

                {generatedDraft ? (
                  <div className="brand-card p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Generated Draft
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Review and add these generated questions.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddGeneratedQuestions}
                        disabled={addingGenerated || validGeneratedCount === 0}
                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4338ca] disabled:opacity-60"
                      >
                        <FaPlus className="h-4 w-4" />
                        {addingGenerated ? "Adding..." : "Add All"}
                      </button>
                    </div>

                    <div className="mt-3 space-y-3">
                      {generatedDraft.questions.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">
                              Generated Question {index + 1}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveGeneratedQuestion(index)
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <FaTrash className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>

                          <div className="mt-3 space-y-3">
                            <textarea
                              value={item.prompt}
                              onChange={(e) =>
                                handleGeneratedQuestionChange(
                                  index,
                                  "prompt",
                                  e.target.value,
                                )
                              }
                              className="min-h-[84px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#4f46e5]"
                            />

                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Max Duration (seconds)
                              </label>
                              <input
                                type="number"
                                min="10"
                                max="600"
                                value={item.max_duration_seconds}
                                onChange={(e) =>
                                  handleGeneratedQuestionChange(
                                    index,
                                    "max_duration_seconds",
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#4f46e5]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <FaClipboardList className="h-5 w-5 text-[#4f46e5]" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Survey Questions
                    </h3>
                  </div>

                  {questions.length === 0 ? (
                    <div className="brand-card border-dashed border-slate-300 p-8 text-center">
                      <p className="text-sm text-slate-500">
                        No questions added yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {questions.map((question) => {
                        const isEditing = editingQuestionId === question.id;

                        return (
                          <div
                            key={question.id}
                            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#4f46e5]/20 hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff]">
                                <FaMicrophoneAlt className="h-4 w-4 text-[#4f46e5]" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Question {question.order_index}
                                </p>

                                {isEditing ? (
                                  <div className="mt-2 space-y-3">
                                    <textarea
                                      value={editingPrompt}
                                      onChange={(e) =>
                                        setEditingPrompt(e.target.value)
                                      }
                                      className="min-h-[100px] w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                                    />

                                    <input
                                      type="number"
                                      min="10"
                                      max="600"
                                      value={editingDuration}
                                      onChange={(e) =>
                                        setEditingDuration(e.target.value)
                                      }
                                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f46e5]"
                                    />

                                    <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSaveQuestion(question.id)
                                        }
                                        disabled={
                                          updatingQuestionId === question.id
                                        }
                                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4338ca] disabled:opacity-60"
                                      >
                                        <FaSave className="h-4 w-4" />
                                        {updatingQuestionId === question.id
                                          ? "Saving..."
                                          : "Save"}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={cancelEditingQuestion}
                                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                      >
                                        <FaTimes className="h-4 w-4" />
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <h4 className="mt-1 break-words text-base font-semibold text-slate-900">
                                      {question.prompt}
                                    </h4>

                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                      <FaClock className="h-4 w-4" />
                                      <span>
                                        Max Duration:{" "}
                                        {question.max_duration_seconds || 0}{" "}
                                        seconds
                                      </span>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          startEditingQuestion(question)
                                        }
                                        className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                                      >
                                        <FaEdit className="h-4 w-4" />
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteQuestion(question.id)
                                        }
                                        disabled={
                                          deletingQuestionId === question.id
                                        }
                                        className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60 sm:w-auto"
                                      >
                                        <FaTrash className="h-4 w-4" />
                                        {deletingQuestionId === question.id
                                          ? "Deleting..."
                                          : "Delete"}
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="brand-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Survey Preview
                  </h3>

                  <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    {logoUrl ? (
                      <div className="mb-3 flex justify-center sm:justify-start">
                        <img
                          src={logoUrl}
                          alt="Survey logo preview"
                          className="h-10 w-auto max-w-[140px] object-contain"
                        />
                      </div>
                    ) : null}

                    <p className="text-sm font-medium text-slate-500">
                      {surveyTitle || "Survey Title"}
                    </p>

                    <h4 className="mt-1 text-base font-semibold text-slate-900">
                      {headerText || "Your survey header will appear here."}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {surveyDescription ||
                        "Your survey description will appear here."}
                    </p>
                  </div>
                </div>

                <div className="brand-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Survey Summary
                  </h3>

                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500">Status</p>
                      <p className="mt-1 font-medium capitalize text-slate-900">
                        {survey?.status || "draft"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Total Questions</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {questions.length}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Generated Draft Questions
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {generatedDraft?.questions.length || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Public Link</p>
                      <p className="mt-1 break-all font-medium text-slate-900">
                        {survey?.status === "published"
                          ? publicLink
                          : "Publish survey first"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="brand-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Builder Guidance
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>For a stronger branded survey:</p>
                    <ul className="list-disc space-y-1.5 pl-5">
                      <li>Add a recognizable company logo</li>
                      <li>Use a clear survey title</li>
                      <li>Write a short welcoming header</li>
                      <li>Keep questions simple and voice-friendly</li>
                      <li>Make the survey feel trustworthy and easy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
