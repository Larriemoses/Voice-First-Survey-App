import { useId, useState, type ReactNode } from "react";
import { cn } from "../../utils/helpers";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "right" | "left";
};

const sideClasses: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2",
  bottom: "left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2",
  right: "left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2",
  left: "right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2",
};

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-56 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-md transition-opacity duration-150",
          sideClasses[side],
          open ? "opacity-100" : "opacity-0",
        )}
      >
        {content}
      </span>
    </span>
  );
}
