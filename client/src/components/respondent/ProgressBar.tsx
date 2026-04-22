import { cn } from "../../utils/helpers";

type ProgressBarProps = {
  current: number;
  total: number;
};

function fillWidth(current: number, total: number) {
  const percentage = Math.round((current / total) * 100);
  if (percentage >= 100) return "w-full";
  if (percentage >= 75) return "w-3/4";
  if (percentage >= 50) return "w-1/2";
  if (percentage >= 25) return "w-1/4";
  return "w-[10%]";
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="px-5 py-3">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>Question {current} of {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-gray-200">
        <div className={cn("h-full rounded-full bg-primary-500 transition-all duration-300 ease-in-out", fillWidth(current, total))} />
      </div>
    </div>
  );
}
