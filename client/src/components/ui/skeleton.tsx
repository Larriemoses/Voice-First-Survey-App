import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["animate-pulse rounded-lg bg-slate-200/80", className].join(" ")} {...props} />;
}
