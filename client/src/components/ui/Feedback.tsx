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
    "border-[color:color-mix(in_srgb,var(--success)_18%,var(--border))] bg-[color:color-mix(in_srgb,var(--success)_6%,var(--surface))] text-[var(--success)]",
  error:
    "border-[color:color-mix(in_srgb,var(--danger)_18%,var(--border))] bg-[color:color-mix(in_srgb,var(--danger)_6%,var(--surface))] text-[var(--danger)]",
  warning:
    "border-[color:color-mix(in_srgb,var(--warning)_18%,var(--border))] bg-[color:color-mix(in_srgb,var(--warning)_6%,var(--surface))] text-[var(--warning)]",
  info:
    "border-[color:color-mix(in_srgb,var(--accent)_18%,var(--border))] bg-[color:color-mix(in_srgb,var(--accent)_6%,var(--surface))] text-[var(--accent)]",
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
        "flex gap-3 rounded-xl border px-4 py-3",
        styles[variant],
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
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
