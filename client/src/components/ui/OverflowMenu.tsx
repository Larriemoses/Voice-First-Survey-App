import type { ReactNode } from "react";
import {
  DropdownMenu,
  type DropdownMenuItem,
} from "./DropdownMenu";

export type OverflowMenuItem = {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  href?: string;
  tone?: "default" | "danger";
  disabled?: boolean;
};

type OverflowMenuProps = {
  items: OverflowMenuItem[];
  label?: string;
  align?: "left" | "right";
  className?: string;
};

export function OverflowMenu({
  items,
  label = "More actions",
  align = "right",
  className,
}: OverflowMenuProps) {
  const normalizedItems: DropdownMenuItem[] = items.map((item) => ({
    ...item,
    tone: item.tone,
  }));

  return (
    <DropdownMenu
      items={normalizedItems}
      label={label}
      align={align}
      className={className}
    />
  );
}
