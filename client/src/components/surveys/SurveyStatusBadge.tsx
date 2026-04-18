import type { SurveyStatus } from "../../lib/surveys";
import { Badge } from "../ui/Badge";

type SurveyStatusBadgeProps = {
  status: SurveyStatus;
};

export function SurveyStatusBadge({ status }: SurveyStatusBadgeProps) {
  if (status === "published") {
    return <Badge variant="success" dot>Published</Badge>;
  }

  if (status === "closed") {
    return <Badge variant="danger">Closed</Badge>;
  }

  return <Badge variant="warning" dot>Draft</Badge>;
}
