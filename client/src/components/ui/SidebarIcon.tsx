import type { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { cn } from "../../utils/helpers";

type SidebarIconProps = {
  icon: ReactNode;
  active?: boolean;
  tooltip: string;
};

export function SidebarIcon({ icon, active = false, tooltip }: SidebarIconProps) {
  return (
    <Tooltip content={tooltip} side="right">
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150",
          active ? "bg-primary-50 text-primary-500" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700",
        )}
      >
        {icon}
      </span>
    </Tooltip>
  );
}
