import DashboardShell from "../components/DashboardShell";

export default function Profile() {
  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Profile Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="you@company.com"
              />
            </div>

            <button className="mt-2 w-fit rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
