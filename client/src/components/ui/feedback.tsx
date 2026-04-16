import { useState } from "react";
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from "react-icons/fa";

type FeedbackTone = "success" | "error" | "warning" | "info";

type FeedbackProps = {
  tone: FeedbackTone;
  message: string;
  dismissible?: boolean;
};

const styleMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

const iconMap = {
  success: <FaCheckCircle className="h-4 w-4" />,
  error: <FaTimesCircle className="h-4 w-4" />,
  warning: <FaExclamationTriangle className="h-4 w-4" />,
  info: <FaInfoCircle className="h-4 w-4" />,
};

export function Feedback({ tone, message, dismissible = false }: FeedbackProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={["flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm", styleMap[tone]].join(" ")}>
      <span className="mt-0.5">{iconMap[tone]}</span>
      <p className="flex-1">{message}</p>
      {dismissible ? (
        <button type="button" onClick={() => setDismissed(true)} className="text-current/70 hover:text-current" aria-label="Dismiss feedback">
          <FaTimes className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
