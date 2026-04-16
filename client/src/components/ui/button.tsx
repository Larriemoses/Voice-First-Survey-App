import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

const baseClasses =
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses = {
  default: "bg-indigo-600 text-white hover:bg-indigo-700",
  outline:
    "border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-50",
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={joinClasses(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}
