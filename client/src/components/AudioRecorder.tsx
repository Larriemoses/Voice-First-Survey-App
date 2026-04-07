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
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  function cleanupStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  async function startRecording() {
    try {
      setError("");

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

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
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);
        onRecorded(blob, url, seconds);
        cleanupStream();
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;

          if (next >= maxDurationSeconds) {
            stopRecording();
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
      setIsRecording(false);
    }

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function resetRecording() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl(null);
    setAudioBlob(null);
    setSeconds(0);
    setError("");
    onRecorded(null, null, 0);
  }

  const hasRecording = !!audioBlob;

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            <FaMicrophone className="h-4 w-4" />
            {hasRecording ? "Record Again" : "Start Recording"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            <FaStop className="h-4 w-4" />
            Stop Recording
          </button>
        )}

        {hasRecording ? (
          <button
            type="button"
            onClick={resetRecording}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FaRedo className="h-4 w-4" />
            Re-record
          </button>
        ) : null}
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-500">
          Recording time:{" "}
          <span className="font-medium text-gray-900">
            {seconds}s / {maxDurationSeconds}s
          </span>
        </p>

        {isRecording ? (
          <p className="mt-2 text-sm font-medium text-rose-600">
            Recording in progress...
          </p>
        ) : hasRecording ? (
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-green-600">
            <FaCheckCircle className="h-4 w-4" />
            Recording saved. You can review it below.
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Record your answer before moving to the next question.
          </p>
        )}
      </div>

      {audioUrl ? (
        <div className="space-y-2 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}
    </div>
  );
}
