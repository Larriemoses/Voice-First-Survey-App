import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMicrophoneAlt, FaCheckCircle } from "react-icons/fa";
import AudioRecorder from "../components/AudioRecorder";
import PageMeta from "../components/PageMeta";
import { getPublicSurveyById, getPublicSurveyQuestions } from "../lib/surveys";
import { uploadSurveyResponse } from "../lib/responses";

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
        setError("Failed to load survey.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [surveyId]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const canProceed = !!currentAnswer;

  const progress = useMemo(() => {
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
      setError("Failed to save your response. Please try again.");
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
        <PageMeta title="Survey" description="Loading survey questions..." />

        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <p className="text-sm text-slate-500">Loading survey...</p>
        </div>
      </>
    );
  }

  if (!survey || questions.length === 0 || !currentQuestion) {
    return (
      <>
        <PageMeta
          title="Survey unavailable"
          description="This survey does not have any published questions yet."
        />

        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Survey unavailable
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This survey does not have any published questions yet.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={survey.title || "Survey"}
        description="Respond to this survey."
      />

      <div className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-28 pt-5 sm:px-6 sm:pb-32 sm:pt-6">
          {/* Top section */}
          <div className="space-y-4">
            {survey.logo_url ? (
              <div className="flex justify-center sm:justify-start">
                <img
                  src={survey.logo_url}
                  alt={survey.title}
                  className="h-10 w-auto object-contain"
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-400 sm:text-left">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#0B4EA2] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <p className="text-sm font-medium text-slate-500">
                {survey.title}
              </p>

              <h1 className="text-xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                {currentQuestion.prompt}
              </h1>

              <p className="text-sm text-slate-500">
                Max duration: {currentQuestion.max_duration_seconds || 120}{" "}
                seconds
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 items-center py-6 sm:py-8">
            <div className="w-full rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E7]">
                  <FaMicrophoneAlt className="h-5 w-5 text-[#F56A00]" />
                </div>
              </div>

              <AudioRecorder
                key={currentQuestion.id}
                maxDurationSeconds={currentQuestion.max_duration_seconds || 120}
                onRecorded={handleRecorded}
              />

              <div className="mt-4 flex justify-center">
                {canProceed ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
                    <FaCheckCircle className="h-4 w-4" />
                    Response recorded
                  </div>
                ) : (
                  <div className="inline-flex items-center rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
                    Record your answer to continue
                  </div>
                )}
              </div>

              {error ? (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0 || saving}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || saving}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#093E81] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : currentIndex < questions.length - 1
                  ? "Next"
                  : "Finish Survey"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
