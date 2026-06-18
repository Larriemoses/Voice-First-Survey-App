import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

export type CardVariant = "default" | "elevated" | "flat" | "muted";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  hoverable?: boolean;
};

const variants: Record<CardVariant, string> = {
  default: "border-border/90 bg-surface-card",
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
        "rounded-xl border p-5 text-text-primary shadow-[0_1px_2px_rgba(30,30,70,0.025)] transition-all duration-200",
        variants[variant],
        hoverable && variant !== "muted" ? "hover:-translate-y-0.5 hover:border-brand-blue/15 hover:shadow-md" : "",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
