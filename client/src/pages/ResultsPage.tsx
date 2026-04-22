import { Download, Sparkles } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { BuilderNav } from "../components/layout/BuilderNav";
import { RespondentTable } from "../components/responses/RespondentTable";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { MetricCard } from "../components/ui/MetricCard";
import { responses } from "../lib/demoData";

export default function ResultsPage() {
  return (
    <AppShell>
      <BuilderNav />
      <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Results</h1>
            <p className="mt-1 text-sm text-gray-500">Review audio, transcripts, and response quality.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" leadingIcon={<Download className="h-4 w-4" />}>Export</Button>
            <Button leadingIcon={<Sparkles className="h-4 w-4" />}>Transcribe all (6)</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MetricCard label="Respondents" value="43" sub="Anonymous participants" />
          <MetricCard label="Transcribed" value="37" sub="6 waiting" trend="+8 today" />
          <MetricCard label="Avg duration" value="1m 48s" sub="Per response" />
        </div>

        <div className="mt-6">
          <RespondentTable responses={responses} />
        </div>

        <Card className="mt-6">
          <h2 className="text-base font-medium text-gray-900">Activity log</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>Jane transcribed 5 responses - 1 hr ago</p>
            <p>Moses exported a PDF report - yesterday</p>
            <p>Lina reviewed 9 negative responses - 2 days ago</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
