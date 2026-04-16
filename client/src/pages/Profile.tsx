import { useEffect, useState } from "react";
import DashboardShell from "../components/DashboardShell";
import { getCurrentUser } from "../lib/auth";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();

      if (!user) return;

      setEmail(user.email || "");
      setFullName((user.user_metadata?.full_name as string) || "");
    }

    load();
  }, []);

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Profile Settings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="brand-card p-6">
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="brand-input"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={email}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 outline-none"
                placeholder="you@company.com"
              />
            </div>

            <p className="text-xs text-slate-500">
              Email is managed by your authentication provider.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
