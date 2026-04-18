import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, MessageSquareText, Palette, Trash2 } from "lucide-react";
import type { SurveyStatus } from "../../lib/surveys";
import { cn, formatRelativeDate } from "../../utils/helpers";
import { DropdownMenu, type DropdownMenuItem } from "../ui/DropdownMenu";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { SurveyStatusBadge } from "./SurveyStatusBadge";

type SurveyCardProps = {
  survey: {
    id: string;
    title: string;
    status: SurveyStatus;
    responseCount: number;
    updatedAt?: string | null;
  };
  builderPath: string;
  onDelete: (surveyId: string) => void | Promise<void>;
  onCopyPublicLink?: (surveyId: string) => void | Promise<void>;
  onEditBranding?: (surveyId: string) => void | Promise<void>;
  onViewResponses?: (surveyId: string) => void | Promise<void>;
  className?: string;
};

export function SurveyCard({
  survey,
  builderPath,
  onDelete,
  onCopyPublicLink,
  onEditBranding,
  onViewResponses,
  className,
}: SurveyCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const responseLabel =
    survey.responseCount === 1 ? "1 response" : `${survey.responseCount} responses`;

  const rawMenuItems: Array<DropdownMenuItem | null> = [
    onViewResponses
      ? {
          label: "View responses",
          icon: <MessageSquareText className="h-4 w-4" />,
          onSelect: () => onViewResponses(survey.id),
        }
      : null,
    survey.status === "published" && onCopyPublicLink
      ? {
          label: "Copy public link",
          icon: <Copy className="h-4 w-4" />,
          onSelect: () => onCopyPublicLink(survey.id),
        }
      : null,
    onEditBranding
      ? {
          label: "Edit branding",
          icon: <Palette className="h-4 w-4" />,
          onSelect: () => onEditBranding(survey.id),
        }
      : null,
    {
      label: "Delete survey",
      icon: <Trash2 className="h-4 w-4" />,
      tone: "danger" as const,
      onSelect: () => setConfirmDelete(true),
    },
  ];
  const menuItems = rawMenuItems.filter((item) => item !== null) as DropdownMenuItem[];

  return (
    <>
      <article className={cn("relative", className)}>
        <Link
          to={builderPath}
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={`Open ${survey.title}`}
        />

        <Card className="relative p-5 sm:p-5">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="pointer-events-none space-y-3">
              <SurveyStatusBadge status={survey.status} />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-[var(--text)]">
                  {survey.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {responseLabel} - Updated {formatRelativeDate(survey.updatedAt)}
                </p>
              </div>
            </div>

            <div
              className="relative z-20 pointer-events-auto"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <DropdownMenu
                label="Survey actions"
                items={menuItems}
                triggerClassName="text-[var(--text-muted)]"
              />
            </div>
          </div>
        </Card>
      </article>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete survey"
        description="This deletes all responses permanently."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Keep survey
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await onDelete(survey.id);
                setConfirmDelete(false);
              }}
            >
              Delete survey
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          You&apos;ll remove the survey, its questions, and every collected response.
        </p>
      </Modal>
    </>
  );
}
