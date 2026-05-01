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
          "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150",
          active
            ? "bg-brand-blue-light text-brand-blue"
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
