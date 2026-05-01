import type { CSSProperties } from "react";
import { clamp, cn } from "../../utils/helpers";

export type ProgressBarProps = {
  value?: number;
  indeterminate?: boolean;
  visible?: boolean;
  label?: string;
  className?: string;
};

export function ProgressBar({
  value = 0,
  indeterminate = false,
  visible = true,
  label = "Loading",
  className,
}: ProgressBarProps) {
  if (!visible) {
    return null;
  }

  const safeValue = clamp(value, 0, 100);
  const progressStyle: CSSProperties = { width: `${safeValue}%` };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5 bg-brand-blue/10",
        className,
      )}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : safeValue}
    >
      {indeterminate ? (
        <div className="h-full w-1/3 animate-pulse rounded-full bg-brand-blue" />
      ) : (
        <div
          className="h-full rounded-full bg-brand-blue transition-[width] duration-300 ease-in-out"
          style={progressStyle}
        />
      )}
    </div>
  );
}
