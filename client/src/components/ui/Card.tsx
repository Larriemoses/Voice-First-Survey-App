import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "flat";
};

const variants = {
  default:
    "border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-sm",
  elevated:
    "border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-md",
  flat: "border border-[var(--color-border-subtle)] bg-[var(--color-surface)]",
};

export function Card({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] p-5 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 sm:p-6",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
