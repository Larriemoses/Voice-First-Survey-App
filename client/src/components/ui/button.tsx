import type { ButtonHTMLAttributes, ReactNode } from "react";
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
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm hover:bg-[var(--color-primary-hover)]",
  secondary:
    "border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)] hover:bg-[var(--color-surface)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:opacity-90",
  link: "bg-transparent px-0 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 rounded-2xl px-3.5 text-sm",
  md: "min-h-11 rounded-2xl px-4 text-sm",
  lg: "min-h-12 rounded-[20px] px-5 text-sm",
};

export function Button({
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
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        iconOnly
          ? size === "lg"
            ? "h-12 w-12 rounded-[20px] p-0"
            : "h-11 w-11 rounded-2xl p-0"
          : sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      title={isDisabled ? disabledReason || title : title}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leadingIcon}
      <span className={iconOnly ? "sr-only" : "truncate"}>{children}</span>
      {!loading && !iconOnly ? trailingIcon : null}
    </button>
  );
}
