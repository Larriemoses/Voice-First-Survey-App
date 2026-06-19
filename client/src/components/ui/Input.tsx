import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/helpers";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: ReactNode;
  helperText?: ReactNode;
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
          className="flex items-center justify-between gap-3 text-sm font-medium text-text-primary"
        >
          <span>{label}</span>
          {labelAction}
        </label>
      ) : null}
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg bg-surface-muted px-3.5 text-base text-text-primary transition-[background-color,box-shadow] duration-150 focus-within:bg-white focus-within:shadow-focus",
          error
            ? "border-status-danger focus-within:border-status-danger"
            : "",
          props.disabled ? "bg-surface-muted text-text-hint" : "",
        )}
      >
        {leadingIcon ? (
          <span className="shrink-0 text-text-hint" aria-hidden>
            {leadingIcon}
          </span>
        ) : null}
        <input
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? messageId : undefined}
          className={cn(
            "h-full w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-hint focus-visible:outline-none focus-visible:shadow-none disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="shrink-0 text-text-hint" aria-hidden>
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
