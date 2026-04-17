import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  containerClassName?: string;
};

export function Textarea({
  label,
  helperText,
  error,
  leadingIcon,
  trailingIcon,
  className,
  containerClassName,
  id,
  ...props
}: TextareaProps) {
  const fieldId = id || props.name;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-sm font-semibold text-[var(--color-text)]"
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          "flex gap-3 rounded-2xl border bg-[var(--color-surface-raised)] px-3.5 transition duration-200",
          error
            ? "border-[var(--color-danger)]"
            : "border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:bg-[var(--color-surface)]",
        )}
      >
        {leadingIcon ? (
          <span className="pt-3 text-[var(--color-text-muted)]">{leadingIcon}</span>
        ) : null}
        <textarea
          id={fieldId}
          className={cn(
            "min-h-28 w-full resize-y bg-transparent py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-disabled)]",
            className,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="pt-3 text-[var(--color-text-muted)]">{trailingIcon}</span>
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
