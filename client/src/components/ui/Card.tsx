import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

export type CardVariant = "default" | "elevated" | "flat" | "muted";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  hoverable?: boolean;
};

const variants: Record<CardVariant, string> = {
  default: "border-transparent bg-surface-card",
  elevated: "border-transparent bg-surface-card shadow-md",
  flat: "border-transparent bg-surface-card",
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
        "rounded-[24px] border p-5 text-text-primary transition-all duration-200",
        variants[variant],
        hoverable && variant !== "muted" ? "hover:-translate-y-1 hover:shadow-md" : "",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
