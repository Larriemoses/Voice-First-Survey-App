import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function load() {
      if (!surveyId) return;

      try {
        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (error) {
        console.error("Respond survey load error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [surveyId]);

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  function handleRecorded(
    audioBlob: Blob | null,
    audioUrl: string | null,
    duration: number,
  ) {
    if (!currentQuestion) return;

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
      alert("Failed to save your response. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  if (loading) {
    return (
      <>
        <PageMeta title="Survey" description="Loading survey questions..." />

        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">Loading survey questions...</p>
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

        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No questions available
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              This survey does not have any published questions yet.
            </p>
          </div>
        </div>
      </>
    );
  }

  const currentAnswer = answers[currentQuestion.id];
  const canProceed = !!currentAnswer;

  return (
    <>
      <PageMeta
        title={survey?.title || "Survey"}
        description="Respond to this survey."
      />

      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">{survey.title}</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Question {currentIndex + 1} of {questions.length}
                </h1>
              </div>

              <div className="rounded-xl bg-[#EAF2FF] px-4 py-2 text-sm font-medium text-[#0B4EA2]">
                Respondent ID: {respondentId?.slice(0, 8)}
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0B4EA2] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1E7]">
                <FaMicrophoneAlt className="h-5 w-5 text-[#F56A00]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Voice Question
                </p>
                <h2 className="mt-2 text-xl font-semibold leading-relaxed text-slate-900">
                  {currentQuestion.prompt}
                </h2>

                <p className="mt-4 text-sm text-slate-500">
                  Max duration: {currentQuestion.max_duration_seconds || 0}{" "}
                  seconds
                </p>
              </div>
            </div>

            <div className="mt-8">
              <AudioRecorder
                key={currentQuestion.id}
                maxDurationSeconds={currentQuestion.max_duration_seconds || 120}
                onRecorded={handleRecorded}
              />
            </div>

            <div className="mt-6">
              {canProceed ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  <FaCheckCircle className="h-4 w-4" />
                  Recording completed. You can continue.
                </div>
              ) : (
                <div className="inline-flex items-center rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  Record your answer before moving to the next question.
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0 || saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed || saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#093E81] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : currentIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Survey"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
