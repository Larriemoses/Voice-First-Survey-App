import { Mic } from "lucide-react";
import { cn } from "../../utils/helpers";

type RecordButtonProps = {
  recording: boolean;
  onStart: () => void;
  onStop: () => void;
};

export function RecordButton({ recording, onStart, onStop }: RecordButtonProps) {
  return (
    <div className="flex flex-col items-center py-8">
      <button
        type="button"
        onPointerDown={onStart}
        onPointerUp={onStop}
        onPointerLeave={recording ? onStop : undefined}
        onKeyDown={(event) => {
          if ((event.key === " " || event.key === "Enter") && !recording) {
            onStart();
          }
        }}
        onKeyUp={(event) => {
          if ((event.key === " " || event.key === "Enter") && recording) {
            onStop();
          }
        }}
        className={cn(
          "relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-accent-500 text-white hover:bg-accent-600",
          recording ? "record-pulse" : "",
        )}
        aria-label="Record voice answer"
      >
        <Mic className="relative z-10 h-8 w-8" />
      </button>
      <p className="mt-4 text-base text-gray-500">
        {recording ? "Recording... release to stop" : "Tap and hold to record"}
      </p>
    </div>
  );
}
