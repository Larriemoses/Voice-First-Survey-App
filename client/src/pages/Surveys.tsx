import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaPlus,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { PageHeader } from "../components/ui/page-header";
import { getMySurveys } from "../lib/surveys";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "closed";
  created_at: string;
};

export default function Surveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMySurveys();
        setSurveys(data);
      } catch (error) {
        console.error("Survey load error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const summary = useMemo(() => {
    const total = surveys.length;
    const published = surveys.filter(
      (survey) => survey.status === "published",
    ).length;
    const drafts = surveys.filter((survey) => survey.status === "draft").length;
    const closed = surveys.filter(
      (survey) => survey.status === "closed",
    ).length;

    return { total, published, drafts, closed };
  }, [surveys]);

  function getStatusClasses(status: Survey["status"]) {
    switch (status) {
      case "published":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "closed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-100";
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-5 lg:space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef2ff] p-3 text-[#4f46e5]">
                <FaClipboardList className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Surveys
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage and build your organization’s voice surveys.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/surveys/create")}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#4f46e5] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#4338ca] sm:w-auto"
            type="button"
          >
            <FaPlus className="h-4 w-4" />
            Create Survey
          </button>
        </div>

        {!loading && surveys.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="brand-card rounded-2xl p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.total}
              </p>
            </Card>

            <div className="brand-card rounded-2xl p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Published
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.published}
              </p>
            </Card>

            <div className="brand-card rounded-2xl p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Drafts
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.drafts}
              </p>
            </Card>

            <div className="brand-card rounded-2xl p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Closed
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.closed}
              </p>
            </Card>
          </div>
        ) : null}

        {loading ? (
          <div className="brand-card p-5 sm:p-6">
            <p className="text-sm text-slate-500">Loading surveys...</p>
          </Card>
        ) : surveys.length === 0 ? (
          <div className="brand-card border-dashed border-slate-300 p-6 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FaClipboardList className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No surveys yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first survey to begin collecting voice responses.
            </p>

            <button
              onClick={() => navigate("/surveys/create")}
              type="button"
              className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#4f46e5] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4338ca] sm:w-auto"
            >
              Create your first survey
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {surveys.map((survey) => (
              <Card
                key={survey.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/surveys/${survey.id}`)}
                type="button"
                className="group rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-[#4f46e5]/20 hover:shadow-md sm:p-5 lg:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-[#4f46e5] sm:text-lg">
                        {survey.title}
                      </h3>

                      <span className="inline-flex">
                        <Badge
                          className={`${getStatusClasses(survey.status)} capitalize`}
                        >
                        {survey.status}
                        </Badge>
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {survey.description || "No description provided."}
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <FaCalendarAlt className="h-4 w-4 shrink-0" />
                        <span>
                          {new Date(survey.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-2 text-sm font-medium text-[#4f46e5]">
                        Open survey
                        <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
