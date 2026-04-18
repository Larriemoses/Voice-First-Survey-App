import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AudioWaveform,
  ArrowRight,
  Clock3,
  Globe2,
  Mic,
  UserRound,
} from "lucide-react";
import { getPublicSurveyById, getPublicSurveyQuestions } from "../lib/surveys";
import { createRespondent } from "../lib/respondents";
import PageMeta from "../components/PageMeta";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import {
  BRAND_SHARE_IMAGE_URL,
  DEFAULT_PUBLIC_SURVEY_DESCRIPTION,
} from "../lib/branding";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  logo_url?: string | null;
  header_text?: string | null;
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
          setError("That survey link looks incomplete.");
          return;
        }

        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        if (!surveyData) {
          setError("This survey isn't available right now.");
          return;
        }

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (err) {
        console.error("Public survey load error:", err);
        setError("We couldn't load this survey right now.");
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
      setError("Add your full name so we can connect your answers correctly.");
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
      setError(err instanceof Error ? err.message : "We couldn't start your survey.");
    } finally {
      setStarting(false);
    }
  }

  const avgDuration = useMemo(() => {
    if (questions.length === 0) return 60;
    const total = questions.reduce(
      (sum, question) => sum + (question.max_duration_seconds || 0),
      0,
    );
    return Math.round(total / questions.length) || 60;
  }, [questions]);
  const organizationName = useMemo(() => {
    const organization = survey?.organization;

    if (!organization) return "";

    if (Array.isArray(organization)) {
      return organization[0]?.name?.trim() || "";
    }

    return organization.name?.trim() || "";
  }, [survey]);

  if (loading) {
    return (
      <>
        <PageMeta title="Loading Survey | Survica" description="Loading your survey" />
        <div className="min-h-screen px-4 py-8">
          <div className="mx-auto max-w-3xl space-y-4">
            <Card className="space-y-4">
              <Skeleton className="h-10 w-36 rounded-full" />
              <Skeleton className="h-12 w-4/5 rounded-[20px]" />
              <Skeleton className="h-24 rounded-[24px]" />
            </Card>
            <Card className="space-y-4">
              <Skeleton className="h-12 rounded-[20px]" />
              <Skeleton className="h-12 rounded-[20px]" />
              <Skeleton className="h-12 rounded-[20px]" />
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (error && !survey) {
    return (
      <>
        <PageMeta
          title="Survey Unavailable | Survica"
          description="This survey could not be loaded"
        />
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg">
            <Feedback
              variant="error"
              title="This survey isn't available"
              description={error}
            />
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={
          organizationName
            ? `${survey?.title || "Survey"} | ${organizationName}`
            : `${survey?.title || "Survey"} | Survica`
        }
        description={
          survey?.header_text ||
          survey?.description ||
          DEFAULT_PUBLIC_SURVEY_DESCRIPTION
        }
        image={survey?.logo_url || BRAND_SHARE_IMAGE_URL}
        imageAlt={survey?.title || "Survica survey"}
      />

      <div className="min-h-screen px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card className="space-y-5">
            {survey?.logo_url ? (
              <div className="flex justify-center">
                <img
                  src={survey.logo_url}
                  alt={survey.title}
                  className="h-14 w-auto max-w-[15rem] object-contain"
                />
              </div>
            ) : null}

            <div className="space-y-3 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {organizationName ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
                    <AudioWaveform className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    From {organizationName}
                  </div>
                ) : null}
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
                  <Mic className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  Voice survey
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-[var(--color-text)]">
                {survey?.header_text || "We'd love to hear your response"}
              </h1>
              <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                {survey?.description ||
                  "You'll answer each question in your own voice. There's no long form to fight with."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card variant="flat" className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Questions
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text)]">
                  {questions.length}
                </p>
              </Card>
              <Card variant="flat" className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Format
                </p>
                <p className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
                  <AudioWaveform className="h-4 w-4 text-[var(--color-primary)]" />
                  Voice
                </p>
              </Card>
              <Card variant="flat" className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Avg time
                </p>
                <p className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
                  <Clock3 className="h-4 w-4 text-[var(--color-info)]" />
                  {avgDuration}s
                </p>
              </Card>
            </div>

            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
              <Globe2 className="h-3.5 w-3.5 text-[var(--color-info)]" />
              You can answer naturally in the language that feels right to you
            </div>
          </Card>

          <Card>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-text)]">
                Before you begin
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Add your details so your responses stay linked correctly
              </p>
            </div>

            <form onSubmit={handleStartSurvey} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ada Lovelace"
                  leadingIcon={<UserRound className="h-4 w-4" />}
                  containerClassName="sm:col-span-2"
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />

                <Input
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                />
              </div>

              {error ? (
                <Feedback variant="error" title="We couldn't start your survey" description={error} />
              ) : null}

              <Button
                type="submit"
                loading={starting}
                size="lg"
                className="w-full sm:w-auto"
                trailingIcon={!starting ? <ArrowRight className="h-4 w-4" /> : undefined}
              >
                {starting ? "Starting your survey" : "Start survey"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
