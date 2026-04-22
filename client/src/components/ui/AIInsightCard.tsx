import type { ReactNode } from "react";
import { cn } from "../../utils/helpers";

type AIInsightCardProps = {
  icon?: ReactNode;
  title: string;
  body: string;
  confidence: number;
  className?: string;
};

function confidenceWidth(value: number) {
  if (value >= 90) return "w-[90%]";
  if (value >= 80) return "w-4/5";
  if (value >= 70) return "w-[70%]";
  if (value >= 60) return "w-3/5";
  if (value >= 50) return "w-1/2";
  return "w-2/5";
}

export function AIInsightCard({ icon, title, body, confidence, className }: AIInsightCardProps) {
  return (
    <article className={cn("rounded-lg border-l-2 border-accent-500 bg-accent-50 p-4", className)}>
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 text-accent-600">{icon}</div> : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-base leading-6 text-gray-700">{body}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Confidence</span>
              <span>{confidence}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-accent-100">
              <div className={cn("h-full rounded-full bg-accent-500", confidenceWidth(confidence))} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
