import type { InputHTMLAttributes, ReactNode } from "react";
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
  const fieldId = id || props.name;

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
          "flex min-h-11 items-center gap-3 rounded-2xl border bg-[var(--color-surface-raised)] px-3.5 transition duration-200",
          error
            ? "border-[var(--color-danger)]"
            : "border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:bg-[var(--color-surface)]",
        )}
      >
        {leadingIcon ? (
          <span className="text-[var(--color-text-muted)]">{leadingIcon}</span>
        ) : null}
        <input
          id={fieldId}
          className={cn(
            "w-full bg-transparent py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-disabled)]",
            className,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="text-[var(--color-text-muted)]">{trailingIcon}</span>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-[var(--color-danger)]">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-[var(--color-text-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
}
