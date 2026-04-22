import { Tooltip } from "../ui/Tooltip";
import { cn } from "../../utils/helpers";

type QualityScoreProps = {
  score: number;
  rationale: string;
};

function tone(score: number) {
  if (score > 70) return "bg-success";
  if (score >= 40) return "bg-accent-500";
  return "bg-danger";
}

function width(score: number) {
  if (score >= 90) return "w-[90%]";
  if (score >= 80) return "w-4/5";
  if (score >= 70) return "w-[70%]";
  if (score >= 60) return "w-3/5";
  if (score >= 50) return "w-1/2";
  return "w-2/5";
}

export function QualityScore({ score, rationale }: QualityScoreProps) {
  return (
    <Tooltip content={rationale}>
      <div className="w-24">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
          <span>{score}</span>
          <span>/100</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div className={cn("h-full rounded-full", tone(score), width(score))} />
        </div>
      </div>
    </Tooltip>
  );
}
