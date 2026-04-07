import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaDownload,
  FaFileCsv,
  FaMicrophoneAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import {
  downloadResponseAudio,
  exportSurveyResponsesAsCSV,
  getSurveyResponsesForAdmin,
} from "../lib/responses";

type ResponseItem = {
  id: string;
  audio_path: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  created_at: string;
  respondent: {
    id: string;
    display_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  question: {
    id: string;
    prompt: string;
    order_index: number;
  } | null;
};

export default function SurveyResponses() {
  const { surveyId } = useParams();
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!surveyId) return;

      try {
        const data = await getSurveyResponsesForAdmin(surveyId);
        setResponses(data);
      } catch (error) {
        console.error("Load responses error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [surveyId]);

  async function handleDownload(audioPath: string) {
    try {
      setDownloadingPath(audioPath);
      const url = await downloadResponseAudio(audioPath);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download audio error:", error);
    } finally {
      setDownloadingPath(null);
    }
  }

  async function handleExportCSV() {
    if (!surveyId) return;

    try {
      setExporting(true);
      const csv = await exportSurveyResponsesAsCSV(surveyId);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `survey-responses-${surveyId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export CSV error:", error);
    } finally {
      setExporting(false);
    }
  }

  const groupedResponses = useMemo(() => {
    const grouped: Record<
      string,
      { respondent: ResponseItem["respondent"]; answers: ResponseItem[] }
    > = {};

    for (const item of responses) {
      const respondentId = item.respondent?.id || "unknown";

      if (!grouped[respondentId]) {
        grouped[respondentId] = {
          respondent: item.respondent,
          answers: [],
        };
      }

      grouped[respondentId].answers.push(item);
    }

    Object.values(grouped).forEach((group) => {
      group.answers.sort(
        (a, b) =>
          (a.question?.order_index || 0) - (b.question?.order_index || 0),
      );
    });

    return Object.entries(grouped);
  }, [responses]);

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Survey Responses
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review grouped respondent answers and export data from this
              survey.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
          >
            <FaFileCsv className="h-4 w-4" />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Loading responses...</p>
          </div>
        ) : groupedResponses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">No responses yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedResponses.map(([respondentId, group]) => (
              <div
                key={respondentId}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-4 w-4 text-cyan-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.respondent?.display_name ||
                          "Anonymous Respondent"}
                      </h3>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                        <span>{group.respondent?.email || "No email"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaPhone className="h-4 w-4 text-gray-400" />
                        <span>{group.respondent?.phone || "No phone"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                    {group.answers.length} response
                    {group.answers.length > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {group.answers.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FaMicrophoneAlt className="h-4 w-4 text-rose-600" />
                            <span>
                              Question #{item.question?.order_index || "—"}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-gray-900">
                            {item.question?.prompt || "No question found"}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>Duration: {item.duration_seconds || 0}s</span>
                            <span>Size: {item.file_size_bytes || 0} bytes</span>
                            <span>
                              {new Date(item.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center">
                          <button
                            onClick={() => handleDownload(item.audio_path)}
                            disabled={downloadingPath === item.audio_path}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-white disabled:opacity-60"
                          >
                            <FaDownload className="h-4 w-4" />
                            {downloadingPath === item.audio_path
                              ? "Preparing..."
                              : "Download VN"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
