import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { responses, type ResponseItem } from "../lib/demoData";

export function useRealtimeResponses(surveyId: string) {
  const [items, setItems] = useState<ResponseItem[]>(responses.slice(0, 2));

  useEffect(() => {
    const channel = supabase
      .channel(`survey-responses-${surveyId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "responses", filter: `survey_id=eq.${surveyId}` },
        () => setItems((current) => [responses[Math.floor(Math.random() * responses.length)], ...current].slice(0, 5)),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [surveyId]);

  return { responses: items };
}
