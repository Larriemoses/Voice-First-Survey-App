import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AudioWaveform,
  Download,
  FileSpreadsheet,
  Headphones,
  Play,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import DashboardShell from "../components/DashboardShell";
import { supabase } from "../lib/supabase";
import {
  buildSurveyWorkbook,
  downloadResponseAudio,
  getSurveyResponsesForAdmin,
  type ResponseItem,
} from "../lib/responses";
import { formatDateTime, formatDuration } from "../utils/helpers";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import { Drawer } from "../components/ui/Drawer";
import { EmptyState } from "../components/ui/EmptyState";
import { Feedback } from "../components/ui/Feedback";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";

type GroupedResponseRow = {
  respondentId: string;
  respondent: ResponseItem["respondent"];
  answers: ResponseItem[];
};

type StatusFilter = "all" | "completed" | "processing" | "failed" | "pending";

function TranscriptStatusBadge({ status }: { status?: string | null }) {
  if (status === "completed") return <Badge variant="success" dot>Completed</Badge>;
  if (status === "processing") return <Badge variant="info" dot>Processing</Badge>;
  if (status === "failed") return <Badge variant="danger" dot>Failed</Badge>;
  return <Badge variant="warning" dot>Pending</Badge>;
}

export default function SurveyResponses() {
  const { surveyId } = useParams();

  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState<{
    variant: "success" | "error" | "info";
    title: string;
    description?: string;
  } | null>(null);
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAll, setProcessingAll] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [selectedRespondentId, setSelectedRespondentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function loadResponses() {
    if (!surveyId) return;

    try {
      setLoadError("");
      const data = await getSurveyResponsesForAdmin(surveyId);
      setResponses(data);
    } catch (error) {
      console.error("Load responses error:", error);
      setLoadError("We couldn't load your responses right now.");
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
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Download audio error:", err);
      setFeedback({
        variant: "error",
        title: "Audio download failed",
        description: "We couldn't fetch that recording right now.",
      });
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
      setFeedback({
        variant: "error",
        title: "Playback isn't ready",
        description: "We couldn't open that recording right now.",
      });
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
        setFeedback({
          variant: "error",
          title: "Your session expired",
          description: "Sign in again, then try processing this response one more time.",
        });
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
        setFeedback({
          variant: "error",
          title: "Transcription didn't start",
          description: error.message,
        });
        return;
      }

      setResponses((prev) =>
        prev.map((response) =>
          response.id === item.id
            ? { ...response, transcript_status: "processing" }
            : response,
        ),
      );

      setFeedback({
        variant: "success",
        title: "Transcription started",
        description: "We'll refresh this list in a few seconds.",
      });

      window.setTimeout(() => {
        void loadResponses();
      }, 4000);
    } catch (err) {
      console.error("Processing error:", err);
      setFeedback({
        variant: "error",
        title: "Transcription didn't start",
        description: "Please try again in a moment.",
      });
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
          item.transcript_status !== "completed",
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
        prev.map((response) => ({
          ...response,
          transcript_status:
            response.transcript_status === "completed"
              ? "completed"
              : "processing",
        })),
      );

      setFeedback({
        variant: "success",
        title: "Transcription kicked off",
        description: "We're processing the current set of recordings now.",
      });

      window.setTimeout(() => {
        void loadResponses();
      }, 5000);
    } catch (err) {
      console.error("Process all error:", err);
      setFeedback({
        variant: "error",
        title: "We couldn't process everything",
        description: "Try again in a moment.",
      });
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
      setFeedback({
        variant: "success",
        title: "Your export is ready",
        description: "The spreadsheet has been downloaded to your device.",
      });
    } catch (err) {
      console.error("Export Excel error:", err);
      setFeedback({
        variant: "error",
        title: "Export failed",
        description: "We couldn't build the spreadsheet right now.",
      });
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
        (left, right) =>
          (left.question?.order_index || 0) - (right.question?.order_index || 0),
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
  }, [groupedResponses.length, responses]);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return groupedResponses
      .map((group) => {
        const filteredAnswers =
          statusFilter === "all"
            ? group.answers
            : group.answers.filter((answer) => {
                const status = (answer.transcript_status || "pending") as StatusFilter;
                return status === statusFilter;
              });

        const matchesSearch =
          !term ||
          (group.respondent?.display_name || "").toLowerCase().includes(term) ||
          (group.respondent?.email || "").toLowerCase().includes(term) ||
          (group.respondent?.phone || "").toLowerCase().includes(term);

        if (!matchesSearch || filteredAnswers.length === 0) return null;

        return {
          ...group,
          answers: filteredAnswers,
        };
      })
      .filter(Boolean) as GroupedResponseRow[];
  }, [groupedResponses, searchTerm, statusFilter]);

  const selectedGroup =
    filteredGroups.find((group) => group.respondentId === selectedRespondentId) ||
    groupedResponses.find((group) => group.respondentId === selectedRespondentId) ||
    null;

  const processableCount = responses.filter(
    (item) =>
      item.audio_path &&
      item.transcript_status !== "processing" &&
      item.transcript_status !== "completed",
  ).length;

  const columns: Array<DataTableColumn<GroupedResponseRow>> = [
    {
      id: "respondent",
      header: "Respondent",
      sortValue: (group) => (group.respondent?.display_name || "anonymous").toLowerCase(),
      cell: (group) => (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {group.respondent?.display_name || "Anonymous respondent"}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {group.respondent?.phone || "No phone shared"}
          </p>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      sortValue: (group) => (group.respondent?.email || "").toLowerCase(),
      cell: (group) => (
        <span className="text-sm text-[var(--color-text-muted)]">
          {group.respondent?.email || "No email shared"}
        </span>
      ),
    },
    {
      id: "answers",
      header: "Answers",
      sortValue: (group) => group.answers.length,
      cell: (group) => (
        <span className="text-sm font-semibold text-[var(--color-text)]">
          {group.answers.length}
        </span>
      ),
    },
    {
      id: "transcripts",
      header: "Transcripts",
      sortValue: (group) =>
        group.answers.filter((item) => item.transcript_status === "completed").length,
      cell: (group) => (
        <span className="text-sm text-[var(--color-text-muted)]">
          {
            group.answers.filter((item) => item.transcript_status === "completed").length
          }{" "}
          completed
        </span>
      ),
    },
    {
      id: "duration",
      header: "Avg duration",
      sortValue: (group) =>
        group.answers.reduce((sum, item) => sum + (item.duration_seconds || 0), 0) /
        Math.max(group.answers.length, 1),
      cell: (group) => {
        const averageDuration =
          group.answers.length > 0
            ? Math.round(
                group.answers.reduce(
                  (sum, item) => sum + (item.duration_seconds || 0),
                  0,
                ) / group.answers.length,
              )
            : 0;

        return (
          <span className="text-sm text-[var(--color-text-muted)]">
            {formatDuration(averageDuration)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Details",
      cell: (group) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedRespondentId(group.respondentId)}
        >
          Open
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <DashboardShell>
      <PageHeader
        title="Survey Responses"
        subtitle="Review respondent answers, check transcription progress, and export what the team needs"
        backHref={`/surveys/${surveyId}`}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handleProcessAll}
              loading={processingAll}
              disabled={processableCount === 0}
              disabledReason="There aren't any pending recordings to transcribe"
              leadingIcon={!processingAll ? <Sparkles className="h-4 w-4" /> : undefined}
            >
              {processingAll ? "Starting transcription" : "Transcribe all"}
            </Button>
            <Button
              onClick={handleExportExcel}
              loading={exporting}
              leadingIcon={!exporting ? <FileSpreadsheet className="h-4 w-4" /> : undefined}
            >
              {exporting ? "Exporting responses" : "Export Excel"}
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        {feedback ? (
          <Feedback
            variant={feedback.variant}
            title={feedback.title}
            description={feedback.description}
            dismissible
            onDismiss={() => setFeedback(null)}
          />
        ) : null}

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="space-y-2 p-4 sm:space-y-3 sm:p-5">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-8 w-14 rounded-[18px] sm:h-9 sm:w-16 sm:rounded-[20px]" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </Card>
              ))}
            </div>
            <Card className="space-y-4">
              <Skeleton className="h-12 rounded-[20px]" />
              <Skeleton className="h-16 rounded-[24px]" />
              <Skeleton className="h-16 rounded-[24px]" />
            </Card>
          </div>
        ) : loadError ? (
          <Feedback
            variant="error"
            title="Your responses didn't load"
            description={loadError}
          />
        ) : groupedResponses.length === 0 ? (
          <EmptyState
            icon={<AudioWaveform className="h-6 w-6" />}
            title="No responses yet"
            description="Once respondents start answering, you'll see each voice response and transcript status here."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
              {[
                { label: "Respondents", value: analytics.totalRespondents, icon: Users },
                { label: "Responses", value: analytics.totalResponses, icon: AudioWaveform },
                { label: "Completed", value: analytics.completedTranscripts, icon: Sparkles },
                { label: "Processing", value: analytics.processingTranscripts, icon: Sparkles },
                { label: "Avg duration", value: formatDuration(analytics.avgDuration), icon: Headphones },
              ].map((card) => {
                const Icon = card.icon;

                return (
                  <Card key={card.label} className="space-y-2 p-4 sm:space-y-3 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] sm:text-xs">
                        {card.label}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)] sm:h-10 sm:w-10 sm:rounded-[18px]">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
                      {card.value}
                    </p>
                  </Card>
                );
              })}
            </div>

            <Card className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Search respondents"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone"
                leadingIcon={<Search className="h-4 w-4" />}
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-text)]">
                  Transcript status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                >
                  <option value="all">All statuses</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </Card>

            <DataTable
              data={filteredGroups}
              columns={columns}
              getRowId={(group) => group.respondentId}
              initialSort={{ id: "answers", direction: "desc" }}
              emptyState={
                <EmptyState
                  icon={<Search className="h-6 w-6" />}
                  title="No respondents match yet"
                  description="Try a different search or clear the status filter to see more responses."
                />
              }
              mobileCard={(group) => (
                <Card className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[var(--color-text)]">
                        {group.respondent?.display_name || "Anonymous respondent"}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {group.respondent?.email || "No email shared"}
                      </p>
                    </div>
                    <Badge variant="info">{group.answers.length} answers</Badge>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {
                        group.answers.filter((item) => item.transcript_status === "completed").length
                      }{" "}
                      transcript{group.answers.length === 1 ? "" : "s"} completed
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRespondentId(group.respondentId)}
                    >
                      Open
                    </Button>
                  </div>
                </Card>
              )}
            />
          </>
        )}
      </div>

      <Drawer
        open={!!selectedGroup}
        onClose={() => setSelectedRespondentId(null)}
        title={selectedGroup?.respondent?.display_name || "Anonymous respondent"}
        description={
          selectedGroup
            ? `${selectedGroup.respondent?.email || "No email shared"}${selectedGroup.respondent?.phone ? ` | ${selectedGroup.respondent.phone}` : ""}`
            : undefined
        }
      >
        <div className="space-y-4">
          {selectedGroup?.answers.map((item) => {
            const preferredPath = item.audio_path_mp3 || item.audio_path;
            const isPlaying = playingId === item.id;
            const isProcessing = processingId === item.id;

            return (
              <Card key={item.id} variant="flat" className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <Badge variant="info">Question {item.question?.order_index || "-"}</Badge>
                    <p className="text-base font-semibold text-[var(--color-text)]">
                      {item.question?.prompt || "No question found"}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {formatDuration(item.duration_seconds || 0)} | {formatDateTime(item.created_at)}
                    </p>
                  </div>
                  <TranscriptStatusBadge status={item.transcript_status} />
                </div>

                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Transcript
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                    {item.transcript?.trim()
                      ? item.transcript
                      : item.transcript_status === "processing"
                        ? "We're processing this recording now."
                        : "This answer hasn't been transcribed yet."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() => handlePlay(item)}
                    leadingIcon={<Play className="h-4 w-4" />}
                  >
                    {isPlaying ? "Hide playback" : "Play answer"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownload(preferredPath)}
                    loading={downloadingPath === preferredPath}
                    leadingIcon={downloadingPath !== preferredPath ? <Download className="h-4 w-4" /> : undefined}
                  >
                    Download audio
                  </Button>
                  <Button
                    onClick={() => handleProcess(item)}
                    loading={isProcessing}
                    disabled={item.transcript_status === "processing"}
                    disabledReason="This response is already processing"
                    leadingIcon={!isProcessing ? <Sparkles className="h-4 w-4" /> : undefined}
                  >
                    {isProcessing ? "Starting transcription" : "Transcribe answer"}
                  </Button>
                </div>

                {isPlaying && playingUrl ? (
                  <audio controls className="w-full">
                    <source src={playingUrl} />
                    Your browser does not support audio playback.
                  </audio>
                ) : null}
              </Card>
            );
          })}
        </div>
      </Drawer>
    </DashboardShell>
  );
}
