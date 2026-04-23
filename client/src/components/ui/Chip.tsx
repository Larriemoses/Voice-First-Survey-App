import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/helpers";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

export function Chip({
  active = false,
  children,
  className,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 text-sm font-medium leading-[1.4] transition-colors duration-150",
        active
          ? "border-brand-blue bg-brand-blue-light text-brand-blue"
          : "border-border bg-surface-card text-text-secondary hover:border-border-strong hover:bg-surface-muted hover:text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
