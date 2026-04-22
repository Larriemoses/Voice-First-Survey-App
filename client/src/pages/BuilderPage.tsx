import { Copy, Link as LinkIcon, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { BuilderNav } from "../components/layout/BuilderNav";
import { AIQuestionGenerator } from "../components/survey/AIQuestionGenerator";
import { QuestionEditor } from "../components/survey/QuestionEditor";
import { QuestionItem } from "../components/survey/QuestionItem";
import { SurveyHealthCard } from "../components/survey/SurveyHealthCard";
import { ThankYouEditor } from "../components/survey/ThankYouEditor";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { type SurveyQuestion, questions as initialQuestions } from "../lib/demoData";

export default function BuilderPage() {
  const [questions, setQuestions] = useState<SurveyQuestion[]>(initialQuestions);
  const [selectedId, setSelectedId] = useState(initialQuestions[0].id);
  const [aiOpen, setAiOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const selectedQuestion = questions.find((question) => question.id === selectedId) ?? questions[0];

  function addQuestions(items: string[]) {
    setQuestions((current) => [
      ...current,
      ...items.map((text, index) => ({
        id: `ai-${Date.now()}-${index}`,
        label: `Q${current.length + index + 1} - Voice`,
        text,
        hint: "Answer in your own words.",
        required: false,
      })),
    ]);
    setAiOpen(false);
  }

  function insertSuggestion(text: string) {
    const selectedIndex = questions.findIndex((question) => question.id === selectedId);
    const nextQuestion = {
      id: `followup-${Date.now()}`,
      label: `Q${questions.length + 1} - Voice`,
      text,
      hint: "Share the detail that would help the team understand why.",
      required: false,
    };
    setQuestions((current) => [
      ...current.slice(0, selectedIndex + 1),
      nextQuestion,
      ...current.slice(selectedIndex + 1),
    ]);
    setSuggestions([]);
  }

  function toggleRequired() {
    setQuestions((current) =>
      current.map((question) =>
        question.id === selectedId ? { ...question, required: !question.required } : question,
      ),
    );
  }

  return (
    <AppShell>
      <BuilderNav />
      <div className="grid min-h-[calc(100vh-52px)] lg:grid-cols-[220px_minmax(0,1fr)_240px]">
        <aside className="border-b border-gray-200 bg-gray-100 p-4 lg:border-b-0 lg:border-r">
          <p className="mb-3 text-xs font-medium text-gray-400">Questions</p>
          <div className="space-y-3">
            {questions.map((question) => (
              <QuestionItem
                key={question.id}
                label={question.label}
                text={question.text}
                selected={question.id === selectedId}
                suggestions={question.id === selectedId ? suggestions : []}
                onSelect={() => setSelectedId(question.id)}
                onSuggest={() => setSuggestions(["What made that experience feel different?", "How would you explain that issue to a colleague?", "What should we do next to improve it?"])}
                onInsertSuggestion={insertSuggestion}
                onDismissSuggestions={() => setSuggestions([])}
              />
            ))}
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-4 text-sm font-medium text-gray-500 hover:border-primary-500 hover:text-primary-500">
              <Plus className="h-4 w-4" />
              Add question
            </button>
            <button type="button" onClick={() => setAiOpen(true)} className="w-full rounded-lg border border-accent-100 bg-accent-50 p-3 text-left text-sm text-accent-700">
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4" />
                AI draft
              </span>
              <span className="mt-1 block text-sm text-gray-600">Generate questions from a brief</span>
            </button>
            <div className="border-t border-gray-200 pt-3">
              <button type="button" className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left text-sm font-medium text-gray-900">
                Thank you
              </button>
            </div>
          </div>
        </aside>

        <section className="bg-white p-5 md:p-6">
          <QuestionEditor question={selectedQuestion} onToggleRequired={toggleRequired} />
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-medium text-gray-900">Thank-you page</h2>
            <ThankYouEditor />
          </div>
        </section>

        <aside className="border-t border-gray-200 bg-gray-100 p-4 lg:border-l lg:border-t-0">
          <div className="space-y-4">
            <Card className="space-y-3">
              <p className="text-sm font-medium text-gray-900">Survey branding</p>
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                Logo upload
              </div>
              <Input placeholder="Header text" defaultValue="Acme customer research" />
            </Card>
            <Card className="space-y-3">
              <p className="text-sm font-medium text-gray-900">Share</p>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
                <LinkIcon className="h-4 w-4" />
                survica.app/s/acme-q4
              </div>
              <Button variant="secondary" leadingIcon={<Copy className="h-4 w-4" />}>Copy link</Button>
              <Button variant="ghost">Save as template</Button>
            </Card>
            <SurveyHealthCard />
          </div>
        </aside>
      </div>
      <AIQuestionGenerator open={aiOpen} onClose={() => setAiOpen(false)} onAddQuestions={addQuestions} />
    </AppShell>
  );
}
