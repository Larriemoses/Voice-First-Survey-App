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
} from "../lib/surveys";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "closed";
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

    if (questions.length === 0) {
      setError("Add at least one question before publishing.");
      return;
    }

    try {
      setPublishing(true);
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

  const publicLink = `${window.location.origin}/take-survey/${surveyId}`;

  const validGeneratedCount = useMemo(() => {
    return generatedDraft?.questions.filter((q) => q.prompt.trim()).length || 0;
  }, [generatedDraft]);

  return (
    <DashboardShell>
      <div className="space-y-5 sm:space-y-6 lg:space-y-8">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Loading survey builder...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#EAF2FF] p-3 text-[#0B4EA2]">
                    <FaClipboardList className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">
                      {survey?.title || "Survey Builder"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {survey?.description ||
                        "Build your voice survey questions here."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => navigate(`/surveys/${surveyId}/responses`)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                      type="button"
                    >
                      <FaCopy className="h-4 w-4" />
                      {copying ? "Copying..." : "Copy Link"}
                    </button>

                    <button
                      onClick={handleCloseSurvey}
                      disabled={closingSurvey}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
                      type="button"
                    >
                      <FaLock className="h-4 w-4" />
                      {closingSurvey ? "Closing..." : "Close Survey"}
                    </button>

                    <a
                      href={publicLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#093E81]"
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
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#093E81] disabled:opacity-60"
                      type="button"
                    >
                      <FaRocket className="h-4 w-4" />
                      {publishing ? "Publishing..." : "Publish Survey"}
                    </button>

                    <button
                      onClick={handleDeleteSurvey}
                      disabled={deletingSurvey}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60"
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

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#FFF1E7] p-3 text-[#F56A00]">
                      <FaHandSparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Generate Survey from Brief
                      </h3>
                      <p className="text-sm text-slate-500">
                        Paste your brand thoughts, research direction, or survey
                        plan and generate a draft you can edit.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Brand / Research / Survey Brief
                      </label>
                      <textarea
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        className="min-h-[180px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                        placeholder="Paste your brand brief, research goal, audience context, market thought, product problem, or survey direction here..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateSurvey}
                      disabled={generating}
                      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60 sm:w-auto"
                    >
                      <FaHandSparkles className="h-4 w-4" />
                      {generating ? "Generating..." : "Generate Survey Draft"}
                    </button>
                  </div>
                </div>

                {generatedDraft ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Generated Draft
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Review and edit these generated questions before
                          adding them to your survey.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddGeneratedQuestions}
                        disabled={addingGenerated || validGeneratedCount === 0}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#093E81] disabled:opacity-60"
                      >
                        <FaPlus className="h-4 w-4" />
                        {addingGenerated ? "Adding..." : "Add All to Survey"}
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Suggested Title
                        </label>
                        <input
                          value={generatedDraft.title}
                          onChange={(e) =>
                            setGeneratedDraft({
                              ...generatedDraft,
                              title: e.target.value,
                            })
                          }
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Suggested Description
                        </label>
                        <textarea
                          value={generatedDraft.description}
                          onChange={(e) =>
                            setGeneratedDraft({
                              ...generatedDraft,
                              description: e.target.value,
                            })
                          }
                          className="min-h-[110px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                        />
                      </div>

                      <div className="space-y-4">
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
                                className="min-h-[110px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                              />

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
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
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <FaMicrophoneAlt className="h-5 w-5 text-[#F56A00]" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Add Question Manually
                    </h3>
                  </div>

                  <form
                    onSubmit={handleAddQuestion}
                    className="mt-5 grid gap-4"
                  >
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Question Prompt
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                        placeholder="What would you like respondents to answer by voice?"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Max Duration (seconds)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="600"
                        value={maxDuration}
                        onChange={(e) => setMaxDuration(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60 sm:w-fit"
                    >
                      <FaPlus className="h-4 w-4" />
                      {saving ? "Adding..." : "Add Question"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Survey Summary
                  </h3>

                  <div className="mt-4 space-y-4 text-sm">
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

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Builder Guidance
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Paste enough context for better generation:</p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Who the respondents are</li>
                      <li>What you want to learn</li>
                      <li>Brand or product context</li>
                      <li>Research goals or strategic concerns</li>
                      <li>The kind of answers you want to hear</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaClipboardList className="h-5 w-5 text-[#0B4EA2]" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Survey Questions
                </h3>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-slate-500">
                    No questions added yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {questions.map((question) => {
                    const isEditing = editingQuestionId === question.id;

                    return (
                      <div
                        key={question.id}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#0B4EA2]/20 hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2FF]">
                            <FaMicrophoneAlt className="h-4 w-4 text-[#0B4EA2]" />
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
                                  className="min-h-[110px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                                />

                                <input
                                  type="number"
                                  min="10"
                                  max="600"
                                  value={editingDuration}
                                  onChange={(e) =>
                                    setEditingDuration(e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                                />

                                <div className="flex flex-col gap-3 sm:flex-row">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveQuestion(question.id)
                                    }
                                    disabled={
                                      updatingQuestionId === question.id
                                    }
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#0B4EA2] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#093E81] disabled:opacity-60"
                                  >
                                    <FaSave className="h-4 w-4" />
                                    {updatingQuestionId === question.id
                                      ? "Saving..."
                                      : "Save"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={cancelEditingQuestion}
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                  >
                                    <FaTimes className="h-4 w-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4 className="mt-1 text-base font-semibold text-slate-900">
                                  {question.prompt}
                                </h4>

                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                  <FaClock className="h-4 w-4" />
                                  <span>
                                    Max Duration:{" "}
                                    {question.max_duration_seconds || 0} seconds
                                  </span>
                                </div>

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditingQuestion(question)
                                    }
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60"
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
          </>
        )}
      </div>
    </DashboardShell>
  );
}
