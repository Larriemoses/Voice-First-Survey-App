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
            <h2 className="text-2xl font-semibold text-gray-900">
              Create Survey
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Start a new voice survey for your organization.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Survey Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                placeholder="Customer Experience Feedback"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
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
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Survey"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/surveys")}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
