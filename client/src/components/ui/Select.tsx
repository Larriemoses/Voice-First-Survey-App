import { useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/helpers";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helperText?: string;
  containerClassName?: string;
};

export function Select({
  label,
  helperText,
  containerClassName,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id || props.name || generatedId;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            "h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-9 text-base text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {helperText ? <p className="text-sm text-gray-500">{helperText}</p> : null}
    </div>
  );
}
