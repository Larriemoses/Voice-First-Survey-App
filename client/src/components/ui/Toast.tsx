import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "../../utils/helpers";

export type ToastVariant = "success" | "error" | "info" | "warning";

export type ToastPayload = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = ToastPayload & {
  id: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: ToastPayload) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
  warning: TriangleAlert,
} satisfies Record<ToastVariant, typeof Info>;

const toneMap: Record<ToastVariant, string> = {
  success: "border-l-status-success text-status-success",
  error: "border-l-status-danger text-status-danger",
  info: "border-l-brand-blue text-brand-blue",
  warning: "border-l-brand-orange text-brand-orange-dark",
};

function getToastId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export type ToastProps = ToastItem & {
  onDismiss: (id: string) => void;
};

export function Toast({
  id,
  title,
  description,
  variant,
  onDismiss,
}: ToastProps) {
  const Icon = iconMap[variant];
  const liveMode = variant === "error" ? "assertive" : "polite";

  return (
    <div
      className={cn(
        "pointer-events-auto rounded-lg border border-border border-l-2 bg-surface-card p-4 shadow-md",
        toneMap[variant],
      )}
      role={variant === "error" ? "alert" : "status"}
      aria-live={liveMode}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-text-primary">{title}</p>
          {description ? (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="rounded-md p-1 text-text-hint transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  function dismissToast(id: string) {
    const timer = timersRef.current[id];

    if (timer) {
      window.clearTimeout(timer);
      delete timersRef.current[id];
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function clearToasts() {
    Object.values(timersRef.current).forEach((timer) => window.clearTimeout(timer));
    timersRef.current = {};
    setToasts([]);
  }

  function showToast({ title, description, variant = "info" }: ToastPayload) {
    const id = getToastId();
    const nextToast: ToastItem = { id, title, description, variant };

    setToasts((current) => {
      const next = [...current, nextToast];
      const overflow = next.slice(0, Math.max(0, next.length - 3));

      overflow.forEach((toast) => {
        const timer = timersRef.current[toast.id];

        if (timer) {
          window.clearTimeout(timer);
          delete timersRef.current[toast.id];
        }
      });

      return next.slice(-3);
    });

    timersRef.current[id] = window.setTimeout(() => dismissToast(id), 4000);
    return id;
  }

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) =>
        window.clearTimeout(timer),
      );
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, clearToasts }}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
              {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
              ))}
            </div>,
            document.body,
          )
        : null}
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
