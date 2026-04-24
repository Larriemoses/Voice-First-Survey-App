import {
  Copy,
  ExternalLink,
  GripVertical,
  Link2,
  Mic,
  PanelLeft,
  PanelRight,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { BuilderNav } from "@/components/layout/BuilderNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/helpers";

type ResponseType = "voice" | "voice-plus-text" | "text";
type AudioSetting = "allow-retry" | "noise-reduction" | "max-90";
type AutosaveState = "idle" | "saving" | "saved";
type SurveyStatus = "draft" | "active";

type BuilderQuestion = {
  id: string;
  text: string;
  hint: string;
  required: boolean;
  responseType: ResponseType;
  audioSettings: AudioSetting[];
};

type AiGoal =
  | "Customer feedback"
  | "Product research"
  | "Employee pulse"
  | "Event follow-up"
  | "Other";

type AiLength = "Short 3-5q" | "Medium 6-8q" | "Full 10-12q";

type SurveyHealth = {
  score: number;
  summary: string;
  tips: string[];
};

const thinScrollbarClass =
  "[scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong";

const responseTypeOptions: Array<{ value: ResponseType; label: string }> = [
  { value: "voice", label: "Voice" },
  { value: "voice-plus-text", label: "Voice + text" },
  { value: "text", label: "Text only" },
];

const audioSettingOptions: Array<{ value: AudioSetting; label: string }> = [
  { value: "allow-retry", label: "Allow retry" },
  { value: "noise-reduction", label: "Noise reduction" },
  { value: "max-90", label: "90 sec cap" },
];

const aiGoalOptions: AiGoal[] = [
  "Customer feedback",
  "Product research",
  "Employee pulse",
  "Event follow-up",
  "Other",
];

const aiLengthOptions: AiLength[] = [
  "Short 3-5q",
  "Medium 6-8q",
  "Full 10-12q",
];

const defaultPreviewHost = "https://survica.vercel.app";

function getId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createQuestion(
  overrides: Partial<BuilderQuestion> = {},
): BuilderQuestion {
  return {
    id: getId("question"),
    text: "What stood out most about your experience?",
    hint: "Ask for a concrete example so your team can act on it.",
    required: true,
    responseType: "voice",
    audioSettings: ["allow-retry", "noise-reduction"],
    ...overrides,
  };
}

function formatSurveyName(value?: string): string {
  if (!value) {
    return "Customer feedback survey";
  }

  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getResponseTypeLabel(value: ResponseType): string {
  return responseTypeOptions.find((option) => option.value === value)?.label ?? "Voice";
}

function getInitialQuestions(isNewSurvey: boolean): BuilderQuestion[] {
  if (isNewSurvey) {
    return [createQuestion()];
  }

  return [
    createQuestion({
      text: "How would you describe your overall experience with us this quarter?",
      hint: "Ask respondents to speak naturally and mention what shaped their impression.",
      required: true,
      responseType: "voice",
      audioSettings: ["allow-retry", "noise-reduction"],
    }),
    createQuestion({
      text: "What part of the experience felt the clearest or most valuable?",
      hint: "Invite a specific example that your team can learn from.",
      required: true,
      responseType: "voice-plus-text",
      audioSettings: [],
    }),
    createQuestion({
      text: "What should we improve before your next interaction?",
      hint: "Keep this open enough for honest feedback but direct enough to stay actionable.",
      required: false,
      responseType: "voice",
      audioSettings: ["allow-retry", "max-90"],
    }),
  ];
}

function getGeneratedQuestions(goal: AiGoal, length: AiLength): string[] {
  const baseSets: Record<AiGoal, string[]> = {
    "Customer feedback": [
      "What part of your recent experience felt most valuable, and why?",
      "Where did the experience feel slower, harder, or less clear than expected?",
      "What would make you more likely to recommend us to someone else?",
      "If you were in charge for one day, what would you improve first?",
      "What did our team do especially well during this interaction?",
      "What nearly stopped you from completing this experience?",
    ],
    "Product research": [
      "What problem were you trying to solve when you reached for this product?",
      "What felt intuitive right away, and what took extra effort to figure out?",
      "What feature do you rely on most today, and why?",
      "What still feels missing for your workflow?",
      "What would make you switch from your current process to this product fully?",
      "How would you describe this product to a teammate in one short explanation?",
    ],
    "Employee pulse": [
      "What has helped you do your best work this month?",
      "What has made work harder or less predictable recently?",
      "How supported do you feel by your team and manager right now?",
      "What would improve your day-to-day work experience most?",
      "What is one concern leadership should understand better?",
      "What should we keep doing because it is clearly working?",
    ],
    "Event follow-up": [
      "What part of the event felt most useful or memorable?",
      "Where did the event experience feel unclear, rushed, or under-supported?",
      "What session, speaker, or activity added the most value for you?",
      "What would make you more likely to attend again?",
      "What should we change before the next event?",
      "How would you describe the event to someone who did not attend?",
    ],
    Other: [
      "What were you hoping to get from this experience?",
      "What worked well for you from start to finish?",
      "Where did things feel difficult, unclear, or frustrating?",
      "What would you change first if you could?",
      "What should our team understand better from your perspective?",
      "Is there anything important we have not asked yet?",
    ],
  };

  const targetCount =
    length === "Short 3-5q" ? 4 : length === "Medium 6-8q" ? 6 : 6;

  return baseSets[goal].slice(0, targetCount);
}

function buildSurveyHealth(
  questions: BuilderQuestion[],
  companyName: string,
): SurveyHealth {
  const questionCount = questions.length;
  const withHints = questions.filter((question) => question.hint.trim().length > 0).length;
  const voiceQuestions = questions.filter((question) => question.responseType !== "text").length;
  const baseScore =
    54 +
    Math.min(questionCount, 6) * 6 +
    Math.round((withHints / Math.max(questionCount, 1)) * 12) +
    Math.round((voiceQuestions / Math.max(questionCount, 1)) * 10) +
    (companyName.trim() ? 6 : 0);

  const score = Math.min(baseScore, 96);
  const tips: string[] = [];

  if (questionCount > 6) {
    tips.push("Trim the survey to five or six questions to protect completion rate.");
  }

  if (withHints < questionCount) {
    tips.push("Add hint text to every question so respondents know the level of detail you need.");
  }

  if (voiceQuestions < questionCount) {
    tips.push("Keep high-value questions voice-based so you capture richer answers.");
  }

  if (!companyName.trim()) {
    tips.push("Add your company name so the public survey feels branded and trustworthy.");
  }

  if (tips.length === 0) {
    tips.push("The question flow is tight. Keep the first question broad and the last one action-oriented.");
    tips.push("Your mix of voice questions is strong. Review the share copy before publishing.");
  }

  const summary =
    score >= 85
      ? "This survey is in strong shape for launch and should collect detailed voice responses."
      : "This survey is close, but a few structure improvements would lift response quality.";

  return {
    score,
    summary,
    tips: tips.slice(0, 3),
  };
}

type QuestionsPanelProps = {
  questions: BuilderQuestion[];
  selectedQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  onAddQuestion: () => void;
  onOpenAiGenerator: () => void;
};

function QuestionsPanel({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onDeleteQuestion,
  onAddQuestion,
  onOpenAiGenerator,
}: QuestionsPanelProps) {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-hint">
          Questions
        </p>
        <p className="text-sm text-text-secondary">
          Reorder the flow, add new prompts, and keep the voice experience tight.
        </p>
      </div>

      <div className={cn("flex flex-1 flex-col gap-3 overflow-y-auto pr-1", thinScrollbarClass)}>
        {questions.map((question, index) => {
          const selected = question.id === selectedQuestionId;

          return (
            <div
              key={question.id}
              className={cn(
                "rounded-xl border bg-surface-card p-3 transition-colors duration-150",
                selected
                  ? "border-brand-blue bg-brand-blue-light/40"
                  : "border-border hover:border-border-strong",
              )}
            >
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  className="mt-0.5 rounded-md p-1 text-text-hint transition-colors duration-150 hover:bg-surface-muted hover:text-text-secondary"
                  aria-label={`Reorder question ${index + 1}`}
                  title="Drag handle"
                >
                  <GripVertical className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectQuestion(question.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-xs font-medium text-text-hint">
                    Q{index + 1} · {getResponseTypeLabel(question.responseType)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-text-primary">
                    {question.text}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {question.required ? <Badge variant="info">Required</Badge> : null}
                    {question.responseType === "voice" ? (
                      <Badge variant="pending">Voice-first</Badge>
                    ) : null}
                  </div>
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  disabled={questions.length === 1}
                  disabledReason="At least one question is required"
                  aria-label={`Delete question ${index + 1}`}
                  onClick={() => onDeleteQuestion(question.id)}
                  leadingIcon={<Trash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAddQuestion}
          className="flex min-h-[86px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-card px-4 text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-brand-blue hover:text-brand-blue"
        >
          <Plus className="h-4 w-4" />
          Add question
        </button>

        <Card
          className="cursor-pointer border-brand-orange/30 bg-brand-orange-light p-4"
          onClick={onOpenAiGenerator}
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-orange p-2 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary">AI question generator</p>
              <p className="text-sm text-text-secondary">
                Generate a focused set of questions from a brief and add only what you want to keep.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

type SettingsPanelProps = {
  companyName: string;
  logoPreviewUrl: string | null;
  logoName: string;
  shareUrl: string;
  surveyStatus: SurveyStatus;
  surveyHealth: SurveyHealth;
  showHealth: boolean;
  onCompanyNameChange: (value: string) => void;
  onUploadLogo: () => void;
  onCopyLink: () => void;
  onOpenPreview: () => void;
};

function SettingsPanel({
  companyName,
  logoPreviewUrl,
  logoName,
  shareUrl,
  surveyStatus,
  surveyHealth,
  showHealth,
  onCompanyNameChange,
  onUploadLogo,
  onCopyLink,
  onOpenPreview,
}: SettingsPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Card className="space-y-4 p-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.16em] text-text-hint">
            Survey branding
          </p>
          <p className="text-sm text-text-secondary">
            Add your logo and company name so the public link feels trustworthy.
          </p>
        </div>

        <button
          type="button"
          onClick={onUploadLogo}
          className="flex min-h-[112px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface-muted px-4 text-center transition-colors duration-150 hover:border-brand-blue"
        >
          {logoPreviewUrl ? (
            <img
              src={logoPreviewUrl}
              alt={logoName || "Uploaded logo"}
              className="h-10 max-w-[120px] object-contain"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
              <Upload className="h-4 w-4" />
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium text-text-primary">
              {logoName || "Upload logo"}
            </p>
            <p className="text-xs text-text-hint">
              PNG, JPG, or SVG. Shows in the respondent header and thank-you screen.
            </p>
          </div>
        </button>

        <Input
          label="Company name"
          value={companyName}
          onChange={(event) => onCompanyNameChange(event.target.value)}
          placeholder="Your company or project name"
        />
      </Card>

      <Card className="space-y-4 p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-hint">
              Share link
            </p>
            <Badge variant={surveyStatus === "active" ? "active" : "draft"}>
              {surveyStatus === "active" ? "Live" : "Draft"}
            </Badge>
          </div>
          <p className="text-sm text-text-secondary">
            Copy the public survey URL or open a preview in a new tab.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-3 text-sm text-text-secondary">
          <Link2 className="h-4 w-4 shrink-0 text-text-hint" />
          <span className="truncate">{shareUrl}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            leadingIcon={<Copy className="h-4 w-4" />}
            onClick={onCopyLink}
          >
            Copy link
          </Button>
          <Button
            variant="ghost"
            leadingIcon={<ExternalLink className="h-4 w-4" />}
            onClick={onOpenPreview}
          >
            Open preview
          </Button>
        </div>
      </Card>

      {showHealth ? (
        <Card className="space-y-4 border-brand-orange/30 bg-brand-orange-light p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="pending">AI coach</Badge>
              <span className="text-sm font-medium text-text-primary">
                Survey health {surveyHealth.score}/100
              </span>
            </div>
            <p className="text-sm text-text-secondary">{surveyHealth.summary}</p>
          </div>

          <div className="rounded-xl border border-white/80 bg-white/80 px-3 py-3">
            <p className="text-sm font-medium text-text-primary">
              Score: {surveyHealth.score}/100
            </p>
            <p className="mt-1 text-xs text-text-hint">
              The score updates automatically as you refine the survey.
            </p>
          </div>

          <div className="space-y-2">
            {surveyHealth.tips.map((tip) => (
              <div
                key={tip}
                className="rounded-lg border border-white/80 bg-white/80 px-3 py-2 text-sm text-text-secondary"
              >
                {tip}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="space-y-2 border-brand-orange/20 bg-brand-orange-light/70 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="pending">AI coach</Badge>
            <span className="text-sm font-medium text-text-primary">
              Add a few more questions
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            Survey health appears once you have at least three questions. That gives the coach enough structure to assess flow and clarity.
          </p>
        </Card>
      )}
    </div>
  );
}

type AiGeneratorModalProps = {
  open: boolean;
  brief: string;
  industry: string;
  goal: AiGoal;
  length: AiLength;
  generatedQuestions: string[];
  selectedQuestions: string[];
  loading: boolean;
  onClose: () => void;
  onBriefChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onGoalChange: (value: AiGoal) => void;
  onLengthChange: (value: AiLength) => void;
  onGenerate: () => void;
  onToggleQuestion: (question: string) => void;
  onAddSelected: () => void;
};

function AiGeneratorModal({
  open,
  brief,
  industry,
  goal,
  length,
  generatedQuestions,
  selectedQuestions,
  loading,
  onClose,
  onBriefChange,
  onIndustryChange,
  onGoalChange,
  onLengthChange,
  onGenerate,
  onToggleQuestion,
  onAddSelected,
}: AiGeneratorModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="AI question generator"
      description="Describe what you want to learn, then keep only the questions that fit."
      footer={
        generatedQuestions.length > 0 && !loading ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onAddSelected} disabled={selectedQuestions.length === 0}>
              Add selected questions
            </Button>
          </div>
        ) : null
      }
    >
      <div className="space-y-5">
        <Textarea
          label="Describe what you want to learn from your audience"
          value={brief}
          onChange={(event) => onBriefChange(event.target.value)}
          placeholder="Example: Understand why customers renew, where pricing feels unclear, and what our team should improve first."
          rows={4}
        />

        <Select
          label="Industry"
          value={industry}
          onChange={(event) => onIndustryChange(event.target.value)}
        >
          <option>Technology</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Financial services</option>
          <option>Retail</option>
          <option>Nonprofit</option>
        </Select>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Survey goal</p>
          <div className="flex flex-wrap gap-2">
            {aiGoalOptions.map((option) => (
              <Chip
                key={option}
                active={goal === option}
                onClick={() => onGoalChange(option)}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Target length</p>
          <div className="flex flex-wrap gap-2">
            {aiLengthOptions.map((option) => (
              <Chip
                key={option}
                active={length === option}
                onClick={() => onLengthChange(option)}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <SkeletonBlock className="h-[68px] rounded-xl" />
            <SkeletonBlock className="h-[68px] rounded-xl" />
            <SkeletonBlock className="h-[68px] rounded-xl" />
          </div>
        ) : generatedQuestions.length > 0 ? (
          <div className="space-y-2">
            {generatedQuestions.map((question) => (
              <label
                key={question}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface-card px-4 py-3 text-sm text-text-secondary"
              >
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(question)}
                  onChange={() => onToggleQuestion(question)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-brand-blue focus:ring-brand-blue"
                />
                <span>{question}</span>
              </label>
            ))}
          </div>
        ) : null}

        <div className="flex justify-start">
          <Button
            variant="orange"
            loading={loading}
            leadingIcon={<Sparkles className="h-4 w-4" />}
            onClick={onGenerate}
            disabled={!brief.trim()}
          >
            Generate questions
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function BuilderPage() {
  const location = useLocation();
  const { id } = useParams();
  const { showToast } = useToast();
  const isNewSurvey = location.pathname === "/dashboard/surveys/new";

  const [questions, setQuestions] = useState<BuilderQuestion[]>(() =>
    getInitialQuestions(isNewSurvey),
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>(
    isNewSurvey ? "draft" : "active",
  );
  const [surveyName] = useState<string>(() =>
    isNewSurvey ? "New voice survey" : formatSurveyName(id),
  );
  const [companyName, setCompanyName] = useState<string>(
    isNewSurvey ? "Your company" : "Acme customer research",
  );
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string>("");
  const [questionsDrawerOpen, setQuestionsDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [autosaveState, setAutosaveState] = useState<AutosaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiBrief, setAiBrief] = useState("");
  const [aiIndustry, setAiIndustry] = useState("Technology");
  const [aiGoal, setAiGoal] = useState<AiGoal>("Customer feedback");
  const [aiLength, setAiLength] = useState<AiLength>("Short 3-5q");
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [selectedGeneratedQuestions, setSelectedGeneratedQuestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasBootstrappedRef = useRef(false);

  const selectedQuestion =
    questions.find((question) => question.id === selectedQuestionId) ?? questions[0] ?? null;

  const sharePath = useMemo(() => {
    const base = slugify(isNewSurvey ? surveyName : `${surveyName}-${companyName}`);
    return `/s/${base || "voice-survey"}`;
  }, [companyName, isNewSurvey, surveyName]);

  const shareUrl = useMemo(() => {
    const appUrl =
      import.meta.env.VITE_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : defaultPreviewHost);

    return `${appUrl}${sharePath}`;
  }, [sharePath]);

  const surveyHealth = useMemo(
    () => buildSurveyHealth(questions, companyName),
    [companyName, questions],
  );

  useEffect(() => {
    const hasSelectedQuestion = questions.some(
      (question) => question.id === selectedQuestionId,
    );

    if (!hasSelectedQuestion && questions[0]) {
      setSelectedQuestionId(questions[0].id);
    }
  }, [questions, selectedQuestionId]);

  useEffect(() => {
    if (!hasBootstrappedRef.current) {
      hasBootstrappedRef.current = true;
      return undefined;
    }

    setAutosaveState("saving");

    const timer = window.setTimeout(() => {
      setAutosaveState("saved");
      setLastSavedAt(new Date());
    }, 800);

    return () => window.clearTimeout(timer);
  }, [companyName, logoName, logoPreviewUrl, questions, surveyStatus]);

  function patchQuestion(
    questionId: string,
    updater: (question: BuilderQuestion) => BuilderQuestion,
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? updater(question) : question,
      ),
    );
  }

  function handleAddQuestion() {
    const nextQuestion = createQuestion({
      text: "What else should our team understand from your perspective?",
      hint: "Use this as a follow-up to capture anything the earlier questions missed.",
      required: false,
    });

    setQuestions((current) => [...current, nextQuestion]);
    setSelectedQuestionId(nextQuestion.id);
    showToast({
      title: "Question added",
      description: "The new question is ready to edit.",
      variant: "success",
    });
  }

  function handleDeleteQuestion(questionId: string) {
    if (questions.length === 1) {
      return;
    }

    const currentIndex = questions.findIndex((question) => question.id === questionId);
    const nextQuestions = questions.filter((question) => question.id !== questionId);
    const fallbackQuestion =
      nextQuestions[Math.max(0, currentIndex - 1)] ?? nextQuestions[0] ?? null;

    setQuestions(nextQuestions);

    if (selectedQuestionId === questionId && fallbackQuestion) {
      setSelectedQuestionId(fallbackQuestion.id);
    }

    showToast({
      title: "Question removed",
      description: "The survey flow has been updated.",
      variant: "info",
    });
  }

  function handleToggleAudioSetting(setting: AudioSetting) {
    if (!selectedQuestion) {
      return;
    }

    patchQuestion(selectedQuestion.id, (question) => ({
      ...question,
      audioSettings: question.audioSettings.includes(setting)
        ? question.audioSettings.filter((value) => value !== setting)
        : [...question.audioSettings, setting],
    }));
  }

  function handleUploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setLogoPreviewUrl(result);
      setLogoName(file.name);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast({
        title: "Link copied",
        description: "The public survey URL is ready to share.",
        variant: "success",
      });
    } catch {
      showToast({
        title: "Copy failed",
        description: "Clipboard access was blocked. Copy the link manually instead.",
        variant: "error",
      });
    }
  }

  function handleOpenPreview() {
    if (typeof window === "undefined") {
      return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  function handlePrimaryAction() {
    if (surveyStatus === "draft") {
      setSurveyStatus("active");
      showToast({
        title: "Survey published",
        description: "Your share link is now ready for respondents.",
        variant: "success",
      });
      return;
    }

    setSurveyStatus("draft");
    showToast({
      title: "Survey moved to draft",
      description: "The public link can be updated before you publish again.",
      variant: "info",
    });
  }

  function handleGenerateQuestions() {
    setAiLoading(true);

    window.setTimeout(() => {
      const nextQuestions = getGeneratedQuestions(aiGoal, aiLength);
      setGeneratedQuestions(nextQuestions);
      setSelectedGeneratedQuestions(nextQuestions);
      setAiLoading(false);
    }, 900);
  }

  function handleAddSelectedQuestions() {
    if (selectedGeneratedQuestions.length === 0) {
      return;
    }

    const nextQuestions = selectedGeneratedQuestions.map((question) =>
      createQuestion({
        text: question,
        hint: "Ask for examples or specifics so the insight stays actionable.",
        required: false,
        responseType: "voice",
        audioSettings: ["allow-retry", "noise-reduction"],
      }),
    );

    setQuestions((current) => [...current, ...nextQuestions]);
    setSelectedQuestionId(nextQuestions[0]?.id ?? selectedQuestionId);
    setAiModalOpen(false);
    showToast({
      title: "Questions added",
      description: `${nextQuestions.length} AI-generated questions were added to the builder.`,
      variant: "success",
    });
  }

  function toggleGeneratedQuestion(question: string) {
    setSelectedGeneratedQuestions((current) =>
      current.includes(question)
        ? current.filter((item) => item !== question)
        : [...current, question],
    );
  }

  const autosaveLabel =
    autosaveState === "saving"
      ? "Saving changes..."
      : lastSavedAt
        ? "All changes saved"
        : "Draft ready";
  const autosaveTone =
    autosaveState === "saving"
      ? "saving"
      : lastSavedAt
        ? "saved"
        : "default";

  const panelProps = {
    questions,
    selectedQuestionId,
    onSelectQuestion: setSelectedQuestionId,
    onDeleteQuestion: handleDeleteQuestion,
    onAddQuestion: handleAddQuestion,
    onOpenAiGenerator: () => setAiModalOpen(true),
  } satisfies QuestionsPanelProps;

  const settingsPanelProps = {
    companyName,
    logoPreviewUrl,
    logoName,
    shareUrl,
    surveyStatus,
    surveyHealth,
    showHealth: questions.length >= 3,
    onCompanyNameChange: setCompanyName,
    onUploadLogo: () => fileInputRef.current?.click(),
    onCopyLink: handleCopyLink,
    onOpenPreview: handleOpenPreview,
  } satisfies SettingsPanelProps;

  return (
    <AppShell>
      <BuilderNav
        surveyName={surveyName}
        statusLabel={surveyStatus === "active" ? "Active" : "Draft"}
        statusVariant={surveyStatus === "active" ? "active" : "draft"}
        primaryActionLabel={surveyStatus === "active" ? "Close survey" : "Publish"}
        autosaveLabel={autosaveLabel}
        autosaveTone={autosaveTone}
        onPreview={handleOpenPreview}
        onPrimaryAction={handlePrimaryAction}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="sr-only"
        onChange={handleUploadLogo}
      />

      <div className="grid min-h-[calc(100vh-84px)] grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_200px]">
        <aside className="hidden border-r border-border bg-surface-muted/70 md:block">
          <QuestionsPanel {...panelProps} />
        </aside>

        <section className="min-w-0 bg-surface-card">
          <div className="flex flex-col gap-5 p-4 md:p-6">
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                variant="secondary"
                size="sm"
                className="md:hidden"
                leadingIcon={<PanelLeft className="h-4 w-4" />}
                onClick={() => setQuestionsDrawerOpen(true)}
              >
                Questions
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<PanelRight className="h-4 w-4" />}
                onClick={() => setSettingsDrawerOpen(true)}
              >
                Settings
              </Button>
            </div>

            {selectedQuestion ? (
              <>
                <Card className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-text-hint">
                      Editing Q
                      {questions.findIndex((question) => question.id === selectedQuestion.id) + 1}
                    </p>
                    <h2 className="text-lg font-medium text-text-primary">
                      Shape the prompt and response settings
                    </h2>
                  </div>

                  <Textarea
                    label="Question text"
                    value={selectedQuestion.text}
                    onChange={(event) =>
                      patchQuestion(selectedQuestion.id, (question) => ({
                        ...question,
                        text: event.target.value,
                      }))
                    }
                    rows={4}
                  />

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-text-primary">Response type</p>
                    <div className="flex flex-wrap gap-2">
                      {responseTypeOptions.map((option) => (
                        <Chip
                          key={option.value}
                          active={selectedQuestion.responseType === option.value}
                          onClick={() =>
                            patchQuestion(selectedQuestion.id, (question) => ({
                              ...question,
                              responseType: option.value,
                              audioSettings:
                                option.value === "voice"
                                  ? question.audioSettings.length > 0
                                    ? question.audioSettings
                                    : ["allow-retry"]
                                  : [],
                            }))
                          }
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Hint text"
                    value={selectedQuestion.hint}
                    onChange={(event) =>
                      patchQuestion(selectedQuestion.id, (question) => ({
                        ...question,
                        hint: event.target.value,
                      }))
                    }
                    placeholder="Guide respondents toward the detail you need"
                  />

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-muted px-4 py-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-text-primary">Required</p>
                      <p className="text-sm text-text-secondary">
                        Make this question mandatory before respondents move on.
                      </p>
                    </div>
                    <Toggle
                      checked={selectedQuestion.required}
                      onCheckedChange={(checked) =>
                        patchQuestion(selectedQuestion.id, (question) => ({
                          ...question,
                          required: checked,
                        }))
                      }
                    />
                  </div>

                  {selectedQuestion.responseType === "voice" ? (
                    <div className="space-y-3 rounded-xl border border-border bg-surface-muted px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-brand-blue-light p-2 text-brand-blue">
                          <Mic className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-text-primary">
                            Voice capture settings
                          </p>
                          <p className="text-sm text-text-secondary">
                            Tune how respondents record their answer for this voice-only prompt.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {audioSettingOptions.map((option) => (
                          <Chip
                            key={option.value}
                            active={selectedQuestion.audioSettings.includes(option.value)}
                            onClick={() => handleToggleAudioSetting(option.value)}
                          >
                            {option.label}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>

                <Card className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-text-hint">
                      Live preview
                    </p>
                    <h2 className="text-lg font-medium text-text-primary">
                      How this question will feel to respondents
                    </h2>
                  </div>

                  <div className="space-y-4 rounded-xl border border-border bg-surface-muted p-4">
                    <div className="flex items-center gap-3 border-b border-border pb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light text-sm font-medium text-brand-blue">
                        {companyName.trim().slice(0, 2).toUpperCase() || "SV"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{companyName}</p>
                        <p className="text-xs text-text-hint">Voice survey preview</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-base font-medium text-text-primary">
                        {selectedQuestion.text}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {selectedQuestion.hint || "Respondents will see your guidance here."}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface-card p-4">
                      <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-orange text-white shadow-md">
                        <Mic className="h-6 w-6" />
                      </div>
                      <p className="mt-3 text-center text-sm font-medium text-text-primary">
                        Tap and hold to record
                      </p>
                      <div className="mt-3 h-10 rounded-lg bg-surface-muted" />
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <EmptyState
                icon={<Mic className="h-5 w-5" />}
                title="Add your first question"
                description="Start with one core prompt. You can add follow-ups and voice settings after that."
                action={
                  <Button onClick={handleAddQuestion} leadingIcon={<Plus className="h-4 w-4" />}>
                    Add question
                  </Button>
                }
              />
            )}
          </div>
        </section>

        <aside className="hidden border-l border-border bg-surface-muted/70 lg:block">
          <SettingsPanel {...settingsPanelProps} />
        </aside>
      </div>

      <Drawer
        open={questionsDrawerOpen}
        onClose={() => setQuestionsDrawerOpen(false)}
        title="Questions"
        description="Reorder and manage the survey flow."
        contentClassName="p-0"
      >
        <QuestionsPanel
          {...panelProps}
          onSelectQuestion={(questionId) => {
            setSelectedQuestionId(questionId);
            setQuestionsDrawerOpen(false);
          }}
        />
      </Drawer>

      <Drawer
        open={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        title="Survey settings"
        description="Branding, share link, and AI coach."
        contentClassName={cn("p-0", thinScrollbarClass)}
      >
        <SettingsPanel {...settingsPanelProps} />
      </Drawer>

      <AiGeneratorModal
        open={aiModalOpen}
        brief={aiBrief}
        industry={aiIndustry}
        goal={aiGoal}
        length={aiLength}
        generatedQuestions={generatedQuestions}
        selectedQuestions={selectedGeneratedQuestions}
        loading={aiLoading}
        onClose={() => setAiModalOpen(false)}
        onBriefChange={setAiBrief}
        onIndustryChange={setAiIndustry}
        onGoalChange={setAiGoal}
        onLengthChange={setAiLength}
        onGenerate={handleGenerateQuestions}
        onToggleQuestion={toggleGeneratedQuestion}
        onAddSelected={handleAddSelectedQuestions}
      />
    </AppShell>
  );
}
