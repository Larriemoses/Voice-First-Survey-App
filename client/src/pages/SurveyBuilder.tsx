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
  FaChevronDown,
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

const STATUS_CONFIG = {
  draft:     { label: "Draft",     dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  published: { label: "Published", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  closed:    { label: "Closed",    dot: "bg-slate-400",   text: "text-slate-600",   bg: "bg-slate-100 border-slate-200" },
};

function StatusBadge({ status }: { status: Survey["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Accordion({
  icon,
  title,
  subtitle,
  iconBg,
  iconColor,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <FaChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 ${props.className ?? ""}`}
    />
  );
}

function PrimaryBtn({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function DangerBtn({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 active:scale-[0.98] disabled:opacity-50 ${className}`}
    >
      {children}
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
      console.error(err);
      setError("Failed to load survey data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [surveyId]);

  function clearFeedback() { setError(""); setSuccessMessage(""); }

  async function handleSaveBranding() {
    if (!surveyId) return;
    clearFeedback();
    if (!surveyTitle.trim()) { setError("Survey title is required."); return; }
    try {
      setSavingBranding(true);
      const updated = await updateSurvey(surveyId, {
        title: surveyTitle.trim(),
        description: surveyDescription.trim() || null,
        header_text: headerText.trim() || null,
        logo_url: logoUrl || null,
      });
      setSurvey(updated);
      setSuccessMessage("Branding saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save branding.");
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
      setSuccessMessage("Logo uploaded. Save branding to apply.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo.");
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    clearFeedback();
    if (!surveyId || !prompt.trim()) { setError("Question prompt is required."); return; }
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
      setSuccessMessage("Question added.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add question.");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateSurvey() {
    clearFeedback();
    if (!brief.trim()) { setError("Paste your brief first."); return; }
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
      setSuccessMessage("Draft generated. Review below.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate draft.");
    } finally {
      setGenerating(false);
    }
  }

  function handleGeneratedQuestionChange(index: number, field: keyof GeneratedQuestion, value: string) {
    setGeneratedDraft((prev) => {
      if (!prev) return prev;
      const updated = [...prev.questions];
      updated[index] = {
        ...updated[index],
        [field]: field === "max_duration_seconds" ? Math.max(10, Math.min(600, Number(value) || 120)) : value,
      };
      return { ...prev, questions: updated };
    });
  }

  function handleRemoveGeneratedQuestion(index: number) {
    setGeneratedDraft((prev) => prev ? { ...prev, questions: prev.questions.filter((_, i) => i !== index) } : prev);
  }

  async function handleAddGeneratedQuestions() {
    if (!surveyId || !generatedDraft) return;
    clearFeedback();
    const valid = generatedDraft.questions.filter((q) => q.prompt.trim());
    if (!valid.length) { setError("Add at least one valid question."); return; }
    try {
      setAddingGenerated(true);
      await updateSurvey(surveyId, {
        title: surveyTitle.trim() || generatedDraft.title,
        description: surveyDescription.trim() || generatedDraft.description,
        header_text: headerText.trim() || null,
        logo_url: logoUrl || null,
      });
      for (let i = 0; i < valid.length; i++) {
        await addQuestion({
          survey_id: surveyId,
          prompt: valid[i].prompt.trim(),
          order_index: questions.length + i + 1,
          max_duration_seconds: Number(valid[i].max_duration_seconds) || 120,
        });
      }
      setGeneratedDraft(null);
      setBrief("");
      setSuccessMessage("Generated questions added.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add questions.");
    } finally {
      setAddingGenerated(false);
    }
  }

  function startEditingQuestion(q: Question) {
    setEditingQuestionId(q.id);
    setEditingPrompt(q.prompt);
    setEditingDuration(String(q.max_duration_seconds || 120));
    clearFeedback();
  }

  function cancelEditingQuestion() {
    setEditingQuestionId(null);
    setEditingPrompt("");
    setEditingDuration("120");
  }

  async function handleSaveQuestion(questionId: string) {
    clearFeedback();
    if (!editingPrompt.trim()) { setError("Prompt cannot be empty."); return; }
    try {
      setUpdatingQuestionId(questionId);
      await updateQuestion(questionId, {
        prompt: editingPrompt.trim(),
        max_duration_seconds: Number(editingDuration) || 120,
      });
      cancelEditingQuestion();
      setSuccessMessage("Question updated.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update question.");
    } finally {
      setUpdatingQuestionId(null);
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!window.confirm("Delete this question?")) return;
    clearFeedback();
    try {
      setDeletingQuestionId(questionId);
      await deleteQuestion(questionId);
      if (editingQuestionId === questionId) cancelEditingQuestion();
      setSuccessMessage("Question deleted.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete question.");
    } finally {
      setDeletingQuestionId(null);
    }
  }

  async function handlePublishSurvey() {
    if (!surveyId) return;
    clearFeedback();
    if (!surveyTitle.trim()) { setError("Survey title required before publishing."); return; }
    if (!questions.length) { setError("Add at least one question before publishing."); return; }
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
      setSuccessMessage("Survey published.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleCloseSurvey() {
    if (!surveyId || !window.confirm("Close this survey? Respondents won't be able to submit.")) return;
    clearFeedback();
    try {
      setClosingSurvey(true);
      const updated = await closeSurvey(surveyId);
      setSurvey(updated);
      setSuccessMessage("Survey closed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close survey.");
    } finally {
      setClosingSurvey(false);
    }
  }

  async function handleDeleteSurvey() {
    if (!surveyId || !window.confirm("Delete this entire survey? This cannot be undone.")) return;
    clearFeedback();
    try {
      setDeletingSurvey(true);
      await deleteSurvey(surveyId);
      navigate("/surveys");
    } catch (err) {
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
      setSuccessMessage("Link copied.");
    } catch {
      setError("Failed to copy link.");
    } finally {
      setCopying(false);
    }
  }

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const publicLink = `${appUrl}/take-survey/${surveyId}`;

  const validGeneratedCount = useMemo(
    () => generatedDraft?.questions.filter((q) => q.prompt.trim()).length || 0,
    [generatedDraft],
  );

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-2 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading builder…</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="min-h-screen bg-slate-50 pb-16">

        {/* ── Top Bar ── */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/surveys")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold text-slate-900">
                  {surveyTitle || "Untitled Survey"}
                </h1>
                <p className="text-xs text-slate-400">Survey Builder</p>
              </div>
              {survey?.status && <StatusBadge status={survey.status} />}
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-2">
              <GhostBtn onClick={() => navigate(`/surveys/${surveyId}/responses`)} className="hidden sm:inline-flex">
                <FaEye className="h-3.5 w-3.5" />
                <span>Responses</span>
              </GhostBtn>

              {survey?.status === "published" ? (
                <>
                  <GhostBtn onClick={handleCopyLink} disabled={copying}>
                    <FaCopy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{copying ? "Copying…" : "Copy Link"}</span>
                  </GhostBtn>
                  <button
                    type="button"
                    onClick={handleCloseSurvey}
                    disabled={closingSurvey}
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                  >
                    <FaLock className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{closingSurvey ? "Closing…" : "Close"}</span>
                  </button>
                  <a
                    href={publicLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <FaLink className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Open Survey</span>
                  </a>
                </>
              ) : (
                <>
                  <DangerBtn onClick={handleDeleteSurvey} disabled={deletingSurvey} className="hidden sm:inline-flex">
                    <FaTrash className="h-3.5 w-3.5" />
                    <span>{deletingSurvey ? "Deleting…" : "Delete"}</span>
                  </DangerBtn>
                  <PrimaryBtn onClick={handlePublishSurvey} disabled={publishing}>
                    <FaRocket className="h-3.5 w-3.5" />
                    <span>{publishing ? "Publishing…" : "Publish"}</span>
                  </PrimaryBtn>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Feedback banners ── */}
        {(error || successMessage) && (
          <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <FaCheckCircle className="h-4 w-4 shrink-0" />
                {successMessage}
              </div>
            )}
          </div>
        )}

        {/* ── Main content ── */}
        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

            {/* Left column */}
            <div className="space-y-3">

              {/* Branding */}
              <Accordion
                icon={<FaPalette className="h-4 w-4" />}
                iconBg="bg-violet-100"
                iconColor="text-violet-600"
                title="Survey Branding"
                subtitle="Logo, title, header & description"
                open={showBrandingPanel}
                onToggle={() => setShowBrandingPanel((s) => !s)}
              >
                <div className="space-y-3">
                  <div>
                    <Label>Survey Title</Label>
                    <Input value={surveyTitle} onChange={(e) => setSurveyTitle(e.target.value)} placeholder="e.g. Customer Experience Survey" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={surveyDescription} onChange={(e) => setSurveyDescription(e.target.value)} placeholder="What this survey is about…" rows={3} />
                  </div>
                  <div>
                    <Label>Header Text</Label>
                    <Input value={headerText} onChange={(e) => setHeaderText(e.target.value)} placeholder="e.g. We value your honest feedback." />
                  </div>
                  <div>
                    <Label>Logo</Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                        <FaImage className="h-3.5 w-3.5 text-slate-400" />
                        {logoUploading ? "Uploading…" : "Upload Logo"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)} />
                      </label>
                      {logoUrl && (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                          <img src={logoUrl} alt="Logo" className="h-7 w-auto max-w-[100px] object-contain" />
                          <span className="text-xs text-slate-400">Ready</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <PrimaryBtn onClick={handleSaveBranding} disabled={savingBranding}>
                    <FaSave className="h-3.5 w-3.5" />
                    {savingBranding ? "Saving…" : "Save Branding"}
                  </PrimaryBtn>
                </div>
              </Accordion>

              {/* AI Generator */}
              <Accordion
                icon={<FaHandSparkles className="h-4 w-4" />}
                iconBg="bg-cyan-100"
                iconColor="text-cyan-600"
                title="AI Survey Generator"
                subtitle="Generate questions from your brief"
                open={showGeneratorPanel}
                onToggle={() => setShowGeneratorPanel((s) => !s)}
              >
                <div className="space-y-3">
                  <div>
                    <Label>Brand / Research Brief</Label>
                    <Textarea
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder="Paste your brand brief, audience context, research goals…"
                      rows={4}
                    />
                  </div>
                  <PrimaryBtn onClick={handleGenerateSurvey} disabled={generating}>
                    <FaHandSparkles className="h-3.5 w-3.5" />
                    {generating ? "Generating…" : "Generate Draft"}
                  </PrimaryBtn>
                </div>
              </Accordion>

              {/* Add Question */}
              <Accordion
                icon={<FaPlus className="h-4 w-4" />}
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
                title="Add Question"
                subtitle="Create a question manually"
                open={showAddQuestionPanel}
                onToggle={() => setShowAddQuestionPanel((s) => !s)}
              >
                <form onSubmit={handleAddQuestion} className="space-y-3">
                  <div>
                    <Label>Question Prompt</Label>
                    <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="What would you like respondents to answer by voice?" rows={3} />
                  </div>
                  <div>
                    <Label>Max Duration (seconds)</Label>
                    <Input type="number" min="10" max="600" value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)} />
                  </div>
                  <PrimaryBtn type="submit" disabled={saving}>
                    <FaPlus className="h-3.5 w-3.5" />
                    {saving ? "Adding…" : "Add Question"}
                  </PrimaryBtn>
                </form>
              </Accordion>

              {/* Generated Draft */}
              {generatedDraft && (
                <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between gap-3 border-b border-indigo-100 bg-indigo-50 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">Generated Draft</p>
                      <p className="text-xs text-indigo-500">{validGeneratedCount} question{validGeneratedCount !== 1 ? "s" : ""} ready</p>
                    </div>
                    <PrimaryBtn onClick={handleAddGeneratedQuestions} disabled={addingGenerated || validGeneratedCount === 0}>
                      <FaPlus className="h-3.5 w-3.5" />
                      {addingGenerated ? "Adding…" : "Add All"}
                    </PrimaryBtn>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {generatedDraft.questions.map((item, index) => (
                      <div key={index} className="px-5 py-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Q{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGeneratedQuestion(index)}
                            className="text-xs text-slate-400 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                        <Textarea
                          value={item.prompt}
                          onChange={(e) => handleGeneratedQuestionChange(index, "prompt", e.target.value)}
                          rows={2}
                          className="mb-2"
                        />
                        <div className="flex items-center gap-2">
                          <FaClock className="h-3 w-3 text-slate-400" />
                          <Input
                            type="number"
                            min="10"
                            max="600"
                            value={item.max_duration_seconds}
                            onChange={(e) => handleGeneratedQuestionChange(index, "max_duration_seconds", e.target.value)}
                            className="w-28"
                          />
                          <span className="text-xs text-slate-400">seconds</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FaClipboardList className="h-4 w-4 text-indigo-500" />
                    Questions
                    <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      {questions.length}
                    </span>
                  </h2>
                </div>

                {questions.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-12 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <FaMicrophoneAlt className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No questions yet</p>
                    <p className="mt-1 text-xs text-slate-400">Add questions above or generate with AI.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {questions.map((question) => {
                      const isEditing = editingQuestionId === question.id;
                      return (
                        <div
                          key={question.id}
                          className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                              {question.order_index}
                            </div>
                            <div className="min-w-0 flex-1">
                              {isEditing ? (
                                <div className="space-y-3">
                                  <Textarea
                                    value={editingPrompt}
                                    onChange={(e) => setEditingPrompt(e.target.value)}
                                    rows={3}
                                  />
                                  <div className="flex items-center gap-2">
                                    <FaClock className="h-3 w-3 text-slate-400" />
                                    <Input
                                      type="number"
                                      min="10"
                                      max="600"
                                      value={editingDuration}
                                      onChange={(e) => setEditingDuration(e.target.value)}
                                      className="w-28"
                                    />
                                    <span className="text-xs text-slate-400">seconds</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <PrimaryBtn
                                      onClick={() => handleSaveQuestion(question.id)}
                                      disabled={updatingQuestionId === question.id}
                                    >
                                      <FaSave className="h-3.5 w-3.5" />
                                      {updatingQuestionId === question.id ? "Saving…" : "Save"}
                                    </PrimaryBtn>
                                    <GhostBtn onClick={cancelEditingQuestion}>
                                      <FaTimes className="h-3.5 w-3.5" />
                                      Cancel
                                    </GhostBtn>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm font-medium leading-relaxed text-slate-900">{question.prompt}</p>
                                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                                    <FaClock className="h-3 w-3" />
                                    {question.max_duration_seconds || 0}s max
                                  </div>
                                  <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <GhostBtn onClick={() => startEditingQuestion(question)} className="h-8 px-3 text-xs">
                                      <FaEdit className="h-3 w-3" />
                                      Edit
                                    </GhostBtn>
                                    <DangerBtn
                                      onClick={() => handleDeleteQuestion(question.id)}
                                      disabled={deletingQuestionId === question.id}
                                      className="h-8 px-3 text-xs"
                                    >
                                      <FaTrash className="h-3 w-3" />
                                      {deletingQuestionId === question.id ? "Deleting…" : "Delete"}
                                    </DangerBtn>
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

            {/* Right sidebar */}
            <div className="space-y-4 lg:sticky lg:top-20 lg:h-fit">

              {/* Preview */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preview</p>
                </div>
                <div className="p-4">
                  {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="mb-3 h-8 w-auto max-w-[120px] object-contain" />
                  )}
                  <p className="text-xs font-semibold text-slate-500">{surveyTitle || "Survey Title"}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {headerText || "Your header will appear here."}
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {surveyDescription || "Your description will appear here."}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Summary</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { label: "Status", value: survey?.status || "draft", isStatus: true },
                    { label: "Questions", value: String(questions.length), isStatus: false },
                    { label: "Draft Queue", value: String(generatedDraft?.questions.length || 0), isStatus: false },
                  ].map(({ label, value, isStatus }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs text-slate-500">{label}</span>
                      {isStatus && survey?.status ? (
                        <StatusBadge status={survey.status} />
                      ) : (
                        <span className="text-xs font-semibold text-slate-900">{value}</span>
                      )}
                    </div>
                  ))}
                  {survey?.status === "published" && (
                    <div className="px-4 py-3">
                      <p className="mb-1 text-xs text-slate-500">Public Link</p>
                      <p className="break-all font-mono text-xs text-indigo-600">{publicLink}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Builder Tips</p>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  {[
                    "Add a recognizable logo",
                    "Use a clear, descriptive title",
                    "Write a welcoming header",
                    "Keep questions concise",
                    "Publish when ready",
                  ].map((tip) => (
                    <li key={tip} className="flex items-center gap-2">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile-only delete (for draft surveys) */}
              {survey?.status !== "published" && (
                <DangerBtn onClick={handleDeleteSurvey} disabled={deletingSurvey} className="w-full sm:hidden">
                  <FaTrash className="h-3.5 w-3.5" />
                  {deletingSurvey ? "Deleting…" : "Delete Survey"}
                </DangerBtn>
              )}

              {/* Mobile-only responses */}
              <GhostBtn onClick={() => navigate(`/surveys/${surveyId}/responses`)} className="w-full sm:hidden">
                <FaEye className="h-3.5 w-3.5" />
                View Responses
              </GhostBtn>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
