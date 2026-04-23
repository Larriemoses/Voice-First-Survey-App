import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

export type BadgeVariant =
  | "active"
  | "draft"
  | "closed"
  | "done"
  | "pending"
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "error";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  dot?: boolean;
};

const variants: Record<BadgeVariant, string> = {
  active: "bg-status-success/10 text-status-success",
  draft: "bg-brand-orange-light text-brand-orange-dark",
  closed: "bg-surface-muted text-text-secondary",
  done: "bg-brand-blue-light text-brand-blue",
  pending: "bg-brand-orange-light text-brand-orange-dark",
  default: "bg-surface-muted text-text-secondary",
  success: "bg-status-success/10 text-status-success",
  warning: "bg-brand-orange-light text-brand-orange-dark",
  danger: "bg-status-danger/10 text-status-danger",
  info: "bg-brand-blue-light text-brand-blue",
  error: "bg-status-danger/10 text-status-danger",
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
        "inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-xs font-medium leading-[1.4]",
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
