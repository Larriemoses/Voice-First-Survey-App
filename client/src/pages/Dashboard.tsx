import DashboardShell from "../components/DashboardShell";

export default function Dashboard() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to your organization workspace.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Surveys</p>
            <h3 className="mt-2 text-3xl font-semibold text-gray-900">0</h3>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Responses</p>
            <h3 className="mt-2 text-3xl font-semibold text-gray-900">0</h3>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Organization Status</p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              Pending setup
            </h3>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
