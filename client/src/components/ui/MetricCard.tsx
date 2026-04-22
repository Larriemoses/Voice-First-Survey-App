import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/helpers";

type MetricCardProps = {
  label: string;
  value: string;
  sub?: string;
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
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={cn("rounded-md bg-gray-100 px-4 py-3.5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gray-500">{label}</p>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trendDirection === "up" ? "bg-emerald-50 text-success" : "bg-red-50 text-danger",
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[22px] font-medium leading-none text-gray-900">{value}</p>
      {sub ? <p className="mt-2 text-xs text-gray-400">{sub}</p> : null}
    </div>
  );
}
