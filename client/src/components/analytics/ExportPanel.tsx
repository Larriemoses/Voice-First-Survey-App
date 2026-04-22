import { FileSpreadsheet, FileText, Table } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";

const options = [
  {
    icon: FileText,
    title: "PDF report",
    description: "Full analytics report with charts, AI summary, and key themes. Ready to share with stakeholders.",
    includes: "AI summary, all charts, per-question breakdown, top quotes",
    button: "Download PDF",
    primary: true,
    size: "~2.4 MB",
  },
  {
    icon: FileSpreadsheet,
    title: "XLSX workbook",
    description: "Raw response data with transcript text, sentiment scores, and keyword tags, ready for further analysis in Excel.",
    includes: "Raw data sheet, sentiment sheet, theme frequency sheet",
    button: "Download XLSX",
    primary: true,
    size: "~780 KB",
  },
  {
    icon: Table,
    title: "CSV export",
    description: "Plain comma-separated file with all response data. Use with any analytics tool.",
    includes: "Responses, transcript text, metadata",
    button: "Download CSV",
    primary: false,
    size: "~420 KB",
  },
];

export function ExportPanel() {
  return (
    <Card variant="muted">
      <h2 className="text-base font-medium text-gray-900">Export your insights</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {options.map((option) => (
          <div key={option.title} className="rounded-lg border border-gray-200 bg-white p-5">
            <option.icon className="h-5 w-5 text-primary-500" />
            <h3 className="mt-4 text-base font-medium text-gray-900">{option.title}</h3>
            <p className="mt-2 text-sm leading-5 text-gray-500">{option.description}</p>
            <p className="mt-4 text-sm text-gray-700">Includes: {option.includes}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button variant={option.primary ? "primary" : "secondary"}>{option.button}</Button>
              <span className="text-xs text-gray-400">{option.size}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
