import { useEffect, useState } from "react";
import { questions, surveys, type Survey, type SurveyQuestion } from "../lib/demoData";

export function useSurvey(id?: string) {
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | undefined>();
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSurvey(surveys.find((item) => item.id === id) ?? surveys[0]);
      setSurveyQuestions(questions);
      setLoading(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [id]);

  return { loading, survey, questions: surveyQuestions };
}
