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
    <div className={cn("relative overflow-hidden rounded-[24px] bg-surface-muted px-5 py-5 transition-transform duration-200 hover:-translate-y-1 before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-[linear-gradient(90deg,#E60023,#FF5A5F,#FFB3B8)]", className)}>
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
      <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.04em] text-text-primary">
        {value}
      </p>
      {sub ? <p className="mt-3 text-xs leading-5 text-text-hint">{sub}</p> : null}
    </div>
  );
}
