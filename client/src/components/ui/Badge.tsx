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

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  dot?: boolean;
};

const variants: Record<BadgeVariant, string> = {
  active: "bg-emerald-50 text-success",
  draft: "bg-accent-50 text-accent-700",
  closed: "bg-gray-100 text-gray-500",
  done: "bg-primary-50 text-primary-700",
  pending: "bg-accent-50 text-accent-700",
  default: "bg-gray-100 text-gray-500",
  success: "bg-emerald-50 text-success",
  warning: "bg-accent-50 text-accent-700",
  danger: "bg-red-50 text-danger",
  error: "bg-red-50 text-danger",
  info: "bg-primary-50 text-primary-700",
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
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium leading-5",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden /> : null}
      {children}
    </span>
  );
}
