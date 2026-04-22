import { useState } from "react";
import { generateAnalyticsInsights, type AnalyticsInsightResult } from "../lib/anthropic";

export function useAnalytics() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AnalyticsInsightResult | null>(null);

  async function regenerate(surveyId: string, transcripts: string[]) {
    setLoading(true);
    try {
      const result = await generateAnalyticsInsights({ survey_id: surveyId, transcripts });
      setInsights(result ?? null);
      return result;
    } finally {
      setLoading(false);
    }
  }

  return { loading, insights, regenerate };
}
