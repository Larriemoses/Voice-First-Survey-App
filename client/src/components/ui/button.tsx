import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/helpers";
import { Spinner } from "./Spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "link";

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
  primary:
    "border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)] shadow-sm hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)]",
  secondary:
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]",
  ghost:
    "border border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
  danger:
    "border border-[var(--danger)] bg-[var(--danger)] text-white shadow-sm hover:opacity-95",
  link: "border border-transparent bg-transparent px-0 text-[var(--accent)] shadow-none hover:text-[var(--accent-hover)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 rounded-[var(--radius)] px-3.5 text-sm",
  md: "min-h-11 rounded-[var(--radius)] px-4 text-sm",
  lg: "min-h-12 rounded-[var(--radius)] px-5 text-sm",
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
        "touch-target inline-flex shrink-0 items-center justify-center gap-2 font-medium leading-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        iconOnly
          ? size === "lg"
            ? "h-12 w-12 rounded-[var(--radius)] p-0"
            : "h-11 w-11 rounded-[var(--radius)] p-0"
          : sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      title={isDisabled ? disabledReason || title : title}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leadingIcon}
      <span className={iconOnly ? "sr-only" : "truncate"}>{children}</span>
      {!loading && !iconOnly ? trailingIcon : null}
    </button>
  );
});
