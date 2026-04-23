import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { cn } from "../../utils/helpers";

export type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Toggle({
  checked,
  className,
  type = "button",
  onClick,
  onCheckedChange,
  ...props
}: ToggleProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (!event.defaultPrevented) {
      onCheckedChange?.(!checked);
    }
  }

  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-brand-blue" : "bg-border",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-surface-card shadow-sm transition-transform duration-150",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
