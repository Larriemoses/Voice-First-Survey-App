import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/helpers";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  containerClassName?: string;
  labelAction?: ReactNode;
};

export function Input({
  label,
  helperText,
  error,
  leadingIcon,
  trailingIcon,
  className,
  containerClassName,
  labelAction,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const fieldId = id || props.name || generatedId;
  const messageId = `${fieldId}-message`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="flex items-center justify-between gap-3 text-sm font-semibold text-[var(--color-text)]"
        >
          <span>{label}</span>
          {labelAction}
        </label>
      ) : null}

      <div
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-[var(--radius)] border bg-[var(--surface)] px-3.5",
          error
            ? "border-[var(--danger)]"
            : "border-[var(--border)] focus-within:border-[var(--accent)] focus-within:bg-[var(--surface)]",
        )}
      >
        {leadingIcon ? (
          <span className="text-[var(--text-muted)]">{leadingIcon}</span>
        ) : null}
        <input
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? messageId : undefined}
          className={cn(
            "w-full bg-transparent py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)]",
            className,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="text-[var(--text-muted)]">{trailingIcon}</span>
        ) : null}
      </div>

      {error ? (
        <p id={messageId} className="text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className="text-sm text-[var(--text-muted)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
