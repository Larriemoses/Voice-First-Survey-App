import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/helpers";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
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
  rows = 4,
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
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "flex gap-2 rounded-md border bg-surface-card px-3 py-2.5 text-base text-text-primary transition-[border-color,box-shadow] duration-150",
          error
            ? "border-status-danger focus-within:border-status-danger"
            : "border-border focus-within:border-border-focus focus-within:shadow-focus",
          props.disabled ? "bg-surface-muted text-text-hint" : "",
        )}
      >
        {leadingIcon ? (
          <span className="pt-1 text-text-hint" aria-hidden>
            {leadingIcon}
          </span>
        ) : null}
        <textarea
          id={fieldId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? messageId : undefined}
          className={cn(
            "min-h-[120px] w-full resize-y bg-transparent text-base text-text-primary outline-none placeholder:text-text-hint focus-visible:outline-none focus-visible:shadow-none disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="pt-1 text-text-hint" aria-hidden>
            {trailingIcon}
          </span>
        ) : null}
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
