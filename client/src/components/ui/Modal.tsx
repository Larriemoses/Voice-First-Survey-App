import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getFocusableElements } from "../../utils/helpers";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open || !dialogRef.current) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getFocusableElements(dialogRef.current)[0]?.focus();

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/35 p-0 sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close modal overlay" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative flex w-full flex-col rounded-t-xl border border-gray-200 bg-white shadow-md sm:max-w-[520px] sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-medium text-gray-900">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-gray-500">
                {description}
              </p>
            ) : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-gray-200 px-5 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
