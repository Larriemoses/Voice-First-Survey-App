import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Close modal overlay" onClick={onClose} className="absolute inset-0" />
      <div className="relative z-10 w-full rounded-t-2xl border border-slate-200 bg-white p-4 shadow-md sm:max-w-lg sm:rounded-2xl sm:p-5">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="mt-3">{children}</div>
        {footer ? <div className="mt-4 flex flex-wrap justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
