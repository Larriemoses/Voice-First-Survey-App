import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

export type CardVariant = "default" | "elevated" | "flat" | "muted";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  hoverable?: boolean;
};

const variants: Record<CardVariant, string> = {
  default: "bg-surface-card shadow-sm",
  elevated: "bg-surface-card shadow-md",
  flat: "bg-surface-card",
  muted: "bg-surface-muted",
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
        "rounded-xl p-6 text-text-primary transition-[box-shadow,transform] duration-200",
        variants[variant],
        hoverable && variant !== "muted" ? "hover:-translate-y-0.5 hover:shadow-md" : "",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
