import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMicrophoneAlt, FaArrowRight } from "react-icons/fa";
import { getPublicSurveyById, getPublicSurveyQuestions } from "../lib/surveys";
import { createRespondent } from "../lib/respondents";

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

export default function PublicSurvey() {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

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
      } catch (err) {
        console.error("Public survey load error:", err);
        setError("Survey not found or not available.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [surveyId]);

  async function handleStartSurvey(e: React.FormEvent) {
    e.preventDefault();
    if (!surveyId) return;

    try {
      setStarting(true);
      const respondent = await createRespondent({
        survey_id: surveyId,
        display_name: displayName,
        email,
        phone,
      });

      navigate(`/take-survey/${surveyId}/respond/${respondent.id}`);
    } catch (err) {
      console.error("Create respondent error:", err);
      setError(err instanceof Error ? err.message : "Failed to start survey.");
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading survey...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
              <FaMicrophoneAlt className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {survey?.title || "Voice Survey"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {survey?.description ||
                  "Please answer the following questions by voice."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl bg-gray-50 p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Questions</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {questions.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Format</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                Voice responses
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Before you begin
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter a few details so your responses can be linked correctly.
          </p>

          <form onSubmit={handleStartSurvey} className="mt-6 grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="+234..."
              />
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={starting}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
            >
              <FaArrowRight className="h-4 w-4" />
              {starting ? "Starting..." : "Start Survey"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
