import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      {icon ? <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">{icon}</div> : null}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
