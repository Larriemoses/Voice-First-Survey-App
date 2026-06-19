import { ArrowUpRight, Building2, Mic2, MoreHorizontal, Plus, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Badge, type BadgeVariant } from "../components/ui/Badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { EmptyState } from "../components/ui/EmptyState";
import { MetricCard } from "../components/ui/MetricCard";
import { Modal } from "../components/ui/Modal";
import { SkeletonBlock } from "../components/ui/SkeletonBlock";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { getMySurveys, type SurveyRecord, type SurveyStatus } from "../lib/surveys";
import { cn, formatRelativeDate, getFirstName } from "../utils/helpers";

type SurveyFilter = "All" | "Active" | "Draft" | "Closed";
type DisplaySurveyStatus = "active" | "draft" | "closed";

type DashboardResponseRow = {
  id: string;
  survey_id: string;
  respondent_id: string | null;
  created_at: string;
  transcript_status: string | null;
  transcript: string | null;
};

type DashboardQuestionRow = {
  id: string;
  survey_id: string;
};

type DashboardSurveyRow = {
  id: string;
  title: string;
  status: SurveyStatus;
  displayStatus: DisplaySurveyStatus;
  questionCount: number;
  respondentCount: number;
  answerCount: number;
  completedTranscriptCount: number;
  pendingTranscriptCount: number;
  lastActivityAt: string | null;
};

type DashboardMetrics = {
  totalResponses: number;
  activeSurveys: number;
  completionRate: number;
  pendingTranscripts: number;
};

const filters: SurveyFilter[] = ["All", "Active", "Draft", "Closed"];

function getGreeting(date: Date) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function mapSurveyStatus(status: SurveyStatus): DisplaySurveyStatus {
  if (status === "published") {
    return "active";
  }

  return status;
}

function getStatusVariant(status: DisplaySurveyStatus): BadgeVariant {
  if (status === "active") {
    return "active";
  }

  if (status === "draft") {
    return "draft";
  }

  return "closed";
}

function getStatusLabel(status: DisplaySurveyStatus) {
  if (status === "active") {
    return "Active";
  }

  if (status === "draft") {
    return "Draft";
  }

  return "Closed";
}

function buildSurveyRows(
  surveys: SurveyRecord[],
  responseRows: DashboardResponseRow[],
  questionRows: DashboardQuestionRow[],
) {
  const responseMap = new Map<string, DashboardResponseRow[]>();
  const questionCountMap = new Map<string, number>();

  responseRows.forEach((row) => {
    const current = responseMap.get(row.survey_id) ?? [];
    current.push(row);
    responseMap.set(row.survey_id, current);
  });

  questionRows.forEach((row) => {
    questionCountMap.set(row.survey_id, (questionCountMap.get(row.survey_id) ?? 0) + 1);
  });

  return surveys.map<DashboardSurveyRow>((survey) => {
    const surveyResponses = responseMap.get(survey.id) ?? [];
    const respondentIds = new Set(
      surveyResponses.map((row) => row.respondent_id ?? `anonymous-${row.id}`),
    );
    const completedTranscriptCount = surveyResponses.filter(
      (row) => row.transcript_status === "completed" || Boolean(row.transcript?.trim()),
    ).length;
    const pendingTranscriptCount = surveyResponses.filter(
      (row) => row.transcript_status !== "completed" && !row.transcript?.trim(),
    ).length;
    const latestResponseAt = surveyResponses.reduce<string | null>((latest, row) => {
      if (!latest || new Date(row.created_at).getTime() > new Date(latest).getTime()) {
        return row.created_at;
      }

      return latest;
    }, null);
    const baseUpdatedAt = survey.updated_at || survey.created_at || null;
    const lastActivityAt =
      latestResponseAt &&
      (!baseUpdatedAt ||
        new Date(latestResponseAt).getTime() > new Date(baseUpdatedAt).getTime())
        ? latestResponseAt
        : baseUpdatedAt;

    return {
      id: survey.id,
      title: survey.title,
      status: survey.status,
      displayStatus: mapSurveyStatus(survey.status),
      questionCount: questionCountMap.get(survey.id) ?? 0,
      respondentCount: respondentIds.size,
      answerCount: surveyResponses.length,
      completedTranscriptCount,
      pendingTranscriptCount,
      lastActivityAt,
    };
  });
}

function getMetrics(rows: DashboardSurveyRow[]): DashboardMetrics {
  const totalResponses = rows.reduce((sum, row) => sum + row.respondentCount, 0);
  const activeSurveys = rows.filter((row) => row.status === "published").length;
  const pendingTranscripts = rows.reduce(
    (sum, row) => sum + row.pendingTranscriptCount,
    0,
  );
  const answeredQuestions = rows.reduce((sum, row) => sum + row.answerCount, 0);
  const expectedAnswers = rows.reduce((sum, row) => {
    if (row.questionCount === 0 || row.respondentCount === 0) {
      return sum;
    }

    return sum + row.questionCount * row.respondentCount;
  }, 0);
  const completionRate =
    expectedAnswers > 0 ? Math.round((answeredQuestions / expectedAnswers) * 100) : 0;

  return {
    totalResponses,
    activeSurveys,
    completionRate,
    pendingTranscripts,
  };
}

