import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../utils/helpers";
import { Button, type ButtonVariant } from "./button";

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
  buttonVariant?: ButtonVariant;
  className?: string;
};

export function OverflowMenu({
  items,
  label = "More",
  align = "right",
  buttonVariant = "secondary",
  className,
}: OverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <Button
        variant={buttonVariant}
        size="sm"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        leadingIcon={<MoreHorizontal className="h-4 w-4" />}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </Button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute top-full z-30 mt-2 min-w-[13rem] rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-2 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="space-y-1">
            {items.map((item) => {
              const itemClassName = cn(
                "flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-medium transition",
                item.disabled
                  ? "cursor-not-allowed opacity-50"
                  : item.tone === "danger"
                    ? "text-[var(--color-danger)] hover:bg-[color:color-mix(in_srgb,var(--color-danger)_10%,transparent)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-surface)]",
              );

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    role="menuitem"
                    className={itemClassName}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={itemClassName}
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.disabled) return;
                    setOpen(false);
                    item.onSelect?.();
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
