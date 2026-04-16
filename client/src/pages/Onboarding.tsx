import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { createOrganization } from "../lib/onboarding";

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Organization name is required.");
      return;
    }

    try {
      setLoading(true);
      await createOrganization({ name, slug });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create organization.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Organization Setup
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Complete your company profile to unlock surveys and team management.
          </p>
        </div>

        <div className="brand-card p-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Organization name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="brand-input"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Organization slug
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="brand-input"
                placeholder="your-company"
              />
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="brand-btn-primary mt-2 w-fit px-5 py-3"
            >
              {loading ? "Saving..." : "Save organization"}
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
