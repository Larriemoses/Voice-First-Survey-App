import { Badge } from "../ui/Badge";
import { Drawer } from "../ui/Drawer";
import { responses } from "../../lib/demoData";

type LiveDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const sentimentVariant = {
  positive: "active",
  neutral: "closed",
  negative: "danger",
} as const;

export function LiveDrawer({ open, onClose }: LiveDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} title="Live responses" description="Newest submissions from active surveys.">
      <div className="space-y-3">
        {responses.slice(0, 5).map((response) => (
          <article key={response.id} className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-gray-900">{response.respondent}</p>
              <span className="text-xs text-gray-400">{response.timestamp}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-600">{response.transcript}</p>
            <div className="mt-3">
              <Badge variant={sentimentVariant[response.sentiment]}>{response.sentiment}</Badge>
            </div>
          </article>
        ))}
      </div>
    </Drawer>
  );
}
