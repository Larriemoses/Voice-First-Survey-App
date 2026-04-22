import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { type Survey } from "../../lib/demoData";
import { cn } from "../../utils/helpers";

type SurveyRowProps = {
  survey: Survey;
  onOpenLive?: () => void;
};

const statusLabels = {
  active: "Active",
  draft: "Draft",
  closed: "Closed",
} as const;

export function SurveyRow({ survey, onOpenLive }: SurveyRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", survey.status === "closed" ? "opacity-60" : "")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {survey.liveResponses ? (
            <button type="button" onClick={onOpenLive} className="inline-flex items-center gap-1.5 rounded-full text-sm text-success">
              <span className="h-2 w-2 rounded-full bg-success motion-safe:animate-pulse" />
              Live - {survey.liveResponses} new responses
            </button>
          ) : null}
          <h3 className="truncate text-base font-medium text-gray-900">{survey.name}</h3>
          <Badge variant={survey.status}>{statusLabels[survey.status]}</Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {survey.questions} questions - {survey.responses} responses
        </p>
        <div className="mt-3 flex -space-x-2">
          {survey.team.map((initial) => (
            <span key={initial} className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-primary-50 text-xs font-medium text-primary-700">
              {initial}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <p className="text-sm text-gray-500">Last activity {survey.lastActivity}</p>
        <Link to={`/dashboard/surveys/${survey.id}${survey.status === "active" ? "/analytics" : ""}`}>
          <Button variant={survey.status === "draft" ? "primary" : "secondary"}>
            {survey.status === "draft" ? "Publish" : "View"}
          </Button>
        </Link>
        {survey.status === "active" && hovered ? (
          <Link to={`/dashboard/surveys/${survey.id}/analytics`} className="inline-flex items-center gap-1 text-sm font-medium text-accent-600">
            View analytics
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
