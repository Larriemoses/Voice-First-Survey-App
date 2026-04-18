import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "flat";
};

const variants = {
  default: "border border-[var(--border)] bg-[var(--surface)]",
  elevated: "border border-[var(--border)] bg-[var(--surface)] shadow-sm",
  flat:
    "border border-[var(--border-sub)] bg-[color:color-mix(in_srgb,var(--surface)_72%,var(--bg))]",
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
        "rounded-xl p-5 sm:p-6",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
