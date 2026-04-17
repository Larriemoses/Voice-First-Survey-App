import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock3, Mic } from "lucide-react";
import AudioRecorder from "../components/AudioRecorder";
import PageMeta from "../components/PageMeta";
import { getPublicSurveyById, getPublicSurveyQuestions } from "../lib/surveys";
import { uploadSurveyResponse } from "../lib/responses";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Feedback } from "../components/ui/Feedback";
import { Skeleton } from "../components/ui/Skeleton";
import { BRAND_SHARE_IMAGE_URL } from "../lib/branding";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  logo_url?: string | null;
};

type Question = {
  id: string;
  prompt: string;
  order_index: number;
  max_duration_seconds: number | null;
};

type RecordedAnswer = {
  blob: Blob;
  audioUrl: string;
  duration: number;
};

export default function RespondSurvey() {
  const { surveyId, respondentId } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, RecordedAnswer>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!surveyId) return;

      try {
        setError("");
        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (error) {
        console.error("Respond survey load error:", error);
        setError("We couldn't load this survey right now.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [surveyId]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const canProceed = !!currentAnswer;
  const answeredCount = useMemo(
    () => questions.filter((question) => !!answers[question.id]).length,
    [answers, questions],
  );
  const progressPercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    return ((currentIndex + 1) / questions.length) * 100;
  }, [currentIndex, questions.length]);

  function handleRecorded(
    audioBlob: Blob | null,
    audioUrl: string | null,
    duration: number,
  ) {
    if (!currentQuestion) return;

    setError("");

    if (!audioBlob || !audioUrl) {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[currentQuestion.id];
        return next;
      });
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        blob: audioBlob,
        audioUrl,
        duration,
      },
    }));
  }

  async function handleNext() {
    if (!currentQuestion || !surveyId || !respondentId) return;

    const answer = answers[currentQuestion.id];
    if (!answer) return;

    try {
      setSaving(true);
      setError("");

      await uploadSurveyResponse({
        surveyId,
        respondentId,
        questionId: currentQuestion.id,
        audioBlob: answer.blob,
        durationSeconds: answer.duration,
      });

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        navigate(`/take-survey/${surveyId}/thank-you`);
      }
    } catch (error) {
      console.error("Upload response error:", error);
      setError("We couldn't save that answer yet. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrevious() {
    if (saving) return;

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setError("");
    }
  }

  if (loading) {
    return (
      <>
        <PageMeta title="Loading Survey | Survica" description="Loading your survey questions" />
        <div className="min-h-screen px-4 py-6">
          <div className="mx-auto max-w-4xl space-y-4">
            <Card className="space-y-4">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-12 w-4/5 rounded-[20px]" />
            </Card>
            <Card className="space-y-4">
              <Skeleton className="h-56 rounded-[28px]" />
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (!survey || questions.length === 0 || !currentQuestion) {
    return (
      <>
        <PageMeta
          title="Survey Unavailable | Survica"
          description="This survey does not have published questions yet"
        />
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg">
            <Feedback
              variant="error"
              title="This survey isn't ready just yet"
              description={
                error ||
                "There aren't any published questions here yet. You can come back once the survey is live."
              }
            />
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${survey.title || "Survey"} | Survica`}
        description="Respond to this survey in your own voice"
        image={survey.logo_url || BRAND_SHARE_IMAGE_URL}
        imageAlt={survey.title || "Survica survey"}
      />

      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card className="space-y-5">
            {survey.logo_url ? (
              <div className="flex justify-center">
                <img
                  src={survey.logo_url}
                  alt={survey.title}
                  className="h-14 w-auto max-w-[15rem] object-contain"
                />
              </div>
            ) : null}

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
                <Mic className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                Voice response
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  <span>Progress</span>
                  <span>{answeredCount} recorded</span>
                </div>
                <div className="relative overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-info)] transition-[width] duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                  <div className="relative flex h-8 items-center justify-center text-xs font-semibold tracking-[0.08em] text-[var(--color-text)]">
                    Q{currentIndex + 1} / Q{questions.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                {survey.title}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-[var(--color-text)]">
                {currentQuestion.prompt}
              </h1>
              <p className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Clock3 className="h-4 w-4" />
                Aim to keep this answer within {currentQuestion.max_duration_seconds || 120} seconds
              </p>
            </div>
          </Card>

          <AudioRecorder
            key={currentQuestion.id}
            maxDurationSeconds={currentQuestion.max_duration_seconds || 120}
            onRecorded={handleRecorded}
          />

          {canProceed ? (
            <Feedback
              variant="success"
              title="Your answer is recorded"
              description="Listen back if you want, or move to the next question."
            />
          ) : (
            <Feedback
              variant="info"
              title="Record your answer when you're ready"
              description="You can re-record before moving forward."
            />
          )}

          {error ? (
            <Feedback variant="error" title="Your answer wasn't saved" description={error} />
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0 || saving}
              disabledReason="You're already on the first question"
              variant="secondary"
              size="lg"
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed || saving}
              disabledReason="Record this answer before moving on"
              size="lg"
              trailingIcon={!saving ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {saving
                ? "Saving your answer"
                : currentIndex < questions.length - 1
                  ? "Next question"
                  : "Finish survey"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
