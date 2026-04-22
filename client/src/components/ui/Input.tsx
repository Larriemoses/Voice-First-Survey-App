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
        <label htmlFor={fieldId} className="flex items-center justify-between gap-3 text-sm font-medium text-gray-900">
          <span>{label}</span>
          {labelAction}
        </label>
      ) : null}
      <div
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border bg-white px-3 text-base focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500",
          error ? "border-danger" : "border-gray-200",
        )}
      >
        {leadingIcon ? <span className="text-gray-400">{leadingIcon}</span> : null}
        <input
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? messageId : undefined}
          className={cn("h-full w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400", className)}
          {...props}
        />
        {trailingIcon ? <span className="text-gray-400">{trailingIcon}</span> : null}
      </div>
      {error ? (
        <p id={messageId} className="text-sm text-danger">
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className="text-sm text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
