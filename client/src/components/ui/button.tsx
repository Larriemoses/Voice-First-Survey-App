import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses = {
  default: "bg-indigo-600 text-white hover:bg-indigo-700",
  outline:
    "border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-50",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:bg-indigo-400",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 active:scale-[0.98]",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] disabled:bg-rose-300",
  link: "bg-transparent px-0 text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(" ")}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner size="sm" aria-hidden="true" /> : leadingIcon}
      <span>{children}</span>
      {!loading ? trailingIcon : null}
    </button>
  );
}
