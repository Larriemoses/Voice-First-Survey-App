import { useCallback } from "react";
import { exportElementToPDF } from "../lib/exportPDF";
import { exportResponsesWorkbook } from "../lib/exportXLSX";

export function useExport() {
  const exportPDF = useCallback((element: HTMLElement) => exportElementToPDF(element), []);
  const exportXLSX = useCallback(() => exportResponsesWorkbook(), []);

  return { exportPDF, exportXLSX };
}
