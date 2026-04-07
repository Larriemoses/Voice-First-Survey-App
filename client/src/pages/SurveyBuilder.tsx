import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaMicrophoneAlt,
  FaPlus,
  FaClipboardList,
  FaClock,
  FaRocket,
  FaLink,
} from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import {
  addQuestion,
  getSurveyById,
  getSurveyQuestions,
  publishSurvey,
} from "../lib/surveys";

type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "closed";
};

type Question = {
  id: string;
  prompt: string;
  order_index: number;
  max_duration_seconds: number | null;
};

export default function SurveyBuilder() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prompt, setPrompt] = useState("");
  const [maxDuration, setMaxDuration] = useState("120");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    if (!surveyId) return;

    try {
      setLoading(true);
      const [surveyData, questionData] = await Promise.all([
        getSurveyById(surveyId),
        getSurveyQuestions(surveyId),
      ]);

      setSurvey(surveyData);
      setQuestions(questionData);
    } catch (err) {
      console.error("Survey builder load error:", err);
      setError("Failed to load survey data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [surveyId]);

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!surveyId) return;

    if (!prompt.trim()) {
      setError("Question prompt is required.");
      return;
    }

    try {
      setSaving(true);

      await addQuestion({
        survey_id: surveyId,
        prompt,
        order_index: questions.length + 1,
        max_duration_seconds: Number(maxDuration) || 120,
      });

      setPrompt("");
      setMaxDuration("120");
      await loadData();
    } catch (err) {
      console.error("Add question error:", err);
      setError(err instanceof Error ? err.message : "Failed to add question.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublishSurvey() {
    if (!surveyId) return;
    if (questions.length === 0) {
      setError("Add at least one question before publishing.");
      return;
    }

    try {
      setPublishing(true);
      const updated = await publishSurvey(surveyId);
      setSurvey(updated);
    } catch (err) {
      console.error("Publish survey error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to publish survey.",
      );
    } finally {
      setPublishing(false);
    }
  }

  const publicLink = `${window.location.origin}/take-survey/${surveyId}`;

  return (
    <DashboardShell>
      <div className="space-y-8">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Loading survey builder...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <FaClipboardList className="h-7 w-7 text-indigo-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {survey?.title || "Survey Builder"}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {survey?.description ||
                    "Build your voice survey questions here."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {survey?.status === "published" ? (
                  <a
                    href={publicLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <FaLink className="h-4 w-4" />
                    Open Public Survey
                  </a>
                ) : (
                  <button
                    onClick={handlePublishSurvey}
                    disabled={publishing}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
                  >
                    <FaRocket className="h-4 w-4" />
                    {publishing ? "Publishing..." : "Publish Survey"}
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center gap-3">
                  <FaMicrophoneAlt className="h-5 w-5 text-rose-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add Question
                  </h3>
                </div>

                <form onSubmit={handleAddQuestion} className="mt-5 grid gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Question Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                      placeholder="What would you like respondents to answer by voice?"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Max Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="600"
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
                  >
                    <FaPlus className="h-4 w-4" />
                    {saving ? "Adding..." : "Add Question"}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Survey Summary
                </h3>

                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="mt-1 font-medium capitalize text-gray-900">
                      {survey?.status || "draft"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Total Questions</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {questions.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Public Link</p>
                    <p className="mt-1 break-all font-medium text-gray-900">
                      {survey?.status === "published"
                        ? publicLink
                        : "Publish survey first"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaClipboardList className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Survey Questions
                </h3>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-gray-500">
                    No questions added yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                          <FaMicrophoneAlt className="h-4 w-4 text-indigo-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Question {question.order_index}
                          </p>
                          <h4 className="mt-1 text-base font-semibold text-gray-900">
                            {question.prompt}
                          </h4>

                          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <FaClock className="h-4 w-4" />
                            <span>
                              Max Duration: {question.max_duration_seconds || 0}{" "}
                              seconds
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
