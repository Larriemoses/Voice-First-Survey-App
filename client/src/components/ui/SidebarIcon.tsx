import type { HTMLAttributes, ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { cn } from "../../utils/helpers";

export type SidebarIconProps = HTMLAttributes<HTMLSpanElement> & {
  icon: ReactNode;
  active?: boolean;
  tooltip: string;
};

export function SidebarIcon({
  icon,
  active = false,
  tooltip,
  className,
  ...props
}: SidebarIconProps) {
  return (
    <Tooltip content={tooltip} side="right">
      <span
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150",
          active
            ? "bg-[#111111] text-white"
            : "text-text-hint hover:bg-surface-muted hover:text-text-secondary",
          className,
        )}
        {...props}
      >
        {icon}
      </span>
    </Tooltip>
  );
}
