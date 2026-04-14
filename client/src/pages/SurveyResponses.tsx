import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaDownload,
  FaFileExcel,
  FaEnvelope,
  FaPlay,
  FaBolt,
  FaUser,
  FaUsers,
  FaClock,
  FaWaveSquare,
  FaChevronDown,
  FaChevronUp,
  FaChartBar,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import DashboardShell from "../components/DashboardShell";
import { supabase } from "../lib/supabase";
import {
  buildSurveyWorkbook,
  downloadResponseAudio,
  getSurveyResponsesForAdmin,
  type ResponseItem,
} from "../lib/responses";

type GroupedResponseRow = {
  respondentId: string;
  respondent: ResponseItem["respondent"];
  answers: ResponseItem[];
};

export default function SurveyResponses() {
  const { surveyId } = useParams();

  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAll, setProcessingAll] = useState(false);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const [expandedRespondents, setExpandedRespondents] = useState<
    Record<string, boolean>
  >({});

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

  async function handleProcessAll() {
    try {
      setProcessingAll(true);

      const pendingItems = responses.filter(
        (item) =>
          item.audio_path &&
          item.transcript_status !== "processing" &&
          processingId !== item.id,
      );

      for (const item of pendingItems) {
        const { error } = await supabase.functions.invoke("process-audio", {
          body: {
            responseId: item.id,
            audioPath: item.audio_path,
          },
        });

        if (error) {
          console.error(`Process all failed for response ${item.id}:`, error);
        }
      }

      setResponses((prev) =>
        prev.map((r) => ({
          ...r,
          transcript_status:
            r.transcript_status === "completed" ? "completed" : "processing",
        })),
      );

      setTimeout(loadResponses, 5000);
    } catch (err) {
      console.error("Process all error:", err);
    } finally {
      setProcessingAll(false);
    }
  }

  async function handleExportExcel() {
    try {
      setExporting(true);

      const { workbook, fileName } = buildSurveyWorkbook({
        surveyTitle: `Survey ${surveyId || "Responses"}`,
        responses,
      });

      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error("Export Excel error:", err);
    } finally {
      setExporting(false);
    }
  }

  const groupedResponses = useMemo<GroupedResponseRow[]>(() => {
    const grouped: Record<string, GroupedResponseRow> = {};

    for (const item of responses) {
      const respondentId = item.respondent?.id || `unknown-${item.id}`;

      if (!grouped[respondentId]) {
        grouped[respondentId] = {
          respondentId,
          respondent: item.respondent,
          answers: [],
        };
      }

      grouped[respondentId].answers.push(item);
    }

    const rows = Object.values(grouped);

    rows.forEach((group) => {
      group.answers.sort(
        (a, b) =>
          (a.question?.order_index || 0) - (b.question?.order_index || 0),
      );
    });

    return rows;
  }, [responses]);

  const analytics = useMemo(() => {
    const totalResponses = responses.length;
    const totalRespondents = groupedResponses.length;
    const completedTranscripts = responses.filter(
      (item) => item.transcript_status === "completed",
    ).length;
    const processingTranscripts = responses.filter(
      (item) => item.transcript_status === "processing",
    ).length;

    const avgDuration =
      responses.length > 0
        ? Math.round(
            responses.reduce(
              (sum, item) => sum + (item.duration_seconds || 0),
              0,
            ) / responses.length,
          )
        : 0;

    return {
      totalResponses,
      totalRespondents,
      completedTranscripts,
      processingTranscripts,
      avgDuration,
    };
  }, [responses, groupedResponses]);

  function toggleExpanded(respondentId: string) {
    setExpandedRespondents((prev) => ({
      ...prev,
      [respondentId]: !prev[respondentId],
    }));
  }

  function getTranscriptStatusLabel(status?: string | null) {
    if (status === "completed") return "Completed";
    if (status === "processing") return "Processing";
    if (status === "failed") return "Failed";
    return "Pending";
  }

  function getTranscriptStatusClass(status?: string | null) {
    if (status === "completed") return "bg-green-50 text-green-700";
    if (status === "processing") return "bg-blue-50 text-blue-700";
    if (status === "failed") return "bg-red-50 text-red-700";
    return "bg-gray-100 text-gray-600";
  }

  return (
    <DashboardShell>
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#0B4EA2]">
                <FaWaveSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Survey Responses
                </h2>
                <p className="text-sm text-slate-500">
                  Review respondent answers, transcripts, and exports in one
                  place.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={handleProcessAll}
              disabled={processingAll || responses.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <FaBolt className="h-4 w-4" />
              {processingAll ? "Processing All..." : "Transcribe All"}
            </button>

            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
            >
              <FaFileExcel className="h-4 w-4" />
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">Loading responses...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : groupedResponses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">No responses yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FaUsers className="h-4 w-4 text-[#0B4EA2]" />
                  <p className="text-sm text-slate-500">Respondents</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {analytics.totalRespondents}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FaWaveSquare className="h-4 w-4 text-[#F56A00]" />
                  <p className="text-sm text-slate-500">Responses</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {analytics.totalResponses}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FaBolt className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-slate-500">Transcribed</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {analytics.completedTranscripts}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FaChartBar className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-slate-500">Processing</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {analytics.processingTranscripts}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FaClock className="h-4 w-4 text-slate-600" />
                  <p className="text-sm text-slate-500">Avg Duration</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {analytics.avgDuration}s
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Respondent
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Answers
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Completed Transcripts
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Avg Duration
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {groupedResponses.map((group) => {
                      const isExpanded =
                        !!expandedRespondents[group.respondentId];
                      const completedCount = group.answers.filter(
                        (item) => item.transcript_status === "completed",
                      ).length;
                      const averageDuration =
                        group.answers.length > 0
                          ? Math.round(
                              group.answers.reduce(
                                (sum, item) =>
                                  sum + (item.duration_seconds || 0),
                                0,
                              ) / group.answers.length,
                            )
                          : 0;

                      return (
                        <>
                          <tr
                            key={group.respondentId}
                            className="align-top transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B4EA2]">
                                  <FaUser className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {group.respondent?.display_name ||
                                      "Anonymous Respondent"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {group.respondent?.phone || "No phone"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {group.respondent?.email || "No email"}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-slate-900">
                              {group.answers.length}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-slate-900">
                              {completedCount}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {averageDuration}s
                            </td>

                            <td className="px-4 py-4 text-right">
                              <button
                                onClick={() =>
                                  toggleExpanded(group.respondentId)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                              >
                                {isExpanded ? (
                                  <>
                                    Hide
                                    <FaChevronUp className="h-3.5 w-3.5" />
                                  </>
                                ) : (
                                  <>
                                    View
                                    <FaChevronDown className="h-3.5 w-3.5" />
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>

                          {isExpanded ? (
                            <tr className="bg-slate-50/50">
                              <td colSpan={6} className="px-4 py-4">
                                <div className="space-y-4">
                                  {group.answers.map((item) => {
                                    const preferredPath =
                                      item.audio_path_mp3 || item.audio_path;
                                    const isPlaying = playingId === item.id;
                                    const isProcessing =
                                      processingId === item.id;
                                    const transcriptStatus =
                                      item.transcript_status || "pending";

                                    return (
                                      <div
                                        key={item.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-4"
                                      >
                                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                          <div className="min-w-0 flex-1 space-y-3">
                                            <div className="space-y-1">
                                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Question #
                                                {item.question?.order_index ||
                                                  "—"}
                                              </p>
                                              <p className="text-base font-semibold leading-relaxed text-slate-900">
                                                {item.question?.prompt ||
                                                  "No question found"}
                                              </p>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                              <span className="inline-flex items-center gap-1">
                                                <FaClock className="h-3 w-3" />
                                                {item.duration_seconds || 0}s
                                              </span>
                                              <span>
                                                {new Date(
                                                  item.created_at,
                                                ).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex shrink-0 flex-wrap gap-2">
                                            <button
                                              onClick={() => handlePlay(item)}
                                              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                              <FaPlay className="h-4 w-4" />
                                              {isPlaying
                                                ? "Hide Player"
                                                : "Play"}
                                            </button>

                                            <button
                                              onClick={() =>
                                                handleDownload(preferredPath)
                                              }
                                              disabled={
                                                downloadingPath ===
                                                preferredPath
                                              }
                                              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                            >
                                              <FaDownload className="h-4 w-4" />
                                              {downloadingPath === preferredPath
                                                ? "Preparing..."
                                                : "Download"}
                                            </button>

                                            <button
                                              onClick={() =>
                                                handleProcess(item)
                                              }
                                              disabled={
                                                isProcessing ||
                                                transcriptStatus ===
                                                  "processing"
                                              }
                                              className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#093E81] disabled:opacity-60"
                                            >
                                              <FaBolt className="h-4 w-4" />
                                              {isProcessing
                                                ? "Processing..."
                                                : transcriptStatus ===
                                                    "completed"
                                                  ? "Reprocess"
                                                  : transcriptStatus ===
                                                      "processing"
                                                    ? "Processing..."
                                                    : "Process"}
                                            </button>
                                          </div>
                                        </div>

                                        {isPlaying && playingUrl && (
                                          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <audio
                                              controls
                                              src={playingUrl}
                                              className="w-full"
                                            />
                                          </div>
                                        )}

                                        <div className="mt-4">
                                          <div className="mb-2 flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-slate-900">
                                              Transcript
                                            </h4>
                                            <span
                                              className={`rounded-full px-3 py-1 text-xs font-medium ${getTranscriptStatusClass(
                                                transcriptStatus,
                                              )}`}
                                            >
                                              {getTranscriptStatusLabel(
                                                transcriptStatus,
                                              )}
                                            </span>
                                          </div>

                                          {transcriptStatus === "completed" ? (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                                              {item.transcript ||
                                                "Transcript completed but empty."}
                                            </div>
                                          ) : transcriptStatus ===
                                            "processing" ? (
                                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                                              Processing transcript...
                                            </div>
                                          ) : transcriptStatus === "failed" ? (
                                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                              Transcript failed. Try again.
                                            </div>
                                          ) : (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-400">
                                              No transcript yet.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
