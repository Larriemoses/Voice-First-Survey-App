import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
};

const variants = {
  default:
    "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]",
  success:
    "border border-[color:color-mix(in_srgb,var(--success)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--success)_10%,transparent)] text-[var(--success)]",
  warning:
    "border border-[color:color-mix(in_srgb,var(--warning)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--warning)_10%,transparent)] text-[var(--warning)]",
  danger:
    "border border-[color:color-mix(in_srgb,var(--danger)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]",
  info:
    "border border-[color:color-mix(in_srgb,var(--accent)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]",
};

export function Badge({
  className,
  children,
  variant = "default",
  dot = false,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      ) : null}
      {children}
    </span>
  );
}
