import type { ReactNode } from "react";

type TooltipProps = {
  label: string;
  children: ReactNode;
};

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
    </span>
  );
}
