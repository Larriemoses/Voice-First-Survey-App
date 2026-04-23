import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

export type CardVariant = "default" | "elevated" | "flat" | "muted";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  hoverable?: boolean;
};

const variants: Record<CardVariant, string> = {
  default: "border-border bg-surface-card",
  elevated: "border-border bg-surface-card shadow-md",
  flat: "border-border bg-surface-card",
  muted: "border-transparent bg-surface-muted",
};

export function Card({
  children,
  className,
  variant = "default",
  hoverable = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 text-text-primary transition-shadow duration-150",
        variants[variant],
        hoverable && variant !== "muted" ? "hover:shadow-sm" : "",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
