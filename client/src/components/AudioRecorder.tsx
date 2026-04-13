import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaStop,
  FaPlay,
  FaRedo,
  FaCheckCircle,
} from "react-icons/fa";

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

  function cleanupStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

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
  const progress = Math.min((seconds / maxDurationSeconds) * 100, 100);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700 sm:w-auto"
          >
            <FaMicrophone className="h-4 w-4" />
            {hasRecording ? "Record Again" : "Start Recording"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-black sm:w-auto"
          >
            <FaStop className="h-4 w-4" />
            Stop Recording
          </button>
        )}

        {hasRecording ? (
          <button
            type="button"
            onClick={resetRecording}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <FaRedo className="h-4 w-4" />
            Re-record
          </button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Recording time</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {formatTime(seconds)} / {formatTime(maxDurationSeconds)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            {isRecording ? (
              <p className="text-sm font-medium text-rose-600">
                Recording in progress...
              </p>
            ) : hasRecording ? (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                <FaCheckCircle className="h-4 w-4" />
                Recording saved
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Record your answer before moving on.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isRecording ? "bg-rose-600" : "bg-[#0B4EA2]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {audioUrl ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <FaPlay className="h-4 w-4" />
            Playback
          </div>

          <audio controls className="w-full">
            <source src={audioUrl} />
            Your browser does not support audio playback.
          </audio>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}
    </div>
  );
}
