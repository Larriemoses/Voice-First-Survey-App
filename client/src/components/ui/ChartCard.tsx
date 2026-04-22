import type { ReactNode } from "react";
import { cn } from "../../utils/helpers";

type ChartAction = {
  label: string;
  onClick?: () => void;
  active?: boolean;
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  actions?: ChartAction[];
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, subtitle, actions = [], children, className }: ChartCardProps) {
  return (
    <section className={cn("overflow-hidden rounded-lg border border-gray-200 bg-white", className)}>
      <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
        </div>
        {actions.length ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={cn(
                  "h-7 rounded-md px-2 text-sm font-medium",
                  action.active ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-100",
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
