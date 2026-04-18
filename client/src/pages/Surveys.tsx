import { useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { SurveyCard } from "../components/surveys/SurveyCard";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { getMySurveys, type SurveyRecord } from "../lib/surveys";

export default function Surveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getMySurveys();
        setSurveys(data);
      } catch (error) {
        console.error("Survey load error:", error);
        setLoadError("We couldn't load your surveys right now.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <DashboardShell>
      <PageHeader
        title="Surveys"
        actions={surveys.length > 0 ? (
          <Button
            onClick={() => navigate("/surveys/create")}
            trailingIcon={<Plus className="h-4 w-4" />}
          >
            Create Survey
          </Button>
        ) : undefined}
      />

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 shadow-sm sm:p-6"
            >
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="mt-4 h-7 w-3/5 rounded-full" />
              <Skeleton className="mt-3 h-16 rounded-[20px]" />
              <Skeleton className="mt-6 h-11 w-36 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <Feedback
          variant="error"
          title="Your surveys didn't load"
          description={loadError}
        />
      ) : surveys.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-6 w-6" />}
          title="You havent created a survey yet"
          description="Create Survey to start collecting voice responses."
          action={
            <Button onClick={() => navigate("/surveys/create")}>
              Create Survey
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onOpen={() => navigate(`/surveys/${survey.id}`)}
            />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
