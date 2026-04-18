import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { SurveyCard } from "../components/surveys/SurveyCard";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { getSurveyPath } from "../lib/branding";
import {
  deleteSurvey,
  getMySurveys,
  getSurveyResponseCounts,
  type SurveyRecord,
} from "../lib/surveys";

export default function Surveys() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getMySurveys();
        const counts = await getSurveyResponseCounts(data.map((survey) => survey.id));

        setSurveys(data);
        setResponseCounts(counts);
      } catch (error) {
        console.error("Survey load error:", error);
        setLoadError("We couldn't load your surveys right now.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

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
      <PageHeader
        title="Surveys"
        subtitle="Open a survey, publish it, or review its respondent link from one place."
        actions={
          <Button onClick={() => navigate("/surveys/create")}>New survey</Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : loadError ? (
        <Feedback
          variant="error"
          title="Surveys unavailable"
          description={loadError}
        />
      ) : surveys.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-6 w-6" />}
          title="No surveys yet"
          description="Create your first survey to start collecting voice responses."
          action={
            <Button onClick={() => navigate("/surveys/create")}>
              Create survey
            </Button>
          }
        />
      ) : (
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
              onViewResponses={(surveyId) => navigate(`/surveys/${surveyId}/responses`)}
            />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
