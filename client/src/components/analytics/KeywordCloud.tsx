import { ChartCard } from "../ui/ChartCard";
import { keywords } from "../../lib/demoData";
import { cn } from "../../utils/helpers";

function keywordSize(score: number) {
  if (score >= 15) return "text-lg";
  if (score >= 10) return "text-md";
  return "text-sm";
}

export function KeywordCloud() {
  return (
    <ChartCard title="Most mentioned keywords" subtitle="AI-extracted">
      <div className="flex min-h-64 flex-wrap content-center gap-3">
        {keywords.map((keyword) => (
          <button
            key={keyword.label}
            type="button"
            className={cn(
              "rounded-full px-3 py-1.5 font-medium",
              keyword.score >= 12 ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-700",
              keywordSize(keyword.score),
            )}
          >
            {keyword.label}
          </button>
        ))}
      </div>
    </ChartCard>
  );
}
