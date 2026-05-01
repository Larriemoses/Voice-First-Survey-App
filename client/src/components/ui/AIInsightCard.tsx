import type { CSSProperties, ReactNode } from "react";
import { clamp, cn } from "../../utils/helpers";

export type AIInsightCardProps = {
  icon?: ReactNode;
  title: string;
  body: ReactNode;
  confidence: number;
  className?: string;
};

export function AIInsightCard({
  icon,
  title,
  body,
  confidence,
  className,
}: AIInsightCardProps) {
  const safeConfidence = clamp(confidence, 0, 100);
  const progressStyle: CSSProperties = { width: `${safeConfidence}%` };

  return (
    <article
      className={cn(
        "rounded-lg border border-brand-orange-light border-l-2 border-l-brand-orange bg-brand-orange-light p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="mt-0.5 shrink-0 text-brand-orange-dark">{icon}</div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-text-primary">{title}</h3>
          <div className="mt-2 text-base text-text-secondary">{body}</div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Confidence</span>
              <span>{safeConfidence}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-brand-orange"
                style={progressStyle}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
