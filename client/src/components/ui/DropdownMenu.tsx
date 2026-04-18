import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../utils/helpers";
import { Button } from "./button";

export type DropdownMenuItem = {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  href?: string;
  tone?: "default" | "danger";
  disabled?: boolean;
};

type DropdownMenuProps = {
  items: DropdownMenuItem[];
  label?: string;
  align?: "left" | "right";
  className?: string;
  triggerClassName?: string;
};

export function DropdownMenu({
  items,
  label = "More actions",
  align = "right",
  className,
  triggerClassName,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | HTMLAnchorElement | null>>(
    [],
  );

  const enabledIndexes = useMemo(
    () => items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled),
    [items],
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const firstEnabledIndex = enabledIndexes[0]?.index;
    if (firstEnabledIndex !== undefined) {
      itemRefs.current[firstEnabledIndex]?.focus();
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [enabledIndexes, open]);

  function focusNext(currentIndex: number, direction: 1 | -1) {
    const currentEnabledIndex = enabledIndexes.findIndex(
      ({ index }) => index === currentIndex,
    );

    if (currentEnabledIndex === -1 || enabledIndexes.length === 0) {
      return;
    }

    const nextEnabled =
      enabledIndexes[
        (currentEnabledIndex + direction + enabledIndexes.length) %
          enabledIndexes.length
      ]?.index;

    if (nextEnabled !== undefined) {
      itemRefs.current[nextEnabled]?.focus();
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="sm"
        iconOnly
        aria-label={label}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        className={triggerClassName}
        leadingIcon={<MoreHorizontal className="h-4 w-4" />}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {label}
      </Button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            "absolute top-full z-40 mt-2 min-w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => {
            const itemClassName = cn(
              "flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left text-sm font-medium",
              item.disabled
                ? "cursor-not-allowed text-[var(--text-dim)]"
                : item.tone === "danger"
                  ? "text-[var(--danger)] hover:bg-[color:color-mix(in_srgb,var(--danger)_9%,transparent)]"
                  : "text-[var(--text)] hover:bg-[var(--surface-muted)]",
            );

            const handleKeyDown = (event: ReactKeyboardEvent) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                focusNext(index, 1);
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                focusNext(index, -1);
              }

              if (event.key === "Home") {
                event.preventDefault();
                const firstEnabledIndex = enabledIndexes[0]?.index;
                if (firstEnabledIndex !== undefined) {
                  itemRefs.current[firstEnabledIndex]?.focus();
                }
              }

              if (event.key === "End") {
                event.preventDefault();
                const lastEnabledIndex = enabledIndexes.at(-1)?.index;
                if (lastEnabledIndex !== undefined) {
                  itemRefs.current[lastEnabledIndex]?.focus();
                }
              }
            };

            if (item.href) {
              return (
                <a
                  key={item.label}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  className={itemClassName}
                  onClick={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  onKeyDown={handleKeyDown}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              );
            }

            return (
              <button
                key={item.label}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={itemClassName}
                onClick={() => {
                  if (item.disabled) {
                    return;
                  }

                  setOpen(false);
                  item.onSelect?.();
                  triggerRef.current?.focus();
                }}
                onKeyDown={handleKeyDown}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
