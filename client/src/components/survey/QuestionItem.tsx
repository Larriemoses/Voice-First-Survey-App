import { Sparkles, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { cn } from "../../utils/helpers";

type QuestionItemProps = {
  label: string;
  text: string;
  selected?: boolean;
  suggestions?: string[];
  onSelect?: () => void;
  onSuggest?: () => void;
  onInsertSuggestion?: (question: string) => void;
  onDismissSuggestions?: () => void;
};

export function QuestionItem({
  label,
  text,
  selected = false,
  suggestions = [],
  onSelect,
  onSuggest,
  onInsertSuggestion,
  onDismissSuggestions,
}: QuestionItemProps) {
  return (
    <div className="space-y-2">
      <button type="button" onClick={onSelect} className="w-full text-left">
        <Card className={cn("p-3", selected ? "border-primary-500" : "border-gray-200")}>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-gray-900">{text}</p>
        </Card>
      </button>
      <Button variant="ghost" size="sm" className="h-7 px-2 text-accent-600" leadingIcon={<Sparkles className="h-3.5 w-3.5" />} onClick={onSuggest}>
        Suggest follow-up question
      </Button>
      {suggestions.length ? (
        <div className="rounded-lg border border-accent-100 bg-accent-50 p-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-accent-700">AI suggestions</p>
            <button type="button" onClick={onDismissSuggestions} className="text-accent-700" aria-label="Dismiss suggestions">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onInsertSuggestion?.(suggestion)}
                className="rounded-full border border-accent-100 bg-white px-3 py-1.5 text-left text-sm text-gray-700 hover:border-accent-500"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
