import { useEffect, useState } from "react";
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
} from "react-icons/fa";
import { FaHardDrive } from "react-icons/fa6";

import DashboardShell from "../components/DashboardShell";
import { getMyOrganizationMembership } from "../lib/organization";
import { getCurrentUser } from "../lib/auth";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [membership, setMembership] = useState<OrgState>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [membershipData, user] = await Promise.all([
          getMyOrganizationMembership(),
          getCurrentUser(),
        ]);

        setMembership(membershipData);
        setEmail(user?.email || "");
      } catch (error) {
        console.error("Dashboard load error:", error);
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

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <FaChartBar className="h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          </div>
          <p className="text-sm text-gray-500">
            Welcome to your organization workspace.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <FaUsers className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-sm text-gray-500">Organization</p>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                  {orgName}
                </h3>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <FaClipboardList className="h-5 w-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-sm text-gray-500">Organization Slug</p>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-green-600">
                  {orgSlug}
                </h3>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-purple-300 hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <FaRocket className="h-5 w-5 text-purple-600 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-sm text-gray-500">Your Role</p>
                </div>
                <h3 className="mt-2 text-xl font-semibold capitalize text-gray-900 transition-colors duration-300 group-hover:text-purple-600">
                  {role}
                </h3>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <FaCalendar className="h-5 w-5 text-orange-600 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-sm text-gray-500">Organization Created</p>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                  {orgCreatedAt}
                </h3>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg lg:col-span-2">
                <div className="flex items-center gap-3">
                  <FaBriefcase className="h-6 w-6 text-indigo-600 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                    Workspace Overview
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This is your control center for surveys, responses, and team
                  activity.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="group/stat rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-indigo-50">
                    <div className="flex items-center gap-2">
                      <FaClipboardList className="h-4 w-4 text-indigo-500" />
                      <p className="text-sm text-gray-500">Published Surveys</p>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover/stat:text-indigo-600">
                      0
                    </p>
                  </div>

                  <div className="group/stat rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-green-50">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-gray-500">Total Responses</p>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover/stat:text-green-600">
                      0
                    </p>
                  </div>

                  <div className="group/stat rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-blue-50">
                    <div className="flex items-center gap-2">
                      <FaUsers className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-gray-500">Team Members</p>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover/stat:text-blue-600">
                      1
                    </p>
                  </div>

                  <div className="group/stat rounded-xl bg-gray-50 p-4 transition-all duration-300 hover:bg-orange-50">
                    <div className="flex items-center gap-2">
                      <FaHardDrive className="h-4 w-4 text-orange-500" />
                      <p className="text-sm text-gray-500">Storage Usage</p>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover/stat:text-orange-600">
                      0 MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-cyan-300 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <FaUser className="h-6 w-6 text-cyan-600 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-cyan-600">
                    Account Summary
                  </h3>
                </div>

                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500">Signed in as</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {email || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Onboarding Status</p>
                    <p className="mt-1 font-medium text-green-600">
                      {membership?.organization ? "Completed" : "Pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Next Recommended Action</p>
                    <p className="mt-1 font-medium text-gray-900">
                      Create your first survey
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-rose-300 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <FaRocket className="h-6 w-6 text-rose-600 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-rose-600">
                  Quick Actions
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Start building your survey workflow from here.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/surveys/create")}
                  className="group/btn flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-lg active:scale-95"
                >
                  <FaClipboardList className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
                  Create Survey
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="group/btn flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95"
                >
                  <FaUser className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                  Manage Profile
                </button>

                <button
                  onClick={() => navigate("/onboarding")}
                  className="group/btn flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95"
                >
                  <FaBriefcase className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                  View Organization
                </button>

                <button
                  onClick={() => navigate("/surveys")}
                  className="group/btn flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95"
                >
                  <FaChartBar className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                  View Surveys
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
