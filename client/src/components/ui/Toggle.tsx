import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
};

export function Toggle({ checked, className, type = "button", ...props }: ToggleProps) {
  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative h-5 w-9 rounded-full transition-colors duration-150",
        checked ? "bg-primary-500" : "bg-gray-200",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150",
          checked ? "translate-x-[18px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
