import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { SurveyStatus } from "../../lib/surveys";
import { formatDate } from "../../utils/helpers";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { SurveyStatusBadge } from "./SurveyStatusBadge";

type SurveyCardProps = {
  survey: {
    id: string;
    title: string;
    description: string | null;
    status: SurveyStatus;
    created_at?: string | null;
  };
  onOpen: () => void;
  actionLabel?: string;
  menu?: ReactNode;
};

export function SurveyCard({
  survey,
  onOpen,
  actionLabel = "Open survey",
  menu,
}: SurveyCardProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <SurveyStatusBadge status={survey.status} />
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {survey.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {survey.description || "You haven't added a description yet."}
            </p>
          </div>
        </div>
        {menu}
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          Created {formatDate(survey.created_at)}
        </p>

        <Button
          size="sm"
          onClick={onOpen}
          trailingIcon={<ArrowRight className="h-4 w-4" />}
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
