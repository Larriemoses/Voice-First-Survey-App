import { Mic } from "lucide-react";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Toggle } from "../ui/Toggle";
import { type SurveyQuestion } from "../../lib/demoData";

type QuestionEditorProps = {
  question: SurveyQuestion;
  onToggleRequired: () => void;
};

export function QuestionEditor({ question, onToggleRequired }: QuestionEditorProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-gray-400">Editing {question.label.split(" ")[0]}</p>
      <Card>
        <Textarea label="Question text" defaultValue={question.text} />
      </Card>
      <Card>
        <p className="mb-3 text-sm font-medium text-gray-900">Response type</p>
        <div className="flex flex-wrap gap-2">
          <Chip active>
            <Mic className="mr-1 h-3.5 w-3.5" />
            Voice
          </Chip>
          <Chip>Text</Chip>
          <Chip>Rating</Chip>
        </div>
      </Card>
      <Card>
        <Input label="Hint text" defaultValue={question.hint} />
      </Card>
      <Card className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Required question</p>
          <p className="mt-1 text-sm text-gray-500">Respondents must answer before moving on.</p>
        </div>
        <Toggle checked={question.required} onClick={onToggleRequired} />
      </Card>
    </div>
  );
}