function DashboardSkeleton() {
  return (
    <div className="survica-page-shell py-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-48" />
            <SkeletonBlock className="h-4 w-64" />
          </div>
          <SkeletonBlock className="h-[38px] w-32" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-md bg-surface-muted px-4 py-3.5">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-3 h-7 w-20" />
              <SkeletonBlock className="mt-3 h-3.5 w-24" />
            </div>
          ))}
        </div>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SkeletonBlock className="h-5 w-32" />
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <SkeletonBlock key={filter} className="h-7 w-16 rounded-full" />
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Card key={index} hoverable={false} className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-44" />
                    <SkeletonBlock className="h-4 w-36" />
                  </div>
                  <div className="space-y-2 sm:text-right">
                    <SkeletonBlock className="h-4 w-24 sm:ml-auto" />
                    <SkeletonBlock className="h-[38px] w-24 sm:ml-auto" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SurveyListRow({ survey }: { survey: DashboardSurveyRow }) {
  const navigate = useNavigate();
  const statusLabel = getStatusLabel(survey.displayStatus);
  const action =
    survey.status === "draft"
      ? {
          label: "Publish",
          variant: "primary" as const,
          onClick: () => navigate(`/dashboard/surveys/${survey.id}#share`),
        }
      : survey.status === "closed"
        ? {
            label: "View",
            variant: "secondary" as const,
            onClick: () => navigate(`/dashboard/surveys/${survey.id}/results`),
          }
        : {
            label: "View",
            variant: "secondary" as const,
            onClick: () => navigate(`/dashboard/surveys/${survey.id}`),
          };

  return (
    <article className={cn("group", survey.status === "closed" && "opacity-60")}>
      <button
        type="button"
        onClick={action.onClick}
        className={cn(
          "relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 text-left transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-sm",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <Badge variant={getStatusVariant(survey.displayStatus)}>{statusLabel}</Badge>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-text-primary opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <MoreHorizontal className="h-5 w-5" />
          </span>
        </div>

        <div className="py-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/75 text-brand-blue shadow-sm">
            <Mic2 className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-text-primary">
            {survey.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {survey.questionCount} questions · {survey.respondentCount} voice responses
          </p>
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary">
          {action.label} <ArrowUpRight className="h-4 w-4" />
        </span>
      </button>

      <div className="flex items-center justify-between gap-3 px-2 pt-3">
        <p className="truncate text-xs text-text-secondary">
          Updated {survey.lastActivityAt ? formatRelativeDate(survey.lastActivityAt) : "recently"}
        </p>
        {survey.status === "published" ? (
          <button
            type="button"
            onClick={() => navigate(`/dashboard/surveys/${survey.id}/analytics`)}
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-dark"
          >
            Insights
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, org } = useAuth();
  const [filter, setFilter] = useState<SurveyFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [surveyRows, setSurveyRows] = useState<DashboardSurveyRow[]>([]);
  const [setupPromptDismissed, setSetupPromptDismissed] = useState(() =>
    window.localStorage.getItem("survica-workspace-setup-later") === "true",
  );

  function handleCreateSurvey() {
    if (!org) {
      setSetupPromptDismissed(false);
      window.localStorage.removeItem("survica-workspace-setup-later");
      return;
    }

    navigate("/dashboard/surveys/new");
  }

  function handleSetupLater() {
    window.localStorage.setItem("survica-workspace-setup-later", "true");
    setSetupPromptDismissed(true);
  }

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const surveys = await getMySurveys();

        if (surveys.length === 0) {
          if (active) {
            setSurveyRows([]);
            setLoading(false);
          }
          return;
        }

        const surveyIds = surveys.map((survey) => survey.id);
        const [responsesResult, questionsResult] = await Promise.all([
          supabase
            .from("responses")
            .select("id, survey_id, respondent_id, created_at, transcript_status, transcript")
            .in("survey_id", surveyIds),
          supabase.from("questions").select("id, survey_id").in("survey_id", surveyIds),
        ]);

        if (responsesResult.error) {
          throw responsesResult.error;
        }

        if (questionsResult.error) {
          throw questionsResult.error;
        }

        if (!active) {
          return;
        }

        const rows = buildSurveyRows(
          surveys,
          (responsesResult.data ?? []) as DashboardResponseRow[],
          (questionsResult.data ?? []) as DashboardQuestionRow[],
        );

        setSurveyRows(rows);
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "We couldn't load your dashboard right now.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const greeting = useMemo(() => getGreeting(new Date()), []);
  const firstName = useMemo(
    () =>
      getFirstName(
        typeof user?.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : user?.email,
      ),
    [user?.email, user?.user_metadata],
  );

  const metrics = useMemo(() => getMetrics(surveyRows), [surveyRows]);
  const filteredRows = useMemo(() => {
    if (filter === "All") {
      return surveyRows;
    }

    if (filter === "Active") {
      return surveyRows.filter((row) => row.displayStatus === "active");
    }

    if (filter === "Draft") {
      return surveyRows.filter((row) => row.displayStatus === "draft");
    }

    return surveyRows.filter((row) => row.displayStatus === "closed");
  }, [filter, surveyRows]);

  const insightSurvey = useMemo(() => {
    return [...surveyRows]
      .filter((row) => row.completedTranscriptCount > 0)
      .sort((left, right) => {
        const leftTime = left.lastActivityAt ? new Date(left.lastActivityAt).getTime() : 0;
        const rightTime = right.lastActivityAt ? new Date(right.lastActivityAt).getTime() : 0;
        return rightTime - leftTime;
      })[0];
  }, [surveyRows]);

  return (
    <AppShell>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="survica-page-shell py-8 lg:py-10">
          <div className="space-y-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold text-brand-blue">Overview</p>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text-primary sm:text-4xl">
                  {greeting}, {firstName}
                </h1>
                <p className="mt-2 text-sm text-text-secondary sm:text-base">
                  Your audience is speaking. Here’s the clearest view of what they’re saying.
                </p>
              </div>
              <Button
                leadingIcon={<Plus className="h-4 w-4" />}
                variant="gradient"
                className="border-transparent"
                onClick={handleCreateSurvey}
              >
                New survey
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Total responses"
                value={metrics.totalResponses.toLocaleString()}
                sub="Across all surveys"
              />
              <MetricCard
                label="Active surveys"
                value={metrics.activeSurveys.toString()}
                sub="Currently collecting voice feedback"
              />
              <MetricCard
                label="Completion rate"
                value={`${metrics.completionRate}%`}
                sub="Average completion across submitted respondents"
              />
              <MetricCard
                label="Pending transcripts"
                value={metrics.pendingTranscripts.toString()}
                sub={
                  metrics.pendingTranscripts > 0
                    ? "Responses still waiting for transcription"
                    : "All transcripts are up to date"
                }
                trend={
                  metrics.pendingTranscripts > 0
                    ? `${metrics.pendingTranscripts} waiting`
                    : undefined
                }
                trendDirection={metrics.pendingTranscripts > 0 ? "down" : "up"}
              />
            </div>

            <section className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-blue">Library</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-text-primary">Surveys</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((item) => (
                    <Chip
                      key={item}
                      active={filter === item}
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              {error ? (
                <Card className="rounded-xl border-status-danger/20 bg-status-danger/5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-medium text-text-primary">
                        Dashboard unavailable
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {error}
                      </p>
                    </div>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                </Card>
              ) : surveyRows.length === 0 ? (
                <EmptyState
                  title="No surveys yet"
                  description="Create your first survey to start collecting spoken feedback from customers, employees, and communities."
                  action={
                    <Button
                      leadingIcon={<Plus className="h-4 w-4" />}
                      onClick={handleCreateSurvey}
                    >
                      Create your first survey
                    </Button>
                  }
                />
              ) : filteredRows.length === 0 ? (
                <EmptyState
                  title={`No ${filter.toLowerCase()} surveys`}
                  description="Try a different filter or create a new survey to see more activity here."
                  action={
                    <Button variant="secondary" onClick={() => setFilter("All")}>
                      Show all surveys
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredRows.map((survey) => (
                    <SurveyListRow key={survey.id} survey={survey} />
                  ))}
                </div>
              )}
            </section>

            {insightSurvey ? (
              <Card className="rounded-xl border-brand-orange/30 bg-brand-orange-light">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-orange-dark">
                      Latest insight-ready survey
                    </p>
                    <h2 className="mt-2 text-lg font-medium text-text-primary">
                      Latest insights from {insightSurvey.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {insightSurvey.completedTranscriptCount} transcript
                      {insightSurvey.completedTranscriptCount === 1 ? "" : "s"} are ready for AI analysis, with{" "}
                      {insightSurvey.respondentCount} total response
                      {insightSurvey.respondentCount === 1 ? "" : "s"} collected so far.
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    leadingIcon={<Sparkles className="h-4 w-4" />}
                    className="self-start text-brand-orange-dark hover:bg-white/70 hover:text-brand-orange-dark"
                    onClick={() =>
                      navigate(`/dashboard/surveys/${insightSurvey.id}/analytics`)
                    }
                  >
                    Open full analytics →
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip active>
                    {insightSurvey.completedTranscriptCount} transcripts ready
                  </Chip>
                  <Chip active>{insightSurvey.respondentCount} responses collected</Chip>
                  <Chip active>
                    Updated{" "}
                    {insightSurvey.lastActivityAt
                      ? formatRelativeDate(insightSurvey.lastActivityAt)
                      : "recently"}
                  </Chip>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      )}
      <Modal
        open={!org && !setupPromptDismissed}
        onClose={handleSetupLater}
        title="Set up your workspace?"
        description="You are signed in. Workspace setup is optional for now, but you will need it before creating and sharing surveys."
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={handleSetupLater}>
              Do this later
            </Button>
            <Button onClick={() => navigate("/onboarding")}>
              Set up now
            </Button>
          </div>
        }
      >
        <div className="rounded-xl border border-border bg-surface-muted p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">A workspace keeps your research organised</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Add your organisation name, choose your main use case, and invite teammates whenever you are ready.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
