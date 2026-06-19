import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/helpers";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: string;
  containerClassName?: string;
};

export function Select({
  label,
  helperText,
  error,
  containerClassName,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id || props.name || generatedId;
  const messageId = `${fieldId}-message`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? messageId : undefined}
          className={cn(
            "h-12 w-full appearance-none rounded-2xl border bg-surface-muted px-4 pr-10 text-base text-text-primary transition-[background-color,box-shadow] duration-150 outline-none focus:bg-white focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:text-text-hint",
            error ? "border-status-danger" : "border-transparent",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-hint"
          aria-hidden
        />
      </div>
      {error ? (
        <p id={messageId} className="text-sm text-status-danger">
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className="text-sm text-text-secondary">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
