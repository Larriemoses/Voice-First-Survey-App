import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/helpers";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  disabledReason?: string;
  iconOnly?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-primary-500 bg-primary-500 text-white hover:border-primary-600 hover:bg-primary-600",
  secondary: "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
  ghost: "border-transparent bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900",
  danger: "border-danger bg-danger text-white hover:opacity-90",
  link: "border-transparent bg-transparent px-0 text-primary-500 hover:text-primary-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-sm",
  md: "h-9 px-4 text-base",
  lg: "h-11 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = "primary",
    size = "md",
    loading = false,
    leadingIcon,
    trailingIcon,
    disabledReason,
    iconOnly = false,
    disabled,
    title,
    type = "button",
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium leading-none disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        iconOnly ? "h-9 w-9 p-0" : sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      title={isDisabled ? disabledReason || title : title}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="h-3 w-12 rounded-full bg-white/40 skeleton-pulse" aria-hidden />
      ) : (
        leadingIcon
      )}
      <span className={iconOnly ? "sr-only" : "truncate"}>{children}</span>
      {!loading && !iconOnly ? trailingIcon : null}
    </button>
  );
});
