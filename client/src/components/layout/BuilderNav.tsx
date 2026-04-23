import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Badge, type BadgeVariant } from "../ui/Badge";
import { Button } from "../ui/button";
import { Chip } from "../ui/Chip";
import { cn } from "../../utils/helpers";

type BuilderTab = {
  label: string;
  href: string;
  active: (pathname: string, hash: string, basePath: string) => boolean;
};

export type BuilderNavProps = {
  surveyName?: string;
  statusLabel?: string;
  statusVariant?: BadgeVariant;
  primaryActionLabel?: string;
  className?: string;
};

function formatSurveyName(surveyId: string): string {
  return surveyId
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function getTabs(basePath: string): BuilderTab[] {
  return [
    {
      label: "Build",
      href: basePath,
      active: (pathname, hash, currentBasePath) =>
        pathname === currentBasePath && hash !== "#design" && hash !== "#share",
    },
    {
      label: "Design",
      href: `${basePath}#design`,
      active: (pathname, hash, currentBasePath) =>
        pathname === currentBasePath && hash === "#design",
    },
    {
      label: "Share",
      href: `${basePath}#share`,
      active: (pathname, hash, currentBasePath) =>
        pathname === currentBasePath && hash === "#share",
    },
    {
      label: "Results",
      href: `${basePath}/results`,
      active: (pathname) => pathname === `${basePath}/results`,
    },
    {
      label: "Analytics",
      href: `${basePath}/analytics`,
      active: (pathname) => pathname === `${basePath}/analytics`,
    },
  ];
}

export function BuilderNav({
  surveyName,
  statusLabel = "Active",
  statusVariant = "active",
  primaryActionLabel = "Publish",
  className,
}: BuilderNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id = "q4-customer-satisfaction" } = useParams();
  const basePath = `/dashboard/surveys/${id}`;
  const resolvedSurveyName = surveyName ?? formatSurveyName(id);
  const tabs = getTabs(basePath);

  return (
    <div
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-surface-card",
        className,
      )}
    >
      <div className="survica-page-shell flex min-h-[52px] flex-col gap-3 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors duration-150 hover:text-brand-blue"
            >
              <ArrowLeft className="h-4 w-4" />
              My surveys
            </Link>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-base font-medium text-text-primary">
                {resolvedSurveyName}
              </h1>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <Button variant="secondary">Preview</Button>
            <Button>{primaryActionLabel}</Button>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex min-w-max items-center gap-2 pb-1">
            {tabs.map((tab) => {
              const active = tab.active(
                location.pathname,
                location.hash,
                basePath,
              );

              return (
                <Chip
                  key={tab.label}
                  active={active}
                  onClick={() => navigate(tab.href)}
                >
                  {tab.label}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
