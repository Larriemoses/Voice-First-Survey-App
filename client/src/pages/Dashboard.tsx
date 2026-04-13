import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaRocket,
  FaArrowRight,
  FaBolt,
  FaWaveSquare,
} from "react-icons/fa";

import DashboardShell from "../components/DashboardShell";
import { getMyOrganizationMembership } from "../lib/organization";
import { supabase } from "../lib/supabase";

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
          surveys?.filter((survey) => survey.status === "published").length ||
          0;

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
        setLoadError("Failed to load dashboard data.");
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
        title: "You’re ready to launch your first survey",
        text: "Create a survey to start collecting voice responses and building useful business insight.",
      };
    }

    if (metrics.publishedSurveys === 0) {
      return {
        title: "You have surveys, but none are live yet",
        text: "Publish a survey to begin collecting voice responses from your audience.",
      };
    }

    if (metrics.totalResponses === 0) {
      return {
        title: "Your surveys are live",
        text: "Now share them and start collecting your first responses.",
      };
    }

    return {
      title: "Your workspace is active",
      text: "Track responses, review survey performance, and keep improving your voice feedback workflow.",
    };
  }, [metrics]);

  const progressItems = [
    {
      label: "Create survey",
      done: metrics.totalSurveys > 0,
    },
    {
      label: "Publish survey",
      done: metrics.publishedSurveys > 0,
    },
    {
      label: "Collect responses",
      done: metrics.totalResponses > 0,
    },
  ];

  const metricCards = [
    {
      label: "Surveys",
      value: metrics.totalSurveys,
      icon: <FaClipboardList className="h-5 w-5" />,
      tone: "text-[#0B4EA2] bg-[#EAF2FF]",
    },
    {
      label: "Published",
      value: metrics.publishedSurveys,
      icon: <FaRocket className="h-5 w-5" />,
      tone: "text-[#F56A00] bg-[#FFF1E7]",
    },
    {
      label: "Responses",
      value: metrics.totalResponses,
      icon: <FaChartBar className="h-5 w-5" />,
      tone: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Team",
      value: metrics.teamMembers,
      icon: <FaUsers className="h-5 w-5" />,
      tone: "text-cyan-600 bg-cyan-50",
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            A focused view of your Survica workspace.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-slate-500">Loading dashboard...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 sm:p-6">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:gap-5 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm sm:p-6 lg:p-7">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#0B4EA2]/5 blur-3xl sm:h-32 sm:w-32" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#F56A00]/5 blur-3xl sm:h-28 sm:w-28" />

                <div className="relative">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-semibold text-[#0B4EA2]">
                    <FaWaveSquare className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{orgName}</span>
                  </div>

                  <div className="mt-4 max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                      {insightMessage.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                      {insightMessage.text}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={() => navigate("/surveys/create")}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B4EA2] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#093E81] sm:w-auto"
                    >
                      Create Survey
                      <FaArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => navigate("/surveys")}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                    >
                      View Surveys
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                    <FaBolt className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Next steps
                    </h2>
                    <p className="text-sm text-slate-500">
                      What to complete next
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {progressItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.done
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {item.done ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/surveys/create")}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#0B4EA2] transition hover:text-[#093E81]"
                >
                  Continue setup
                  <FaArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className={`rounded-2xl p-3 ${card.tone}`}>
                      {card.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {card.label}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
                    {card.value}
                  </h3>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Workflow status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  A quick view of where your workspace stands
                </p>

                <div className="mt-5 space-y-3 sm:space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Surveys created
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      You currently have{" "}
                      <span className="font-semibold text-slate-900">
                        {metrics.totalSurveys}
                      </span>{" "}
                      survey{metrics.totalSurveys === 1 ? "" : "s"} in your
                      workspace.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Surveys published
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      <span className="font-semibold text-slate-900">
                        {metrics.publishedSurveys}
                      </span>{" "}
                      survey{metrics.publishedSurveys === 1 ? "" : "s"} are live
                      and ready to collect responses.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Total responses
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Your workspace has collected{" "}
                      <span className="font-semibold text-slate-900">
                        {metrics.totalResponses}
                      </span>{" "}
                      response{metrics.totalResponses === 1 ? "" : "s"} so far.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Quick access
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Jump into the most common workspace tasks
                </p>

                <div className="mt-5 grid gap-3">
                  <button
                    onClick={() => navigate("/surveys/create")}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-[#0B4EA2]/30 hover:bg-[#EAF2FF]/40"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        Create survey
                      </p>
                      <p className="text-xs text-slate-500">
                        Start a new voice survey workflow
                      </p>
                    </div>
                    <FaArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-[#0B4EA2]" />
                  </button>

                  <button
                    onClick={() => navigate("/surveys")}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-[#0B4EA2]/30 hover:bg-[#EAF2FF]/40"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        Manage surveys
                      </p>
                      <p className="text-xs text-slate-500">
                        Review, edit, and organize surveys
                      </p>
                    </div>
                    <FaArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-[#0B4EA2]" />
                  </button>

                  <button
                    onClick={() => navigate("/profile")}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-[#0B4EA2]/30 hover:bg-[#EAF2FF]/40"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        Manage profile
                      </p>
                      <p className="text-xs text-slate-500">
                        Update your account and workspace preferences
                      </p>
                    </div>
                    <FaArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-[#0B4EA2]" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
