import { Button } from "../ui/button";
import { AccordionCard } from "../ui/Accordion";
import { Chip } from "../ui/Chip";
import { questions } from "../../lib/demoData";

const summaries = [
  "Customers described the strongest moments as fast delivery, responsive support, and clear handoff after purchase. The few concerns focused on pricing expectation gaps.",
  "Respondents said the product saved time by reducing manual follow-up and making feedback easier to collect. They want onboarding assets to be more practical.",
  "The biggest improvement theme is clearer pricing communication before renewal. Several respondents asked for plan-limit examples and invoice previews.",
];

export function QuestionAccordion() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-500">Question-by-question analysis</p>
      {questions.slice(0, 3).map((question, index) => (
        <AccordionCard key={question.id} title={question.text} meta={`${index + 1} - ${24 - index * 5} mentions`}>
          <div className="space-y-4">
            <p className="text-base leading-6 text-gray-700">{summaries[index]}</p>
            <div>
              <div className="mb-2 flex justify-between text-xs text-gray-500">
                <span>Positive sentiment</span>
                <span>{78 - index * 8}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className={index === 0 ? "h-full w-4/5 rounded-full bg-success" : "h-full w-[70%] rounded-full bg-success"} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip active>delivery</Chip>
              <Chip active>support</Chip>
              <Chip active>pricing</Chip>
            </div>
            <blockquote className="rounded-lg border-l-[3px] border-primary-500 bg-gray-50 p-3 text-sm italic leading-6 text-gray-700">
              "Delivery was faster than expected and the support team stayed friendly throughout."
              <span className="mt-2 block text-xs not-italic text-gray-400">R-01</span>
            </blockquote>
            <blockquote className="rounded-lg border-l-[3px] border-primary-500 bg-gray-50 p-3 text-sm italic leading-6 text-gray-700">
              "The pricing page did not match what sales described, so we needed clarification."
              <span className="mt-2 block text-xs not-italic text-gray-400">R-03</span>
            </blockquote>
            <Button variant="ghost">Load more quotes</Button>
          </div>
        </AccordionCard>
      ))}
    </div>
  );
}
