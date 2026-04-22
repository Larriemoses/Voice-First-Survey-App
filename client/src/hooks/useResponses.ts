import { useEffect, useState } from "react";
import { responses, type ResponseItem } from "../lib/demoData";

export function useResponses() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ResponseItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(responses);
      setLoading(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return { loading, responses: items };
}
