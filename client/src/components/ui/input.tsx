import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Input({
  label,
  helperText,
  error,
  leadingIcon,
  trailingIcon,
  className = "",
  id,
  ...props
}: InputProps) {
  const resolvedId = id || props.name;

  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <span
        className={[
          "flex min-h-11 items-center gap-2 rounded-xl border bg-white px-3 transition",
          error ? "border-rose-400" : "border-slate-300 focus-within:border-indigo-500",
        ].join(" ")}
      >
        {leadingIcon ? <span className="text-slate-400">{leadingIcon}</span> : null}
        <input
          id={resolvedId}
          className={[
            "w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400",
            className,
          ].join(" ")}
          {...props}
        />
        {trailingIcon ? <span className="text-slate-400">{trailingIcon}</span> : null}
      </span>
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </label>
  );
}
