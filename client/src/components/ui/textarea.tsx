import type { ReactNode, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: ReactNode;
};

export function Textarea({
  label,
  helperText,
  error,
  leadingIcon,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const resolvedId = id || props.name;

  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <span
        className={[
          "flex gap-2 rounded-xl border bg-white px-3 py-2.5 transition",
          error ? "border-rose-400" : "border-slate-300 focus-within:border-indigo-500",
        ].join(" ")}
      >
        {leadingIcon ? <span className="pt-1 text-slate-400">{leadingIcon}</span> : null}
        <textarea
          id={resolvedId}
          className={[
            "min-h-24 w-full resize-y bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400",
            className,
          ].join(" ")}
          {...props}
        />
      </span>
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </label>
  );
}
