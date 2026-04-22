import { Sparkles } from "lucide-react";

const tips = [
  "Your survey has 8 questions - consider trimming to 5 for higher completion",
  "Add hint text to Q3 to guide respondents",
  "Your intro is missing - add a welcome screen",
];

export function SurveyHealthCard() {
  return (
    <div className="rounded-lg border-l-2 border-accent-500 bg-accent-50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-accent-700">
        <Sparkles className="h-4 w-4" />
        Survey health
      </div>
      <p className="mt-3 text-[30px] font-medium leading-none text-gray-900">82</p>
      <p className="mt-1 text-sm text-gray-500">AI-assessed score out of 100</p>
      <div className="mt-4 space-y-3">
        {tips.map((tip) => (
          <p key={tip} className="text-sm leading-5 text-gray-700">
            {tip} <button type="button" className="font-medium text-accent-700">Fix this</button>
          </p>
        ))}
      </div>
    </div>
  );
}
