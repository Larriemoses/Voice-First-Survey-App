import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Chip } from "../ui/Chip";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { SkeletonBlock } from "../ui/SkeletonBlock";
import { Textarea } from "../ui/Textarea";

const goals = ["Customer feedback", "Product research", "Employee pulse", "Event follow-up", "Exit survey", "Other"];
const lengths = ["Short 3-5q", "Medium 6-8q", "Full 10-12q"];
const generatedQuestions = [
  "What was the most valuable part of your experience?",
  "Where did the process feel unclear or slower than expected?",
  "What would make you more likely to recommend us?",
  "What should we improve before your next interaction?",
];

type AIQuestionGeneratorProps = {
  open: boolean;
  onClose: () => void;
  onAddQuestions: (questions: string[]) => void;
};

export function AIQuestionGenerator({ open, onClose, onAddQuestions }: AIQuestionGeneratorProps) {
  const [goal, setGoal] = useState(goals[0]);
  const [length, setLength] = useState(lengths[0]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string[]>(generatedQuestions.slice(0, 3));

  function generate() {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setReady(true);
    }, 900);
  }

  function toggleQuestion(question: string) {
    setSelected((current) =>
      current.includes(question) ? current.filter((item) => item !== question) : [...current, question],
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="AI draft"
      description="Generate voice-first survey questions from a short brief."
      footer={
        ready ? (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onAddQuestions(selected)}>Add selected questions</Button>
          </div>
        ) : null
      }
    >
      <div className="space-y-4">
        <Textarea label="Describe what you want to learn from your audience" rows={4} placeholder="Example: Learn why customers renew, what causes hesitation, and what messaging would make pricing feel clearer." />
        <Select label="Industry" defaultValue="SaaS">
          <option>SaaS</option>
          <option>Retail</option>
          <option>Healthcare</option>
          <option>Education</option>
        </Select>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-900">Survey goal</p>
          <div className="flex flex-wrap gap-2">
            {goals.map((item) => (
              <Chip key={item} active={goal === item} onClick={() => setGoal(item)}>{item}</Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-900">Target length</p>
          <div className="flex flex-wrap gap-2">
            {lengths.map((item) => (
              <Chip key={item} active={length === item} onClick={() => setLength(item)}>{item}</Chip>
            ))}
          </div>
        </div>
        {!ready && !loading ? (
          <Button className="hero-cta-gradient border-accent-500 text-white" leadingIcon={<Sparkles className="h-4 w-4" />} onClick={generate}>
            Generate questions
          </Button>
        ) : null}
        {loading ? (
          <div className="space-y-3">
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
          </div>
        ) : null}
        {ready ? (
          <div className="space-y-2">
            {generatedQuestions.map((question) => (
              <label key={question} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
                <input type="checkbox" checked={selected.includes(question)} onChange={() => toggleQuestion(question)} className="mt-1 accent-primary-500" />
                <span>{question}</span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
