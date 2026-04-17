import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
};

const variants = {
  default:
    "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]",
  success:
    "border border-transparent bg-[color:color-mix(in_srgb,var(--color-success)_16%,transparent)] text-[var(--color-success)]",
  warning:
    "border border-transparent bg-[color:color-mix(in_srgb,var(--color-warning)_16%,transparent)] text-[var(--color-warning)]",
  danger:
    "border border-transparent bg-[color:color-mix(in_srgb,var(--color-danger)_14%,transparent)] text-[var(--color-danger)]",
  info: "border border-transparent bg-[color:color-mix(in_srgb,var(--color-info)_14%,transparent)] text-[var(--color-info)]",
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
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold",
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
