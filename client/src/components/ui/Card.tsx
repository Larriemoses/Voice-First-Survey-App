import type { HTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "flat" | "muted";
};

const variants: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "border-gray-200 bg-white",
  elevated: "border-gray-200 bg-white shadow-sm",
  flat: "border-gray-200 bg-gray-50",
  muted: "border-transparent bg-gray-100",
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
        "rounded-lg border px-5 py-4 transition-shadow duration-150 hover:shadow-sm",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
