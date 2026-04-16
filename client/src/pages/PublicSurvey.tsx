import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowRight, FaGlobe, FaMicrophoneAlt, FaRegClock } from "react-icons/fa";
import PageMeta from "../components/PageMeta";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Feedback } from "../components/ui/feedback";
import { Input } from "../components/ui/input";
import { PageHeader } from "../components/ui/page-header";
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
      setError("Please enter your full name to continue");
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
      (sum, question) => sum + (question.max_duration_seconds || 0),
      0,
    );
    return Math.round(total / questions.length);
  }, [questions]);

  if (loading) {
    return (
      <>
        <PageMeta title="Survey" description="Loading your survey" />
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-md p-5">
            <p className="text-sm text-slate-600">Loading your survey…</p>
          </Card>
        </div>
      </>
    );
  }

  if (error && !survey) {
    return (
      <>
        <PageMeta title="Survey unavailable" description="This survey can’t be opened" />
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-md p-6">
            <h1 className="text-lg font-semibold text-slate-900">Survey unavailable</h1>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
          </Card>
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
          <Card className="overflow-hidden p-5 sm:p-6">
            {survey?.logo_url ? (
              <div className="mb-4">
                <img
                  src={survey.logo_url}
                  alt={survey.title}
                  className="h-10 w-auto max-w-[140px] object-contain"
                />
              </div>
            ) : null}

            <PageHeader
              title={survey?.header_text || "We’d love your voice feedback"}
              subtitle={survey?.description || "You’ll answer a few short voice questions"}
            />

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Questions</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{questions.length}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Format</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold text-slate-900">
                  <FaMicrophoneAlt className="h-3.5 w-3.5 text-indigo-600" />
                  Voice
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Typical length</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold text-slate-900">
                  <FaRegClock className="h-3.5 w-3.5 text-cyan-600" />
                  {avgDuration || 60}s
                </p>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <FaGlobe className="h-3 w-3 text-cyan-600" />
              You can respond in any language
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <PageHeader
              title="Let’s get you set up"
              subtitle="Add your details before you start"
            />

            <form onSubmit={handleStartSurvey} className="mt-4 grid gap-3">
              <Input
                label="Full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Ada Okoye"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                />
              </div>

              {error ? <Feedback tone="error" message={error} dismissible /> : null}

              <Button
                type="submit"
                loading={starting}
                disabled={!survey}
                leadingIcon={<FaArrowRight className="h-4 w-4" />}
                className="w-full"
              >
                {starting ? "Starting your survey…" : "Start survey"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
