import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/helpers";
import { Button } from "./button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  actions,
  backHref,
  backLabel = "Back",
  onBack,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    if (backHref) {
      navigate(backHref);
      return;
    }

    navigate(-1);
  }

  return (
    <div
      className={cn(
        "sticky top-20 z-20 -mx-4 mb-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 md:top-0 lg:-mx-8 lg:px-8",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {(backHref || onBack) ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="-ml-2 mb-2"
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
            >
              {backLabel}
            </Button>
          ) : null}
          <h1 className="text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-sm text-[var(--color-text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
