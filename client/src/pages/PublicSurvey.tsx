import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowRight,
  FaGlobe,
  FaMicrophoneAlt,
  FaRegClock,
  FaWaveSquare,
} from "react-icons/fa";
import { getPublicSurveyById, getPublicSurveyQuestions } from "../lib/surveys";
import { createRespondent } from "../lib/respondents";

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
          setError("Your survey link looks invalid — try opening it again");
          return;
        }

        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        if (!surveyData) {
          setError("This survey isn’t available right now");
          return;
        }

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (err) {
        console.error("Public survey load error:", err);
        setError("We couldn’t load this survey — please refresh and try again");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [surveyId]);

  async function handleStartSurvey(e: React.FormEvent) {
    e.preventDefault();

    if (!surveyId || !survey) return;

    if (!displayName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setStarting(true);
      setError("");

      const respondent = await createRespondent({
        survey_id: surveyId,
        display_name: displayName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      navigate(`/take-survey/${surveyId}/respond/${respondent.id}`);
    } catch (err) {
      console.error("Create respondent error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "We couldn’t start the survey — please try again",
      );
    } finally {
      setStarting(false);
    }
  }

  const avgDuration = useMemo(() => {
    if (questions.length === 0) return 0;
    const total = questions.reduce(
      (sum, q) => sum + (q.max_duration_seconds || 0),
      0,
    );
    return Math.round(total / questions.length);
  }, [questions]);

  if (loading) {
    return (
      <>
        <PageMeta title="Survey" description="Loading survey..." />
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Loading survey...</p>
          </div>
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
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">
              Survey unavailable
            </h1>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={survey?.title || "Survey"}
        description={survey?.description || "You’ve been invited to share feedback"}
      />

      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5">
          {/* Top / Hero */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-5 sm:p-6">
              {survey?.logo_url ? (
                <div className="mb-4">
                  <img
                    src={survey.logo_url}
                    alt={survey.title}
                    className="h-10 w-auto max-w-[140px] object-contain"
                  />
                </div>
              ) : null}

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <FaMicrophoneAlt className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {survey?.title || "Voice Survey"}
                  </p>

                  <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    {survey?.header_text || "We'd love to hear your response"}
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {survey?.description ||
                      "Please answer the following questions by voice."}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Questions
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {questions.length}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Format
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-slate-900">
                    <FaWaveSquare className="h-3.5 w-3.5 text-indigo-600" />
                    Voice
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Avg Duration
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-slate-900">
                    <FaRegClock className="h-3.5 w-3.5 text-cyan-600" />
                    {avgDuration || 60}s
                  </p>
                </div>
              </div>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                <FaGlobe className="h-3 w-3 text-cyan-600" />
                Multi-language support
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Before you begin
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Enter your details to start this survey.
              </p>
            </div>
          </Card>

            <form onSubmit={handleStartSurvey} className="mt-4 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Full name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500"
                    placeholder="+234..."
                    autoComplete="tel"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={starting || !survey}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaArrowRight className="h-4 w-4" />
                {starting ? "Starting..." : "Start Survey"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
