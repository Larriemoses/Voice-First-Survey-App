import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/helpers";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "orange"
  | "gradient";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  disabledReason?: string;
  iconOnly?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-brand-blue bg-brand-blue text-text-inverse hover:border-brand-blue-dark hover:bg-brand-blue-dark",
  secondary:
    "border-border bg-surface-card text-text-primary hover:border-border-strong hover:bg-surface-muted",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary",
  danger:
    "border-status-danger bg-status-danger text-text-inverse hover:opacity-95",
  orange:
    "border-brand-orange bg-brand-orange text-text-inverse hover:border-brand-orange-dark hover:bg-brand-orange-dark",
  gradient:
    "border-transparent bg-[linear-gradient(135deg,#F97316,#C2410C)] text-text-inverse hover:opacity-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-[30px] min-w-[30px] px-3 text-sm",
  md: "h-[38px] min-w-[38px] px-4 text-base",
  lg: "h-[46px] min-w-[46px] px-5 text-base",
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: "h-[30px] w-[30px] p-0",
  md: "h-[38px] w-[38px] p-0",
  lg: "h-[46px] w-[46px] p-0",
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
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium leading-[1.4] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      title={isDisabled ? disabledReason || title : title}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current"
            aria-hidden
          />
          <span className={iconOnly ? "sr-only" : "truncate"}>Loading...</span>
        </>
      ) : (
        <>
          {leadingIcon ? (
            <span className="shrink-0" aria-hidden>
              {leadingIcon}
            </span>
          ) : null}
          <span className={iconOnly ? "sr-only" : "truncate"}>{children}</span>
          {!iconOnly && trailingIcon ? (
            <span className="shrink-0" aria-hidden>
              {trailingIcon}
            </span>
          ) : null}
        </>
      )}
    </button>
  );
});
