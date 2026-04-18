import { useEffect, useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { SurveyCard } from "../components/surveys/SurveyCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { getCurrentUser } from "../lib/auth";
import { getSurveyPath } from "../lib/branding";
import { getMyOrganizationMembership } from "../lib/organization";
import {
  deleteSurvey,
  getMySurveys,
  getSurveyResponseCounts,
  type SurveyRecord,
} from "../lib/surveys";
import { getFirstName } from "../utils/helpers";

type OrgState = Awaited<ReturnType<typeof getMyOrganizationMembership>>;

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [membership, setMembership] = useState<OrgState>(null);
  const [firstName, setFirstName] = useState("there");
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setLoadError("");

        const [user, membershipData, surveyData] = await Promise.all([
          getCurrentUser(),
          getMyOrganizationMembership(),
          getMySurveys(),
        ]);

        const counts = await getSurveyResponseCounts(surveyData.map((survey) => survey.id));

        setFirstName(
          getFirstName(
            (user?.user_metadata?.full_name as string | undefined) || user?.email,
          ),
        );
        setMembership(membershipData);
        setSurveys(surveyData);
        setResponseCounts(counts);
      } catch (error) {
        console.error("Dashboard load error:", error);
        setLoadError("We couldn't load your workspace right now.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const metrics = useMemo(() => {
    const totalSurveys = surveys.length;
    const totalResponses = Object.values(responseCounts).reduce(
      (sum, count) => sum + count,
      0,
    );
    const publishedSurveys = surveys.filter((survey) => survey.status === "published").length;

    return { totalSurveys, totalResponses, publishedSurveys };
  }, [responseCounts, surveys]);

  async function handleDeleteSurvey(surveyId: string) {
    const previousSurveys = surveys;
    const previousCounts = responseCounts;

    setSurveys((current) => current.filter((survey) => survey.id !== surveyId));
    setResponseCounts((current) => {
      const next = { ...current };
      delete next[surveyId];
      return next;
    });

    try {
      await deleteSurvey(surveyId);
      showToast({
        variant: "success",
        title: "Survey deleted",
        description: "The survey and its responses have been removed.",
      });
    } catch (error) {
      console.error("Delete survey error:", error);
      setSurveys(previousSurveys);
      setResponseCounts(previousCounts);
      showToast({
        variant: "error",
        title: "Survey not deleted",
        description: "We couldn't delete that survey right now.",
      });
    }
  }

  async function handleCopyLink(surveyId: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${getSurveyPath(surveyId)}`,
      );
      showToast({
        variant: "success",
        title: "Public link copied",
        description: "Share it with respondents when you're ready.",
      });
    } catch (error) {
      console.error("Copy public link error:", error);
      showToast({
        variant: "error",
        title: "Link not copied",
        description: "Clipboard access is blocked in this browser.",
      });
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <section className="space-y-1">
          <h1 className="text-base font-semibold text-[var(--text)]">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            {membership?.organization?.name || "Your workspace"}
          </p>
          {!loading && surveys.length === 0 ? (
            <p className="pt-2 text-sm text-[var(--text-muted)]">
              Survica lets you collect voice responses from real people, no typing
              required.
            </p>
          ) : null}
        </section>

        {loading ? (
          <div className="space-y-6">
            <div className="flex gap-3 overflow-hidden pb-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="min-w-[12rem] space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-28" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : loadError ? (
          <Feedback
            variant="error"
            title="Dashboard unavailable"
            description={loadError}
          />
        ) : !membership?.organization ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="No workspace yet"
            description="Create your workspace first so Survica has a place to store surveys and responses."
            action={
              <Button onClick={() => navigate("/onboarding")}>
                Create workspace
              </Button>
            }
          />
        ) : surveys.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="You haven't created a survey yet"
            description="Create your first survey to start collecting voice responses."
            action={
              <Button onClick={() => navigate("/surveys/create")}>
                Create survey
              </Button>
            }
          />
        ) : (
          <>
            <section
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
              aria-label="Workspace metrics"
            >
              {[
                { label: "Total Surveys", value: metrics.totalSurveys },
                { label: "Total Responses", value: metrics.totalResponses },
                { label: "Published Surveys", value: metrics.publishedSurveys },
              ].map((metric) => (
                <Card
                  key={metric.label}
                  className="min-w-[12rem] snap-start px-4 py-4 sm:flex-1"
                >
                  <p className="text-2xl font-semibold text-[var(--text)]">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {metric.label}
                  </p>
                </Card>
              ))}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-[var(--text)]">
                  Your Surveys
                </h2>
                <Button
                  onClick={() => navigate("/surveys/create")}
                  className="shrink-0"
                >
                  New survey
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {surveys.map((survey) => (
                  <SurveyCard
                    key={survey.id}
                    survey={{
                      id: survey.id,
                      title: survey.title,
                      status: survey.status,
                      responseCount: responseCounts[survey.id] || 0,
                      updatedAt: survey.updated_at || survey.created_at,
                    }}
                    builderPath={`/surveys/${survey.id}`}
                    onDelete={handleDeleteSurvey}
                    onCopyPublicLink={handleCopyLink}
                    onEditBranding={(surveyId) => navigate(`/surveys/${surveyId}#branding`)}
                    onViewResponses={(surveyId) =>
                      navigate(`/surveys/${surveyId}/responses`)
                    }
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
