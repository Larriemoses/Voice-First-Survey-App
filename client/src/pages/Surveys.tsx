import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaPlus, FaCalendarAlt } from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import { getMySurveys } from "../lib/surveys";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "closed";
  created_at: string;
};

export default function Surveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMySurveys();
        setSurveys(data);
      } catch (error) {
        console.error("Survey load error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <FaClipboardList className="h-7 w-7 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Surveys</h2>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Manage and build your organization’s voice surveys.
            </p>
          </div>

          <button
            onClick={() => navigate("/surveys/create")}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            <FaPlus className="h-4 w-4" />
            Create Survey
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              No surveys yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first survey to begin collecting voice responses.
            </p>
            <button
              onClick={() => navigate("/surveys/create")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
            >
              <FaPlus className="h-4 w-4" />
              Create your first survey
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {surveys.map((survey) => (
              <button
                key={survey.id}
                onClick={() => navigate(`/surveys/${survey.id}`)}
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
                      {survey.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {survey.description || "No description provided."}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                    {survey.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <FaCalendarAlt className="h-4 w-4" />
                  <span>
                    {new Date(survey.created_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
