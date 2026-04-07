import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMicrophoneAlt, FaArrowRight } from "react-icons/fa";
import { getPublicSurveyById, getPublicSurveyQuestions } from "../lib/surveys";

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

export default function RespondSurvey() {
  const { surveyId, respondentId } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert("Survey flow complete. Next step is audio recording + submission.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading survey questions...</p>
      </div>
    );
  }

  if (!survey || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            No questions available
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            This survey does not have any published questions yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">{survey.title}</p>
              <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                Question {currentIndex + 1} of {questions.length}
              </h1>
            </div>

            <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              Respondent ID: {respondentId?.slice(0, 8)}
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
              <FaMicrophoneAlt className="h-5 w-5 text-rose-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Voice Question
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-relaxed text-gray-900">
                {currentQuestion.prompt}
              </h2>

              <p className="mt-4 text-sm text-gray-500">
                Max duration: {currentQuestion.max_duration_seconds || 0}{" "}
                seconds
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">
              Audio recorder goes here next
            </p>
            <p className="mt-2 text-sm text-gray-500">
              In the next step, we’ll add record, replay, re-record, and upload.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
            >
              <FaArrowRight className="h-4 w-4" />
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
