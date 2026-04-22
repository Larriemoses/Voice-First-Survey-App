import * as XLSX from "xlsx";
import { responses, themeBreakdown } from "./demoData";

export function exportResponsesWorkbook(filename = "survica-responses.xlsx") {
  const workbook = XLSX.utils.book_new();
  const responseSheet = XLSX.utils.json_to_sheet(responses);
  const themeSheet = XLSX.utils.json_to_sheet(themeBreakdown);

  XLSX.utils.book_append_sheet(workbook, responseSheet, "Responses");
  XLSX.utils.book_append_sheet(workbook, themeSheet, "Themes");
  XLSX.writeFile(workbook, filename);
}
