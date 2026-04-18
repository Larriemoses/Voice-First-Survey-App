import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
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
  const generatedId = useId();
  const fieldId = id || props.name || generatedId;
  const messageId = `${fieldId}-message`;

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
          "flex gap-3 rounded-[var(--radius)] border bg-[var(--surface)] px-3.5",
          error
            ? "border-[var(--danger)]"
            : "border-[var(--border)] focus-within:border-[var(--accent)] focus-within:bg-[var(--surface)]",
        )}
      >
        {leadingIcon ? (
          <span className="pt-3 text-[var(--text-muted)]">{leadingIcon}</span>
        ) : null}
        <textarea
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? messageId : undefined}
          className={cn(
            "min-h-28 w-full resize-y bg-transparent py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)]",
            className,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="pt-3 text-[var(--text-muted)]">{trailingIcon}</span>
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
