import DashboardShell from "../components/DashboardShell";

export default function Onboarding() {
  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Organization Setup
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete your company profile to unlock surveys and team management.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Organization name
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Organization slug
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="your-company"
              />
            </div>

            <button className="mt-2 w-fit rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black">
              Save organization
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
