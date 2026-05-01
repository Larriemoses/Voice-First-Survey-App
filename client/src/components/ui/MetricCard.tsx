import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../utils/helpers";

export type MetricCardProps = {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  trend?: string;
  trendDirection?: "up" | "down";
  className?: string;
};

export function MetricCard({
  label,
  value,
  sub,
  trend,
  trendDirection = "up",
  className,
}: MetricCardProps) {
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  return (
    <div className={cn("rounded-md bg-surface-muted px-4 py-3.5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-text-secondary">{label}</p>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-xs font-medium leading-[1.4]",
              trendDirection === "up"
                ? "bg-status-success/10 text-status-success"
                : "bg-status-danger/10 text-status-danger",
            )}
          >
            <TrendIcon className="h-3 w-3" aria-hidden />
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[22px] font-medium leading-none text-text-primary">
        {value}
      </p>
      {sub ? <p className="mt-2 text-xs text-text-hint">{sub}</p> : null}
    </div>
  );
}
