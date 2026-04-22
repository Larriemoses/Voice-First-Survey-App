import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "../../utils/helpers";

type ToastVariant = "success" | "error" | "warning" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap = {
  success: CheckCircle2,
  error: TriangleAlert,
  warning: TriangleAlert,
  info: Info,
} as const;

const toneMap = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-primary-500",
} as const;

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col gap-3 sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.variant];

        return (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-lg border border-gray-200 bg-white p-4 shadow-md motion-safe:animate-[toast-in_200ms_ease-out]"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <Icon className={cn("mt-0.5 h-4 w-4", toneMap[toast.variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-gray-900">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm text-gray-500">{toast.description}</p> : null}
              </div>
              <button type="button" onClick={() => onDismiss(toast.id)} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Dismiss notification">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  useEffect(() => {
    if (!toasts.length) return undefined;

    const timers = toasts.map((toast) => window.setTimeout(() => dismissToast(toast.id), 3000));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dismissToast, toasts]);

  const value = useMemo<ToastContextValue>(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
