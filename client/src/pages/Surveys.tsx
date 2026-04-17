import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList, Plus, Radio } from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import { getMySurveys } from "../lib/surveys";
import { formatDate } from "../utils/helpers";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "closed";
  created_at: string;
};

function SurveyStatusBadge({ status }: { status: Survey["status"] }) {
  if (status === "published") {
    return <Badge variant="success" dot>Live</Badge>;
  }

  if (status === "closed") {
    return <Badge variant="default">Closed</Badge>;
  }

  return <Badge variant="warning" dot>Draft</Badge>;
}

export default function Surveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
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

  const summary = useMemo(() => {
    const total = surveys.length;
    const published = surveys.filter((survey) => survey.status === "published").length;
    const drafts = surveys.filter((survey) => survey.status === "draft").length;
    const closed = surveys.filter((survey) => survey.status === "closed").length;

    return { total, published, drafts, closed };
  }, [surveys]);

  const columns: Array<DataTableColumn<Survey>> = [
    {
      id: "title",
      header: "Survey",
      sortValue: (survey) => survey.title.toLowerCase(),
      cell: (survey) => (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {survey.title}
          </p>
          <p className="max-w-xl text-sm text-[var(--color-text-muted)]">
            {survey.description || "You haven't added a description yet."}
          </p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortValue: (survey) => survey.status,
      cell: (survey) => <SurveyStatusBadge status={survey.status} />,
    },
    {
      id: "created_at",
      header: "Created",
      sortValue: (survey) => new Date(survey.created_at).getTime(),
      cell: (survey) => (
        <span className="text-sm text-[var(--color-text-muted)]">
          {formatDate(survey.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Open",
      cell: (survey) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/surveys/${survey.id}`)}>
          Open
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <DashboardShell>
      <PageHeader
        title="Surveys"
        subtitle="See every draft, live survey, and closed project in one place"
        actions={
          <Button
            onClick={() => navigate("/surveys/create")}
            trailingIcon={<Plus className="h-4 w-4" />}
          >
            Create survey
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="space-y-2 p-4 sm:space-y-3 sm:p-5">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-8 w-14 rounded-[18px] sm:h-9 sm:w-16 sm:rounded-[20px]" />
                <Skeleton className="h-4 w-28 rounded-full" />
              </Card>
            ))}
          </div>
          <Card className="space-y-4">
            <Skeleton className="h-12 rounded-[20px]" />
            <Skeleton className="h-16 rounded-[24px]" />
            <Skeleton className="h-16 rounded-[24px]" />
          </Card>
        </div>
      ) : loadError ? (
        <Feedback
          variant="error"
          title="Your surveys didn't load"
          description={loadError}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {[
              { label: "Total", value: summary.total, icon: ClipboardList },
              { label: "Live", value: summary.published, icon: Radio },
              { label: "Drafts", value: summary.drafts, icon: ClipboardList },
              { label: "Closed", value: summary.closed, icon: ClipboardList },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.label} className="space-y-2 p-4 sm:space-y-3 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] sm:text-xs">
                      {item.label}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)] sm:h-10 sm:w-10 sm:rounded-[18px]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
                    {item.value}
                  </p>
                </Card>
              );
            })}
          </div>

          {surveys.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-6 w-6" />}
              title="No surveys yet"
              description="Create your first survey to start collecting voice responses in a flow that feels polished from day one."
              action={
                <Button onClick={() => navigate("/surveys/create")}>
                  Create your first survey
                </Button>
              }
            />
          ) : (
            <DataTable
              data={surveys}
              columns={columns}
              getRowId={(survey) => survey.id}
              initialSort={{ id: "created_at", direction: "desc" }}
              mobileCard={(survey) => (
                <Card className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[var(--color-text)]">
                        {survey.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {survey.description || "You haven't added a description yet."}
                      </p>
                    </div>
                    <SurveyStatusBadge status={survey.status} />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm text-[var(--color-text-muted)]">
                    <span>Created {formatDate(survey.created_at)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/surveys/${survey.id}`)}
                      trailingIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Open
                    </Button>
                  </div>
                </Card>
              )}
            />
          )}
        </div>
      )}
    </DashboardShell>
  );
}
