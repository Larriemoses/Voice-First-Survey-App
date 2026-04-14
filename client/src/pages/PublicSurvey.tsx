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
          setError("Invalid survey link.");
          return;
        }

        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        if (!surveyData) {
          setError("Survey not found.");
          return;
        }

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (err) {
        console.error(err);
        setError("Failed to load survey.");
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
      console.error(err);
      setError("Failed to start survey.");
    } finally {
      setStarting(false);
    }
  }

  // =========================
  // STATES
  // =========================

  if (loading) {
    return (
      <>
        <PageMeta title="Survey" description="Loading survey..." />
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </>
    );
  }

  if (error && !survey) {
    return (
      <>
        <PageMeta title="Survey unavailable" />
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <div className="w-full max-w-md rounded-2xl border p-6 text-center">
            <h1 className="text-lg font-semibold text-slate-900">
              Survey unavailable
            </h1>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={survey?.title || "Survey"}
        description={survey?.description || ""}
      />

      <div className="min-h-screen bg-white px-4 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-xl space-y-5">
          {/* HEADER */}
          <div className="rounded-2xl border p-5 sm:p-6">
            {survey?.logo_url && (
              <img
                src={survey.logo_url}
                alt=""
                className="mb-4 h-10 object-contain"
              />
            )}

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FF]">
                <FaMicrophoneAlt className="text-[#0B4EA2]" />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  {survey?.header_text || "Share your response"}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {survey?.description ||
                    "Answer a few questions using your voice."}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
              <span>{questions.length} questions</span>
              <span>Voice</span>
              <span className="flex items-center gap-1">
                <FaGlobe className="text-[#F56A00]" />
                Any language
              </span>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-2xl border p-5 sm:p-6">
            <form onSubmit={handleStartSurvey} className="space-y-4">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border px-3 py-3 text-sm outline-none focus:border-[#0B4EA2]"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full rounded-lg border px-3 py-3 text-sm outline-none focus:border-[#0B4EA2]"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full rounded-lg border px-3 py-3 text-sm outline-none focus:border-[#0B4EA2]"
              />

              {error && <div className="text-sm text-red-500">{error}</div>}

              <button
                type="submit"
                disabled={starting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B4EA2] py-3 text-sm font-medium text-white hover:bg-[#093E81] disabled:opacity-60"
              >
                <FaArrowRight />
                {starting ? "Starting..." : "Start"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
