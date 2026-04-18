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
  organization?:
    | {
        name?: string | null;
      }
    | Array<{
        name?: string | null;
      }>
    | null;
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
      if (!surveyId) {
        setLoading(false);
        setError("This survey link is incomplete.");
        return;
      }

      try {
        setError("");
        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (loadError) {
        console.error("Respond survey load error:", loadError);
        setError("We couldn't load this survey right now.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [surveyId]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const progressPercentage = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }

    return ((currentIndex + 1) / questions.length) * 100;
  }, [currentIndex, questions.length]);

  function handleRecorded(
    audioBlob: Blob | null,
    audioUrl: string | null,
    duration: number,
  ) {
    if (!currentQuestion) {
      return;
    }

    setError("");

    if (!audioBlob || !audioUrl) {
      setAnswers((current) => {
        const next = { ...current };
        delete next[currentQuestion.id];
        return next;
      });
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: {
        blob: audioBlob,
        audioUrl,
        duration,
      },
    }));
  }

  async function handleNext() {
    if (!surveyId || !respondentId || !currentQuestion || !currentAnswer) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await uploadSurveyResponse({
        surveyId,
        respondentId,
        questionId: currentQuestion.id,
        audioBlob: currentAnswer.blob,
        durationSeconds: currentAnswer.duration,
      });

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((index) => index + 1);
      } else {
        navigate(`/take-survey/${surveyId}/thank-you`);
      }
    } catch (saveError) {
      console.error("Upload response error:", saveError);
      setError("We couldn't save that answer yet. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageMeta title="Loading Survey | Survica" description="Loading your survey questions" />
        <div className="min-h-screen px-4 py-8">
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="mx-auto h-7 w-28" />
            <Card className="space-y-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-full" />
            </Card>
            <Card className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (!survey || questions.length === 0 || !currentQuestion || error === "This survey link is incomplete.") {
    return (
      <>
        <PageMeta
          title="Survey Unavailable | Survica"
          description="This survey does not have published questions yet"
        />
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg">
            <Feedback
              variant="warning"
              title="This survey is no longer available"
              description={
                error ||
                "There aren't any published questions here right now."
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

      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {survey.logo_url ? (
            <div className="mx-auto h-7 w-fit">
              <img
                src={survey.logo_url}
                alt={survey.title}
                className="h-full w-auto object-contain"
              />
            </div>
          ) : null}

          <Card className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)]">
              <Mic className="h-3.5 w-3.5 text-[var(--accent)]" />
              Question {currentIndex + 1} of {questions.length}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-[var(--text-muted)]">{survey.title}</p>
              <h1 className="text-2xl font-semibold text-[var(--text)] sm:text-3xl">
                {currentQuestion.prompt}
              </h1>
              <p className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Clock3 className="h-4 w-4" />
                Aim to keep this answer within {currentQuestion.max_duration_seconds || 120} seconds
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-200"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </Card>

          <AudioRecorder
            key={currentQuestion.id}
            maxDurationSeconds={currentQuestion.max_duration_seconds || 120}
            onRecorded={handleRecorded}
          />

          {currentAnswer ? (
            <Feedback
              variant="success"
              title="Answer recorded"
              description="Listen back if you want, or move to the next question."
            />
          ) : (
            <Feedback
              variant="info"
              title="Record your answer when you're ready"
              description="You can re-record before moving on."
            />
          )}

          {error ? (
            <Feedback
              variant="error"
              title="Answer not saved"
              description={error}
            />
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0 || saving}
              disabledReason="You're already on the first question"
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentAnswer || saving}
              disabledReason="Record this answer before moving on"
              trailingIcon={!saving ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {saving
                ? "Saving answer"
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
