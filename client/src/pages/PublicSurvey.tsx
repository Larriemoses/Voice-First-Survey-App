import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Clock3, Mic, UserRound } from "lucide-react";
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
          setError("This survey link is incomplete.");
          return;
        }

        const [surveyData, questionData] = await Promise.all([
          getPublicSurveyById(surveyId),
          getPublicSurveyQuestions(surveyId),
        ]);

        if (!surveyData) {
          setError("This survey is no longer available.");
          return;
        }

        setSurvey(surveyData);
        setQuestions(questionData);
      } catch (loadError) {
        console.error("Public survey load error:", loadError);
        setError("We couldn't load this survey right now.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [surveyId]);

  const organizationName = useMemo(() => {
    const organization = survey?.organization;

    if (!organization) return "";
    if (Array.isArray(organization)) return organization[0]?.name?.trim() || "";
    return organization.name?.trim() || "";
  }, [survey]);

  const estimatedMinutes = useMemo(() => {
    if (questions.length === 0) {
      return 1;
    }

    const totalSeconds = questions.reduce(
      (sum, question) => sum + (question.max_duration_seconds || 60),
      0,
    );

    return Math.max(1, Math.round(totalSeconds / 60));
  }, [questions]);

  async function handleStartSurvey(event: React.FormEvent) {
    event.preventDefault();

    if (!surveyId || !survey) {
      return;
    }

    if (!displayName.trim()) {
      setError("Add your name before you start.");
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
    } catch (startError) {
      console.error("Create respondent error:", startError);
      setError("We couldn't start this survey right now.");
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageMeta title="Loading Survey | Survica" description="Loading your survey" />
        <div className="min-h-screen px-4 py-8">
          <div className="mx-auto max-w-xl space-y-4">
            <Skeleton className="mx-auto h-7 w-28" />
            <Card className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-24 w-full" />
            </Card>
            <Card className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (!survey || error) {
    return (
      <>
        <PageMeta
          title="Survey Unavailable | Survica"
          description="This survey could not be loaded"
        />
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg">
            <Feedback
              variant="warning"
              title="This survey is no longer available"
              description={error || "The link may be closed, unpublished, or incorrect."}
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
            ? `${survey.title || "Survey"} | ${organizationName}`
            : `${survey.title || "Survey"} | Survica`
        }
        description={
          survey.header_text ||
          survey.description ||
          DEFAULT_PUBLIC_SURVEY_DESCRIPTION
        }
        image={survey.logo_url || BRAND_SHARE_IMAGE_URL}
        imageAlt={survey.title || "Survica survey"}
      />

      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-xl space-y-4">
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
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)]">
                <Mic className="h-3.5 w-3.5 text-[var(--accent)]" />
                Voice survey
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-[var(--text)] sm:text-3xl">
                  {survey.header_text || survey.title}
                </h1>
                <p className="text-sm leading-6 text-[var(--text-muted)]">
                  {survey.description ||
                    "Answer each question in your own voice. No long form required."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="p-4" variant="flat">
                <p className="text-xs text-[var(--text-muted)]">Questions</p>
                <p className="mt-1 text-xl font-semibold text-[var(--text)]">
                  {questions.length}
                </p>
              </Card>
              <Card className="p-4" variant="flat">
                <p className="text-xs text-[var(--text-muted)]">Format</p>
                <p className="mt-1 text-xl font-semibold text-[var(--text)]">Voice</p>
              </Card>
              <Card className="p-4" variant="flat">
                <p className="text-xs text-[var(--text-muted)]">Estimated time</p>
                <p className="mt-1 inline-flex items-center gap-2 text-xl font-semibold text-[var(--text)]">
                  <Clock3 className="h-4 w-4 text-[var(--accent)]" />
                  {estimatedMinutes} min
                </p>
              </Card>
            </div>

            {organizationName ? (
              <p className="text-center text-sm text-[var(--text-muted)]">
                Sent by {organizationName}
              </p>
            ) : null}
          </Card>

          {questions.length === 0 ? (
            <Card>
              <Feedback
                variant="warning"
                title="This survey isn't ready yet"
                description="The survey is published, but it doesn't have any public questions available."
              />
            </Card>
          ) : (
            <Card>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  Before you begin
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Add your details so your answers stay attached to the right person.
                </p>
              </div>

              <form onSubmit={handleStartSurvey} className="mt-5 space-y-4">
                <Input
                  label="Full name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="e.g. Ada Lovelace"
                  leadingIcon={<UserRound className="h-4 w-4" />}
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+234 800 000 0000"
                />

                {error ? (
                  <Feedback
                    variant="error"
                    title="Survey not started"
                    description={error}
                  />
                ) : null}

                <Button
                  type="submit"
                  loading={starting}
                  className="w-full"
                  trailingIcon={!starting ? <ArrowRight className="h-4 w-4" /> : undefined}
                >
                  {starting ? "Starting survey" : "Start survey"}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
