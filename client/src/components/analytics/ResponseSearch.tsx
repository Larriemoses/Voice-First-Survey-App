import { Search, Volume2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { responses } from "../../lib/demoData";

const sentimentVariant = {
  positive: "active",
  neutral: "closed",
  negative: "danger",
} as const;

export function ResponseSearch() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium text-gray-500">Explore responses</p>
      <Input leadingIcon={<Search className="h-4 w-4" />} placeholder="Search transcripts..." />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Chip active>All</Chip>
          <Chip>Positive</Chip>
          <Chip>Neutral</Chip>
          <Chip>Negative</Chip>
        </div>
        <Select className="sm:w-56" defaultValue="all">
          <option value="all">All questions</option>
          <option value="q1">Question 1</option>
          <option value="q2">Question 2</option>
        </Select>
      </div>
      <div className="grid gap-3">
        {responses.map((response) => (
          <Card key={response.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-gray-900">{response.respondent}</p>
              <p className="text-sm text-gray-500">{response.duration} - {response.timestamp}</p>
            </div>
            <p className="mt-3 line-clamp-4 text-base leading-6 text-gray-700">{response.transcript}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant={sentimentVariant[response.sentiment]}>{response.sentiment}</Badge>
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                {response.emotion}
              </span>
              <Button variant="ghost" size="sm" leadingIcon={<Volume2 className="h-3.5 w-3.5 text-accent-600" />}>Play audio</Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
