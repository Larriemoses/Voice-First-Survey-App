import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "../../utils/helpers";

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      variant="muted"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-10 text-center sm:py-12",
        className,
      )}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
          {icon}
        </div>
      ) : null}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-text-primary">{title}</h3>
        <p className="max-w-md text-base text-text-secondary">{description}</p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </Card>
  );
}
