import { useEffect, useRef, useState } from "react";
import {
  AudioWaveform,
  CheckCircle2,
  Mic,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/button";
import { Card } from "./ui/Card";
import { Feedback } from "./ui/Feedback";

type AudioRecorderProps = {
  maxDurationSeconds?: number;
  onRecorded: (
    audioBlob: Blob | null,
    audioUrl: string | null,
    duration: number,
  ) => void;
};

export default function AudioRecorder({
  maxDurationSeconds = 120,
  onRecorded,
}: AudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  function cleanupStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      cleanupStream();

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [audioUrl]);

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function formatTime(totalSeconds: number) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  async function startRecording() {
    try {
      setError("");

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      clearTimer();
      cleanupStream();

      setAudioUrl(null);
      setAudioBlob(null);
      setSeconds(0);
      onRecorded(null, null, 0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalDuration = seconds;

        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);
        onRecorded(blob, url, finalDuration);

        cleanupStream();
        mediaRecorderRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;

          if (next >= maxDurationSeconds) {
            stopRecording();
            return maxDurationSeconds;
          }

          return next;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Microphone access was denied or unavailable.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    clearTimer();
  }

  function resetRecording() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    clearTimer();
    cleanupStream();

    setIsRecording(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setSeconds(0);
    setError("");
    chunksRef.current = [];
    mediaRecorderRef.current = null;

    onRecorded(null, null, 0);
  }

  const hasRecording = !!audioBlob;
  const segments = 10;
  const filledSegments = Math.min(
    segments,
    Math.max(0, Math.ceil((seconds / maxDurationSeconds) * segments)),
  );

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
            <AudioWaveform className="h-3.5 w-3.5 text-[var(--color-info)]" />
            Voice recorder
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Speak naturally. You can re-record before you continue.
          </p>
        </div>

        <Badge
          variant={isRecording ? "danger" : hasRecording ? "success" : "info"}
          dot
        >
          {isRecording
            ? "Recording now"
            : hasRecording
              ? "Answer saved"
              : "Ready to record"}
        </Badge>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="w-full sm:w-auto"
            leadingIcon={<Mic className="h-4 w-4" />}
            variant={hasRecording ? "secondary" : "primary"}
          >
            {hasRecording ? "Record again" : "Start recording"}
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="w-full sm:w-auto"
            leadingIcon={<Square className="h-4 w-4" />}
            variant="danger"
          >
            Stop recording
          </Button>
        )}

        {hasRecording ? (
          <Button
            onClick={resetRecording}
            className="w-full sm:w-auto"
            leadingIcon={<RotateCcw className="h-4 w-4" />}
            variant="ghost"
          >
            Clear answer
          </Button>
        ) : null}
      </div>

      <Card className="space-y-4 rounded-[24px]" variant="flat">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Recording time
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
              {formatTime(seconds)} / {formatTime(maxDurationSeconds)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            {isRecording ? (
              <p className="text-sm font-medium text-[var(--color-danger)]">
                Recording your answer
              </p>
            ) : hasRecording ? (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-success)]">
                <CheckCircle2 className="h-4 w-4" />
                Your answer is ready
              </p>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">
                Start when you're ready.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: segments }, (_, index) => (
            <div
              key={index}
              className={[
                "h-2 rounded-full transition-colors duration-200",
                index < filledSegments
                  ? isRecording
                    ? "bg-[var(--color-danger)]"
                    : "bg-[var(--color-primary)]"
                  : "bg-[var(--color-border)]",
              ].join(" ")}
            />
          ))}
        </div>
      </Card>

      {audioUrl ? (
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
            <Play className="h-4 w-4" />
            Playback
          </div>

          <audio controls className="w-full">
            <source src={audioUrl} />
            Your browser does not support audio playback.
          </audio>
        </Card>
      ) : null}

      {error ? (
        <Feedback
          variant="error"
          title="Your microphone isn't available yet"
          description={error}
        />
      ) : null}
    </Card>
  );
}
