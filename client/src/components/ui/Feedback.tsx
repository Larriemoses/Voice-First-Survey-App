import type { HTMLAttributes } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "../../utils/helpers";

type FeedbackProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

const styles = {
  success:
    "border-[color:color-mix(in_srgb,var(--color-success)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-success)_12%,var(--color-surface-raised))] text-[var(--color-success)]",
  error:
    "border-[color:color-mix(in_srgb,var(--color-danger)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-danger)_11%,var(--color-surface-raised))] text-[var(--color-danger)]",
  warning:
    "border-[color:color-mix(in_srgb,var(--color-warning)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-warning)_11%,var(--color-surface-raised))] text-[var(--color-warning)]",
  info: "border-[color:color-mix(in_srgb,var(--color-info)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-info)_12%,var(--color-surface-raised))] text-[var(--color-info)]",
};

export function Feedback({
  variant = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
  className,
  ...props
}: FeedbackProps) {
  const Icon = iconMap[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-[24px] border px-4 py-3",
        styles[variant],
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1 text-current transition hover:bg-black/5"
          aria-label="Dismiss feedback"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
