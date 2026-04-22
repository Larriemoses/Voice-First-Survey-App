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
        <label htmlFor={fieldId} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "flex rounded-md border bg-white px-3 text-base focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500",
          error ? "border-danger" : "border-gray-200",
        )}
      >
        {leadingIcon ? <span className="pt-2.5 text-gray-400">{leadingIcon}</span> : null}
        <textarea
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? messageId : undefined}
          className={cn("min-h-28 w-full resize-y bg-transparent py-2.5 text-gray-900 outline-none placeholder:text-gray-400", className)}
          {...props}
        />
        {trailingIcon ? <span className="pt-2.5 text-gray-400">{trailingIcon}</span> : null}
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
