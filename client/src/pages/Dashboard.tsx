import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaCalendar,
  FaBriefcase,
  FaUser,
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
  FaWaveSquare,
} from "react-icons/fa";
import { FaHardDrive } from "react-icons/fa6";

import DashboardShell from "../components/DashboardShell";
import { getMyOrganizationMembership } from "../lib/organization";
import { getCurrentUser } from "../lib/auth";
import { supabase } from "../lib/supabase";

type OrgState = {
  id?: string;
  role?: string;
  created_at?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
    owner_user_id?: string;
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

        const [membershipData] = await Promise.all([
          getMyOrganizationMembership(),
          getCurrentUser(),
        ]);

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

  const orgName = membership?.organization?.name || "No organization yet";
  const orgSlug = membership?.organization?.slug || "—";
  const role = membership?.role || "—";
  const orgCreatedAt = membership?.organization?.created_at
    ? new Date(membership.organization.created_at).toLocaleDateString()
    : "—";

  const workspaceState = useMemo(() => {
    if (!membership?.organization) return "Pending";
    if (metrics.totalSurveys === 0) return "Ready";
    if (metrics.publishedSurveys === 0) return "Draft";
    return "Active";
  }, [membership, metrics]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-white to-[#EAF2FF] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.22)]">
          <div className="flex flex-col gap-5 px-6 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF2FF] px-4 py-2 text-sm font-medium text-[#0B4EA2]">
                <FaWaveSquare className="h-4 w-4" />
                Survica workspace
              </div>

              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {orgName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Voice survey intelligence dashboard
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Workspace
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {workspaceState}
                </p>
              </div>

              <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Role
                </p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                  {role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Loading dashboard...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0B4EA2]/30 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-[#EAF2FF] p-3 text-[#0B4EA2]">
                    <FaClipboardList className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Total
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">Surveys</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.totalSurveys}
                </h3>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F56A00]/30 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-[#FFF1E7] p-3 text-[#F56A00]">
                    <FaRocket className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Live
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">Published</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.publishedSurveys}
                </h3>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                    <FaCheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Collected
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">Responses</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.totalResponses}
                </h3>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                    <FaUsers className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Team
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">Members</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.teamMembers}
                </h3>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#EAF2FF] p-3 text-[#0B4EA2]">
                    <FaBriefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Workspace Snapshot
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Core organization information at a glance.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#0B4EA2]/20 hover:bg-[#EAF2FF]/40">
                    <div className="flex items-center gap-2">
                      <FaUsers className="h-4 w-4 text-[#0B4EA2]" />
                      <p className="text-sm text-slate-500">Organization</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {orgName}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#F56A00]/20 hover:bg-[#FFF1E7]/50">
                    <div className="flex items-center gap-2">
                      <FaClipboardList className="h-4 w-4 text-[#F56A00]" />
                      <p className="text-sm text-slate-500">Slug</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {orgSlug}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:bg-violet-50">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-4 w-4 text-violet-600" />
                      <p className="text-sm text-slate-500">Role</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold capitalize text-slate-900">
                      {role}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-amber-200 hover:bg-amber-50">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="h-4 w-4 text-amber-600" />
                      <p className="text-sm text-slate-500">Created On</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {orgCreatedAt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#FFF1E7] p-3 text-[#F56A00]">
                    <FaRocket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Quick Actions
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Move across your workflow faster.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <button
                    onClick={() => navigate("/surveys/create")}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-[#0B4EA2]/30 hover:bg-[#EAF2FF]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2 text-[#0B4EA2] shadow-sm">
                        <FaClipboardList className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Create Survey
                        </p>
                        <p className="text-xs text-slate-500">
                          Start a new survey flow
                        </p>
                      </div>
                    </div>
                    <FaArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-[#0B4EA2]" />
                  </button>

                  <button
                    onClick={() => navigate("/surveys")}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-[#0B4EA2]/30 hover:bg-[#EAF2FF]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2 text-[#0B4EA2] shadow-sm">
                        <FaChartBar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          View Surveys
                        </p>
                        <p className="text-xs text-slate-500">
                          Monitor surveys and responses
                        </p>
                      </div>
                    </div>
                    <FaArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-[#0B4EA2]" />
                  </button>

                  <button
                    onClick={() => navigate("/profile")}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-[#0B4EA2]/30 hover:bg-[#EAF2FF]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2 text-[#0B4EA2] shadow-sm">
                        <FaUser className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Manage Profile
                        </p>
                        <p className="text-xs text-slate-500">
                          Update account details
                        </p>
                      </div>
                    </div>
                    <FaArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-[#0B4EA2]" />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <FaHardDrive className="h-4 w-4 text-[#F56A00]" />
                    Storage usage
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Tracking enabled. Usage details will appear as uploads grow.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
