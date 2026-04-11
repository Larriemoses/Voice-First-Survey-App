import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaDownload,
  FaFileCsv,
  FaEnvelope,
  FaPlay,
  FaBolt,
  FaUser,
  FaClock,
  FaWaveSquare,
} from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import { supabase } from "../lib/supabase";
import {
  downloadResponseAudio,
  exportSurveyResponsesAsCSV,
  getSurveyResponsesForAdmin,
  type ResponseItem,
} from "../lib/responses";

type GroupedResponses = Record<
  string,
  {
    respondent: ResponseItem["respondent"];
    answers: ResponseItem[];
  }
>;

export default function SurveyResponses() {
  const { surveyId } = useParams();
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  async function loadResponses() {
    if (!surveyId) return;

    try {
      setLoadError("");
      const data = await getSurveyResponsesForAdmin(surveyId);
      setResponses(data);
    } catch (error) {
      console.error("Load responses error:", error);
      setLoadError("Failed to load responses.");
    }
  }

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        await loadResponses();
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [surveyId]);

  async function handleDownload(audioPath: string) {
    try {
      setDownloadingPath(audioPath);
      const url = await downloadResponseAudio(audioPath);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Download audio error:", err);
    } finally {
      setDownloadingPath(null);
    }
  }

  async function handlePlay(item: ResponseItem) {
    try {
      if (playingId === item.id) {
        setPlayingId(null);
        setPlayingUrl(null);
        return;
      }

      const preferredPath = item.audio_path_mp3 || item.audio_path;
      const url = await downloadResponseAudio(preferredPath);
      setPlayingId(item.id);
      setPlayingUrl(url);
    } catch (err) {
      console.error("Play audio error:", err);
    }
  }

  async function handleProcess(item: ResponseItem) {
    try {
      setProcessingId(item.id);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      const { error } = await supabase.functions.invoke("process-audio", {
        body: {
          responseId: item.id,
          audioPath: item.audio_path,
        },
      });

      if (error) {
        console.error("Edge Function Error:", error);
        alert(`Error: ${error.message}`);
        return;
      }

      setResponses((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, transcript_status: "processing" } : r,
        ),
      );

      setTimeout(loadResponses, 4000);
    } catch (err) {
      console.error("Processing error:", err);
    } finally {
      setProcessingId(null);
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
      link.download = `survica-survey-${surveyId}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export CSV error:", err);
    } finally {
      setExporting(false);
    }
  }

  const groupedResponses = useMemo(() => {
    const grouped: GroupedResponses = {};

    for (const item of responses) {
      const id = item.respondent?.id || "unknown";

      if (!grouped[id]) {
        grouped[id] = {
          respondent: item.respondent,
          answers: [],
        };
      }

      grouped[id].answers.push(item);
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FaWaveSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Survey Responses
                </h2>
                <p className="text-sm text-gray-500">
                  Review recordings, generate transcripts, and export structured
                  data.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
          >
            <FaFileCsv className="h-4 w-4" />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Loading responses...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : groupedResponses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">No responses yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedResponses.map(([id, group]) => (
              <div
                key={id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FaUser className="h-4 w-4 text-cyan-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {group.respondent?.display_name ||
                            "Anonymous Respondent"}
                        </h3>
                      </div>

                      <p className="flex items-center gap-2 text-sm text-gray-500">
                        <FaEnvelope className="h-4 w-4" />
                        {group.respondent?.email || "No email"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
                      {group.answers.length} response
                      {group.answers.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {group.answers.map((item) => {
                    const preferredPath =
                      item.audio_path_mp3 || item.audio_path;
                    const isPlaying = playingId === item.id;
                    const isProcessing = processingId === item.id;
                    const transcriptStatus =
                      item.transcript_status || "pending";

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                      >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="space-y-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Question #{item.question?.order_index || "—"}
                              </p>
                              <p className="text-base font-semibold leading-relaxed text-gray-900">
                                {item.question?.prompt || "No question found"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <span className="inline-flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                {item.duration_seconds || 0}s
                              </span>
                              <span>{item.file_size_bytes || 0} bytes</span>
                              <span>
                                {new Date(item.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                              onClick={() => handlePlay(item)}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              <FaPlay className="h-4 w-4" />
                              {isPlaying ? "Hide Player" : "Play"}
                            </button>

                            <button
                              onClick={() => handleDownload(preferredPath)}
                              disabled={downloadingPath === preferredPath}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                            >
                              <FaDownload className="h-4 w-4" />
                              {downloadingPath === preferredPath
                                ? "Preparing..."
                                : "Download"}
                            </button>

                            <button
                              onClick={() => handleProcess(item)}
                              disabled={
                                isProcessing ||
                                transcriptStatus === "processing"
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
                            >
                              <FaBolt className="h-4 w-4" />
                              {isProcessing
                                ? "Processing..."
                                : transcriptStatus === "completed"
                                  ? "Reprocess"
                                  : transcriptStatus === "processing"
                                    ? "Processing..."
                                    : "Process"}
                            </button>
                          </div>
                        </div>

                        {isPlaying && playingUrl && (
                          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
                            <audio
                              controls
                              src={playingUrl}
                              className="w-full"
                            />
                          </div>
                        )}

                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900">
                              Transcript
                            </h4>
                            <span
                              className={[
                                "rounded-full px-3 py-1 text-xs font-medium capitalize",
                                transcriptStatus === "completed"
                                  ? "bg-green-50 text-green-700"
                                  : transcriptStatus === "processing"
                                    ? "bg-blue-50 text-blue-700"
                                    : transcriptStatus === "failed"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-gray-100 text-gray-600",
                              ].join(" ")}
                            >
                              {transcriptStatus}
                            </span>
                          </div>

                          {transcriptStatus === "completed" ? (
                            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-700">
                              {item.transcript ||
                                "Transcript completed but empty."}
                            </div>
                          ) : transcriptStatus === "processing" ? (
                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                              Processing transcript...
                            </div>
                          ) : transcriptStatus === "failed" ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                              Transcript failed. Try again.
                            </div>
                          ) : (
                            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-400">
                              No transcript yet.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
