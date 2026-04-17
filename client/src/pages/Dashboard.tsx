import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AudioWaveform,
  ArrowRight,
  ClipboardList,
  MessageSquareText,
  Rocket,
  Users,
} from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import { getMyOrganizationMembership } from "../lib/organization";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";

type OrgState = {
  id?: string;
  role?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
    created_at?: string;
  } | null;
} | null;

type MetricsState = {
  totalSurveys: number;
  publishedSurveys: number;
  totalResponses: number;
  teamMembers: number;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [membership, setMembership] = useState<OrgState>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [metrics, setMetrics] = useState<MetricsState>({
    totalSurveys: 0,
    publishedSurveys: 0,
    totalResponses: 0,
    teamMembers: 1,
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setLoadError("");

        const membershipData = await getMyOrganizationMembership();
        setMembership(membershipData);

        const orgId = membershipData?.organization?.id;
        if (!orgId) {
          setLoading(false);
          return;
        }

        const { data: surveys, error: surveysError } = await supabase
          .from("surveys")
          .select("id, status")
          .eq("organization_id", orgId);

        if (surveysError) throw surveysError;

        const surveyIds = (surveys || []).map((survey) => survey.id);

        const totalSurveys = surveys?.length || 0;
        const publishedSurveys =
          surveys?.filter((survey) => survey.status === "published").length || 0;

        const [
          { count: responseCount, error: responsesError },
          { count: memberCount, error: membersError },
        ] = await Promise.all([
          surveyIds.length > 0
            ? supabase
                .from("responses")
                .select("id", { count: "exact", head: true })
                .in("survey_id", surveyIds)
            : Promise.resolve({ count: 0, error: null } as const),
          supabase
            .from("organization_members")
            .select("id", { count: "exact", head: true })
            .eq("organization_id", orgId),
        ]);

        if (responsesError) throw responsesError;
        if (membersError) throw membersError;

        setMetrics({
          totalSurveys,
          publishedSurveys,
          totalResponses: responseCount || 0,
          teamMembers: memberCount || 1,
        });
      } catch (error) {
        console.error("Dashboard load error:", error);
        setLoadError("We couldn't load your dashboard right now.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const orgName = membership?.organization?.name || "Your workspace";

  const insightMessage = useMemo(() => {
    if (metrics.totalSurveys === 0) {
      return {
        title: "You're ready for your first survey",
        text: "Create a survey, shape the voice experience, and publish it when it feels right.",
      };
    }

    if (metrics.publishedSurveys === 0) {
      return {
        title: "Your drafts are waiting to go live",
        text: "Review your builder, publish a survey, and start collecting real responses.",
      };
    }

    if (metrics.totalResponses === 0) {
      return {
        title: "Your survey is live",
        text: "Now's the moment to share it and bring your first responses into the workspace.",
      };
    }

    return {
      title: "Your workspace has momentum",
        text: "Stay close to what's coming in, review transcripts, and keep improving the experience.",
    };
  }, [metrics]);

  const steps = [
    { label: "Create a survey", done: metrics.totalSurveys > 0 },
    { label: "Publish it", done: metrics.publishedSurveys > 0 },
    { label: "Collect responses", done: metrics.totalResponses > 0 },
  ];

  const completion = steps.filter((step) => step.done).length;

  const metricCards = [
    {
      label: "Surveys",
      value: metrics.totalSurveys,
      note: "Total survey drafts and live surveys",
      icon: ClipboardList,
    },
    {
      label: "Live",
      value: metrics.publishedSurveys,
      note: "Published surveys collecting responses",
      icon: Rocket,
    },
    {
      label: "Responses",
      value: metrics.totalResponses,
      note: "Voice responses recorded so far",
      icon: MessageSquareText,
    },
    {
      label: "Team",
      value: metrics.teamMembers,
      note: "People in this workspace",
      icon: Users,
    },
  ];

  return (
    <DashboardShell>
      <PageHeader
        title="Dashboard"
        subtitle={`A calm view of what's happening in ${orgName}`}
        actions={
          <Button
            onClick={() => navigate("/surveys/create")}
            trailingIcon={<ArrowRight className="h-4 w-4" />}
          >
            Create survey
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-4">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-14 w-4/5" />
            <Skeleton className="h-24 rounded-[24px]" />
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-14 rounded-[20px]" />
            <Skeleton className="h-14 rounded-[20px]" />
            <Skeleton className="h-14 rounded-[20px]" />
          </Card>
        </div>
      ) : loadError ? (
        <Feedback
          variant="error"
          title="Your dashboard didn't load"
          description={loadError}
        />
      ) : !membership?.organization ? (
        <EmptyState
          icon={<AudioWaveform className="h-6 w-6" />}
          title="Let's set up your workspace"
          description="Create your workspace first, then you can start building surveys and collecting responses."
          action={
            <Button onClick={() => navigate("/onboarding")}>
              Finish setup
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
                <AudioWaveform className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                {orgName}
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-[var(--color-text)]">
                  {insightMessage.title}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
                  {insightMessage.text}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("/surveys/create")}
                  trailingIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create survey
                </Button>
                <Button variant="secondary" onClick={() => navigate("/surveys")}>
                  View surveys
                </Button>
              </div>
            </Card>

            <Card variant="flat" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  Next milestones
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  You've completed {completion} of {steps.length} key setup steps
                </p>
              </div>

              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.label}
                    className="flex items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3"
                  >
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {step.label}
                    </span>
                    <Badge variant={step.done ? "success" : "warning"} dot>
                      {step.done ? "Done" : "Next"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-[var(--color-surface)] text-[var(--color-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-3xl font-semibold text-[var(--color-text)]">
                    {card.value}
                  </p>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    {card.note}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  What to do next
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Keep moving the workspace forward without guessing
                </p>
              </div>

              {[
                {
                  title: "Create a new survey",
                  description: "Start with a title, add questions, and shape the respondent experience.",
                  action: () => navigate("/surveys/create"),
                },
                {
                  title: "Review existing surveys",
                  description: "Open your survey list to publish drafts or revisit live work.",
                  action: () => navigate("/surveys"),
                },
                {
                  title: "Update your profile",
                  description: "Keep your account details tidy so shared workflows stay clear.",
                  action: () => navigate("/profile"),
                },
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={item.action}
                  className="flex min-h-14 items-center justify-between gap-4 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-4 text-left transition hover:bg-[var(--color-surface)]"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                </button>
              ))}
            </Card>

            <Card variant="flat" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  Workspace pulse
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  A quick read on how your workspace is performing right now
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Survey drafts
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    You currently have {metrics.totalSurveys - metrics.publishedSurveys} survey drafts waiting for polish or publication.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Live collection
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {metrics.publishedSurveys > 0
                      ? `${metrics.publishedSurveys} live surveys are ready to receive more voice responses.`
                      : "No live surveys yet. Publish one when you're ready to collect feedback."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
