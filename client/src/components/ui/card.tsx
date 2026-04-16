import type { HTMLAttributes } from "react";

type CardVariant = "default" | "elevated" | "flat";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  default: "border border-slate-200 bg-white shadow-sm",
  elevated: "border border-slate-200 bg-white shadow-md",
  flat: "border border-slate-200 bg-slate-50 shadow-none",
};

export function Card({ variant = "default", className = "", ...props }: CardProps) {
  return <div className={["rounded-2xl", variantClasses[variant], className].join(" ")} {...props} />;
}
