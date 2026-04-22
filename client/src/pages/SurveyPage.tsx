import { useState } from "react";
import { BrandedHeader } from "../components/respondent/BrandedHeader";
import { ProgressBar } from "../components/respondent/ProgressBar";
import { RecordButton } from "../components/respondent/RecordButton";
import { ThankYouScreen } from "../components/respondent/ThankYouScreen";
import { Waveform } from "../components/respondent/Waveform";
import { Button } from "../components/ui/button";
import { questions } from "../lib/demoData";

export default function SurveyPage() {
  const [current, setCurrent] = useState(0);
  const [recording, setRecording] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const question = questions[current];
  const lastQuestion = current === questions.length - 1;

  if (submitted) {
    return <ThankYouScreen companyName="Acme research" />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto min-h-screen max-w-[480px] bg-white">
        <BrandedHeader companyName="Acme research" surveyLabel="Q4 customer satisfaction" />
        <ProgressBar current={current + 1} total={questions.length} />
        <section className="px-5 py-6">
          <h1 className="text-lg font-medium leading-7 text-gray-900">{question.text}</h1>
          <p className="mt-3 text-base leading-7 text-gray-500">{question.hint}</p>
          <RecordButton recording={recording} onStart={() => setRecording(true)} onStop={() => setRecording(false)} />
          <Waveform />
        </section>
        <footer className="sticky bottom-0 mt-auto grid grid-cols-2 gap-3 border-t border-gray-200 bg-white px-5 py-3">
          <Button variant="secondary" onClick={() => (lastQuestion ? setSubmitted(true) : setCurrent((value) => value + 1))}>Skip</Button>
          <Button
            className={lastQuestion ? "border-accent-500 bg-accent-500 hover:border-accent-600 hover:bg-accent-600" : ""}
            onClick={() => (lastQuestion ? setSubmitted(true) : setCurrent((value) => value + 1))}
          >
            {lastQuestion ? "Submit" : "Next"}
          </Button>
        </footer>
      </div>
    </main>
  );
}
