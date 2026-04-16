import type { ReactNode } from "react";

type DrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-slate-900/40">
      <button type="button" aria-label="Close drawer overlay" onClick={onClose} className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-4 shadow-md sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:max-h-none sm:rounded-none sm:p-5">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
