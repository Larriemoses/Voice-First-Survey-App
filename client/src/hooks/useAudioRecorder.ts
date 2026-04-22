import { useCallback, useRef, useState } from "react";

export function useAudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorder.onstop = () => {
      setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
      stream.getTracks().forEach((track) => track.stop());
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  return { recording, audioBlob, startRecording, stopRecording };
}
