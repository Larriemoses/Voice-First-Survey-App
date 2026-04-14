import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMicrophoneAlt, FaArrowRight, FaGlobe } from "react-icons/fa";
import { getPublicSurveyById, getPublicSurveyQuestions } from "../lib/surveys";
import { createRespondent } from "../lib/respondents";
import PageMeta from "../components/PageMeta";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  logo_url?: string | null;
  header_text?: string | null;
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
      try {
        setLoading(true);
        setError("");

        if (!surveyId) {
          setError("Survey link is invalid.");
          return;
        }

        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        if (!surveyData) {
          setError("Survey not found or not available.");
          return;
        }

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (err) {
        console.error("Public survey load error:", err);
        setError("Failed to load this survey.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [surveyId]);

  async function handleStartSurvey(e: React.FormEvent) {
    e.preventDefault();

    if (!surveyId || !survey) return;

    try {
      setStarting(true);
      setError("");

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
      <>
        <PageMeta title="Survey" description="Loading survey..." />
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <p className="text-sm text-slate-500">Loading survey...</p>
        </div>
      </>
    );
  }

  if (error && !survey) {
    return (
      <>
        <PageMeta
          title="Survey unavailable"
          description="This survey could not be loaded."
        />
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">
              Survey unavailable
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={survey?.title || "Survey"}
        description={
          survey?.description ||
          "You have been invited to respond to this survey."
        }
      />

      <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-slate-50 via-white to-[#EAF2FF]/40 px-5 py-6 sm:px-6 sm:py-7">
              {survey?.logo_url ? (
                <div className="mb-4 flex justify-center sm:justify-start">
                  <img
                    src={survey.logo_url}
                    alt={survey.title}
                    className="h-10 w-auto max-w-[140px] object-contain"
                  />
                </div>
              ) : null}

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2FF]">
                  <FaMicrophoneAlt className="h-5 w-5 text-[#0B4EA2]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {survey?.title || "Voice Survey"}
                  </p>

                  <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    {survey?.header_text || "We’d love to hear your response"}
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {survey?.description ||
                      "Please answer the following questions by voice."}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 rounded-2xl bg-white/80 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Questions
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {questions.length}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Format
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    Voice
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Language
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <FaGlobe className="h-3.5 w-3.5 text-[#F56A00]" />
                    Any language
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-900">
                Before you begin
              </h2>
              <p className="text-sm leading-6 text-slate-500">
                Enter a few details so your responses can be linked correctly.
              </p>
            </div>

            <form onSubmit={handleStartSurvey} className="mt-5 grid gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0B4EA2]"
                  placeholder="+234..."
                />
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={starting || !survey}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0B4EA2] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#093E81] disabled:opacity-60"
                >
                  <FaArrowRight className="h-4 w-4" />
                  {starting ? "Starting..." : "Start Survey"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
