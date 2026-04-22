import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getFocusableElements } from "../../utils/helpers";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getFocusableElements(panelRef.current)[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-gray-900/35">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close drawer overlay" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-xl border border-gray-200 bg-white shadow-md motion-safe:animate-[fade-in_200ms_ease] sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[360px] sm:rounded-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close drawer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-gray-200 px-5 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
