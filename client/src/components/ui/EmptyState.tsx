import type { ReactNode } from "react";
import { Card } from "./Card";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="text-center" variant="flat">
      {icon ? (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-primary)]">
          {icon}
        </div>
      ) : null}
      <h3 className="mt-4 text-xl font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  );
}
