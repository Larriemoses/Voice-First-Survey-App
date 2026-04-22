import { Badge } from "../ui/Badge";

export function TranscriptBadge({ status }: { status: "done" | "pending" }) {
  return status === "done" ? <Badge variant="done">Transcribed</Badge> : <Badge variant="pending">Pending</Badge>;
}
