import { Play, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { QualityScore } from "./QualityScore";
import { TranscriptBadge } from "./TranscriptBadge";
import { type ResponseItem } from "../../lib/demoData";

type RespondentRowProps = {
  response: ResponseItem;
};

export function RespondentRow({ response }: RespondentRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-sm font-medium text-primary-700">{response.respondent.slice(-2)}</span>
          <div>
            <p className="font-medium text-gray-900">{response.respondent}</p>
            <p className="text-sm text-gray-500">{response.timestamp}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-gray-700">{response.duration}</td>
      <td className="px-5 py-4 text-gray-700">{response.questionCount}</td>
      <td className="px-5 py-4"><TranscriptBadge status={response.status} /></td>
      <td className="px-5 py-4"><QualityScore score={response.quality} rationale={response.qualityRationale} /></td>
      <td className="px-5 py-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" leadingIcon={<Play className="h-3.5 w-3.5 text-accent-600" />}>Audio</Button>
          <Button variant="secondary" size="sm">{response.status === "done" ? "View" : "Transcribe"}</Button>
        </div>
      </td>
    </tr>
  );
}

export function RespondentMobileCard({ response }: RespondentRowProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-gray-900">{response.respondent}</p>
          <p className="mt-1 text-sm text-gray-500">{response.timestamp} - {response.duration}</p>
        </div>
        <TranscriptBadge status={response.status} />
      </div>
      <p className="mt-3 line-clamp-4 text-sm leading-5 text-gray-700">{response.transcript}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <QualityScore score={response.quality} rationale={response.qualityRationale} />
        <Button variant="ghost" size="sm" leadingIcon={<Sparkles className="h-3.5 w-3.5 text-accent-600" />}>Review</Button>
      </div>
    </div>
  );
}
