import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import { createSurvey } from "../lib/surveys";

export default function CreateSurvey() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Survey title is required.");
      return;
    }

    try {
      setLoading(true);
      const survey = await createSurvey({ title, description });
      navigate(`/surveys/${survey.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create survey.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <FaClipboardList className="h-7 w-7 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Create Survey
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Start a new voice survey for your organization.
            </p>
          </div>
        </div>

        <div className="brand-card p-6">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Survey Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="brand-input"
                placeholder="Customer Experience Feedback"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="brand-input min-h-[120px]"
                placeholder="Add a short description for this survey..."
              />
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="brand-btn-primary px-5 py-3"
              >
                {loading ? "Creating..." : "Create Survey"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/surveys")}
                className="brand-btn-secondary px-5 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
