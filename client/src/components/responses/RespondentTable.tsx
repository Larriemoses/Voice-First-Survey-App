import { Chip } from "../ui/Chip";
import { Card } from "../ui/Card";
import { RespondentMobileCard, RespondentRow } from "./RespondentRow";
import { type ResponseItem } from "../../lib/demoData";

type RespondentTableProps = {
  responses: ResponseItem[];
};

export function RespondentTable({ responses }: RespondentTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-medium text-gray-900">Respondents</h2>
        <div className="flex gap-2">
          <Chip active>All</Chip>
          <Chip>Newest</Chip>
        </div>
      </div>
      <table className="hidden w-full border-collapse md:table">
        <thead className="bg-gray-100 text-left text-xs text-gray-500">
          <tr>
            <th className="px-5 py-3 font-medium">Respondent</th>
            <th className="px-5 py-3 font-medium">Duration</th>
            <th className="px-5 py-3 font-medium">Questions</th>
            <th className="px-5 py-3 font-medium">Transcript status</th>
            <th className="px-5 py-3 font-medium">Quality</th>
            <th className="px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <RespondentRow key={response.id} response={response} />
          ))}
        </tbody>
      </table>
      <div className="grid gap-3 p-4 md:hidden">
        {responses.map((response) => (
          <RespondentMobileCard key={response.id} response={response} />
        ))}
      </div>
    </Card>
  );
}
