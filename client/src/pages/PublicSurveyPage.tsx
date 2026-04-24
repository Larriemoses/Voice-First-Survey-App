import {
  CheckCircle2,
  ChevronRight,
  Mic,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";

type RecordState = "idle" | "recording" | "recorded";

type PublicSurveyQuestion = {
  id: string;
  text: string;
  hint: string;
  required: boolean;
};

type PublicSurveyDefinition = {
  companyName: string;
  surveyLabel: string;
  logoSrc: string | null;
  redirectUrl: string | null;
  questions: PublicSurveyQuestion[];
};

type RecordedResponse = {
  questionId: string;
  audioBlob: Blob | null;
  durationMs: number | null;
  skipped: boolean;
};

const MIN_RECORDING_MS = 1000;
const REDIRECT_SECONDS = 5;

function toTitleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function getInitials(value: string): string {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "SV";
}

function formatDuration(durationMs: number): string {
  const seconds = Math.max(1, Math.round(durationMs / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  if (minutes === 0) {
    return `${remainder}s`;
  }

  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function buildPublicSurvey(slug?: string): PublicSurveyDefinition {
  const resolvedSlug = slug?.trim() || "customer-voice";
  const formatted = toTitleCase(resolvedSlug);
  const fallbackCompany = formatted.includes(" ")
    ? formatted.split(" ").slice(0, 2).join(" ")
    : "Acme Research";

  return {
    companyName: fallbackCompany,
    surveyLabel: `${formatted} survey`,
    logoSrc: resolvedSlug.includes("survica") ? "/logo.svg" : null,
    redirectUrl: resolvedSlug.includes("redirect")
      ? "https://survica.vercel.app"
      : null,
    questions: [
      {
        id: "q1",
        text: "How would you describe your overall experience in your own words?",
        hint: "Speak naturally and mention what shaped your impression most.",
        required: true,
      },
      {
        id: "q2",
        text: "What part of the experience felt strongest or most valuable to you?",
        hint: "A concrete example helps the team understand what to preserve.",
        required: false,
      },
      {
        id: "q3",
        text: "What should improve before your next interaction with us?",
        hint: "Share the change that would matter most from your perspective.",
        required: true,
      },
    ],
  };
}

export default function PublicSurveyPage() {
  const { slug } = useParams();
  const { showToast } = useToast();
  const survey = useMemo(() => buildPublicSurvey(slug), [slug]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [currentDurationMs, setCurrentDurationMs] = useState<number | null>(null);
  const [responses, setResponses] = useState<Array<RecordedResponse | null>>(
    () => Array.from({ length: survey.questions.length }, () => null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(REDIRECT_SECONDS);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const activePressRef = useRef<"mouse" | "touch" | null>(null);
  const ignoreMouseUntilRef = useRef(0);
  const isStartingRef = useRef(false);
  const isUnmountingRef = useRef(false);

  const currentQuestion = survey.questions[currentIndex];
  const isLastQuestion = currentIndex === survey.questions.length - 1;
  const progressPercent = Math.round(
    ((currentIndex + 1) / survey.questions.length) * 100,
  );
  const completedAnswersCount = responses.filter(
    (response) => response?.audioBlob,
  ).length;

  function revokeCurrentAudioUrl() {
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
  }

  function replaceCurrentAudioUrl(nextUrl: string | null) {
    revokeCurrentAudioUrl();
    currentAudioUrlRef.current = nextUrl;
    setCurrentAudioUrl(nextUrl);
  }

  function clearRecordingState() {
    replaceCurrentAudioUrl(null);
    setCurrentAudioBlob(null);
    setCurrentDurationMs(null);
    setRecordState("idle");
  }

  function stopStreamTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startRecording() {
    if (recordState === "recording" || isStartingRef.current) {
      return;
    }

    if (typeof window === "undefined" || !window.MediaRecorder) {
      showToast({
        title: "Recording unavailable",
        description: "This browser does not support in-browser audio recording.",
        variant: "error",
      });
      return;
    }

    isStartingRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      stopStreamTracks();
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      startTimeRef.current = performance.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const durationMs = Math.max(
          0,
          (performance.now() - (startTimeRef.current ?? performance.now())),
        );
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });

        stopStreamTracks();
        mediaRecorderRef.current = null;
        startTimeRef.current = null;

        if (isUnmountingRef.current) {
          return;
        }

        if (durationMs < MIN_RECORDING_MS || audioBlob.size === 0) {
          clearRecordingState();
          showToast({
            title: "Recording too short",
            description: "Hold to record for at least one second before releasing.",
            variant: "warning",
          });
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        replaceCurrentAudioUrl(audioUrl);
        setCurrentAudioBlob(audioBlob);
        setCurrentDurationMs(durationMs);
        setRecordState("recorded");
      };

      clearRecordingState();
      recorder.start();
      setRecordState("recording");
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Microphone access was blocked. Allow access and try again."
          : "We could not start recording. Check microphone access and try again.";

      stopStreamTracks();
      mediaRecorderRef.current = null;
      startTimeRef.current = null;
      activePressRef.current = null;

      showToast({
        title: "Unable to record",
        description: message,
        variant: "error",
      });
    } finally {
      isStartingRef.current = false;
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      return;
    }

    recorder.stop();
  }

  function handleMouseDown(event: ReactMouseEvent<HTMLButtonElement>) {
    if (event.button !== 0 || Date.now() < ignoreMouseUntilRef.current) {
      return;
    }

    event.preventDefault();
    activePressRef.current = "mouse";
    void startRecording();
  }

  function handleTouchStart(event: ReactTouchEvent<HTMLButtonElement>) {
    event.preventDefault();
    ignoreMouseUntilRef.current = Date.now() + 800;
    activePressRef.current = "touch";
    void startRecording();
  }

  useEffect(() => {
    function handleMouseUp() {
      if (activePressRef.current === "mouse") {
        activePressRef.current = null;
        stopRecording();
      }
    }

    function handleTouchEnd() {
      if (activePressRef.current === "touch") {
        activePressRef.current = null;
        stopRecording();
      }
    }

    function handleWindowBlur() {
      if (activePressRef.current) {
        activePressRef.current = null;
        stopRecording();
      }
    }

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  useEffect(() => {
    if (!submitted || !survey.redirectUrl) {
      return undefined;
    }

    const redirectUrl = survey.redirectUrl;
    setRedirectCountdown(REDIRECT_SECONDS);

    const interval = window.setInterval(() => {
      setRedirectCountdown((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          window.location.assign(redirectUrl);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [submitted, survey.redirectUrl]);

  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
      activePressRef.current = null;
      stopRecording();
      stopStreamTracks();
      revokeCurrentAudioUrl();
    };
  }, []);

  function persistCurrentResponse(skipped: boolean) {
    const nextResponse: RecordedResponse = {
      questionId: currentQuestion.id,
      audioBlob: skipped ? null : currentAudioBlob,
      durationMs: skipped ? null : currentDurationMs,
      skipped,
    };

    setResponses((current) => {
      const next = [...current];
      next[currentIndex] = nextResponse;
      return next;
    });
  }

  function moveToNextQuestion() {
    persistCurrentResponse(false);
    clearRecordingState();
    setCurrentIndex((value) => value + 1);
  }

  function handleSkip() {
    if (recordState === "recording") {
      showToast({
        title: "Finish recording first",
        description: "Release to stop recording before you move on.",
        variant: "warning",
      });
      return;
    }

    if (recordState === "recorded") {
      showToast({
        title: "Recording ready",
        description: "Use Next to keep this response, or record again if you want to replace it.",
        variant: "info",
      });
      return;
    }

    if (currentQuestion.required) {
      showToast({
        title: "Response required",
        description: "This question needs a voice response before you continue.",
        variant: "warning",
      });
      return;
    }

    persistCurrentResponse(true);

    if (isLastQuestion) {
      setSubmitted(true);
      return;
    }

    clearRecordingState();
    setCurrentIndex((value) => value + 1);
  }

  function handleNext() {
    if (recordState === "recording") {
      showToast({
        title: "Still recording",
        description: "Release to stop recording before you continue.",
        variant: "warning",
      });
      return;
    }

    if (recordState !== "recorded") {
      if (currentQuestion.required) {
        showToast({
          title: "Response required",
          description: "Hold to record your answer before moving on.",
          variant: "warning",
        });
        return;
      }

      persistCurrentResponse(true);

      if (isLastQuestion) {
        setSubmitted(true);
        return;
      }

      clearRecordingState();
      setCurrentIndex((value) => value + 1);
      return;
    }

    if (isLastQuestion) {
      persistCurrentResponse(false);
      setSubmitted(true);
      clearRecordingState();
      return;
    }

    moveToNextQuestion();
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-surface-page px-4 py-6 md:flex md:items-center md:justify-center md:p-8">
        <div className="w-full max-w-[480px] rounded-[24px] border border-border bg-surface-card shadow-lg">
          <div className="flex flex-col items-center px-6 py-10 text-center md:px-8 md:py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue-light text-sm font-medium text-brand-blue">
              {survey.logoSrc ? (
                <img src={survey.logoSrc} alt={survey.companyName} className="h-8 w-auto object-contain" />
              ) : (
                getInitials(survey.companyName)
              )}
            </div>
            <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10 text-status-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-[20px] font-medium text-text-primary">
              Thank you!
            </h1>
            <p className="mt-2 max-w-sm text-sm text-text-secondary">
              Your response has been submitted.
            </p>
            <p className="mt-3 text-xs text-text-hint">
              You answered {completedAnswersCount} of {survey.questions.length} question
              {survey.questions.length === 1 ? "" : "s"}.
            </p>
            <p className="mt-6 text-xs text-text-hint">{survey.companyName}</p>
            {survey.redirectUrl ? (
              <div className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-secondary">
                Redirecting in {redirectCountdown} second
                {redirectCountdown === 1 ? "" : "s"}.
              </div>
            ) : null}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-page px-0 md:flex md:items-center md:justify-center md:bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_55%,#eef4ff_100%)] md:p-6">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col bg-surface-card md:min-h-[760px] md:overflow-hidden md:rounded-[28px] md:border md:border-border md:shadow-lg">
        <header className="border-b border-border bg-surface-card px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light text-sm font-medium text-brand-blue">
              {survey.logoSrc ? (
                <img src={survey.logoSrc} alt={survey.companyName} className="h-7 w-auto object-contain" />
              ) : (
                getInitials(survey.companyName)
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {survey.companyName}
              </p>
              <p className="truncate text-xs text-text-hint">{survey.surveyLabel}</p>
            </div>
          </div>
        </header>

        <div className="border-b border-border px-5 py-3 md:px-6">
          <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
            <span>
              Question {currentIndex + 1} of {survey.questions.length}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1 rounded-full bg-surface-muted">
            <div
              className="h-1 rounded-full bg-brand-blue transition-[width] duration-300 ease-in-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <section className="flex-1 px-5 py-6 md:px-6 md:py-7">
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {currentQuestion.required ? <Badge variant="pending">Required</Badge> : null}
              </div>
              <h1 className="text-[18px] font-medium leading-[1.4] text-text-primary">
                {currentQuestion.text}
              </h1>
              <p className="text-[13px] leading-[1.7] text-text-secondary">
                {currentQuestion.hint}
              </p>
            </div>

            <div className="rounded-[20px] border border-border bg-surface-muted px-5 py-8 text-center">
              {recordState === "recorded" ? (
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10 text-status-success">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-text-primary">
                      Response recorded
                    </p>
                    <p className="text-sm text-text-secondary">
                      {currentDurationMs ? formatDuration(currentDurationMs) : "Voice answer"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-card px-3 py-3">
                    <audio controls src={currentAudioUrl ?? undefined} className="w-full" />
                  </div>
                  <button
                    type="button"
                    onClick={clearRecordingState}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue transition-colors duration-150 hover:text-brand-blue-dark"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Record again
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <button
                    type="button"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className={cn(
                      "relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full text-white transition-colors duration-150",
                      recordState === "recording"
                        ? "bg-brand-orange-dark"
                        : "bg-brand-orange hover:bg-brand-orange-dark",
                    )}
                    aria-label="Hold to record your answer"
                  >
                    {recordState === "recording" ? (
                      <>
                        <span className="absolute inset-0 rounded-full bg-brand-orange/20 animate-ping" />
                        <span className="absolute -inset-3 rounded-full border border-brand-orange/30" />
                      </>
                    ) : null}
                    <Mic className="relative z-10 h-7 w-7" />
                  </button>

                  <div className="space-y-2">
                    <p className="text-base font-medium text-text-primary">
                      {recordState === "recording"
                        ? "Recording… release to stop"
                        : "Tap and hold to record"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {recordState === "recording"
                        ? "Keep holding while you speak your answer."
                        : "No typing required. Speak naturally in your own words."}
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border bg-surface-card px-3 py-3">
                    {recordState === "recording" ? (
                      <div className="flex h-8 items-center justify-center gap-1">
                        {Array.from({ length: 16 }, (_, index) => (
                          <span
                            key={index}
                            className={cn(
                              "w-1 rounded-full bg-brand-orange transition-all duration-150",
                              index % 3 === 0
                                ? "h-6"
                                : index % 2 === 0
                                  ? "h-4"
                                  : "h-3",
                            )}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-hint">
                        Your recorded answer will appear here once you release.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="sticky bottom-0 mt-auto border-t border-border bg-surface-card px-5 py-3 md:px-6">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="w-full"
              leadingIcon={<SkipForward className="h-4 w-4" />}
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              variant={isLastQuestion ? "gradient" : "primary"}
              className="w-full"
              trailingIcon={<ChevronRight className="h-4 w-4" />}
              onClick={handleNext}
            >
              {isLastQuestion ? "Submit" : "Next"}
            </Button>
          </div>
        </footer>
      </div>
    </main>
  );
}
