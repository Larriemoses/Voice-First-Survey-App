import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/helpers";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

export function Chip({ active = false, children, className, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-3 text-sm font-medium transition-colors duration-150",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-gray-200 bg-white text-gray-500 hover:border-primary-200 hover:text-primary-600",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
