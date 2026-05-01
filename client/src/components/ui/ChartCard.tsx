import type { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "../../utils/helpers";

export type ChartCardAction = {
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};

export type ChartCardProps = {
  title: string;
  subtitle?: string;
  actions?: ChartCardAction[];
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
};

export function ChartCard({
  title,
  subtitle,
  actions = [],
  children,
  className,
  contentClassName,
  headerClassName,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface-card",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between",
          headerClassName,
        )}
      >
        <div className="min-w-0">
          <h3 className="text-base font-medium text-text-primary">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
          ) : null}
        </div>
        {actions.length ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.active ? "secondary" : "ghost"}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className={
                  action.active
                    ? "border-brand-blue bg-brand-blue-light text-brand-blue hover:border-brand-blue hover:bg-brand-blue-light"
                    : undefined
                }
                leadingIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      <div className={cn("px-5 py-4", contentClassName)}>{children}</div>
    </section>
  );
}
