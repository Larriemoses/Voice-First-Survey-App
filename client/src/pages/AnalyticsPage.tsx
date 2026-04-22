import { Calendar, Download, Share2, Sparkles } from "lucide-react";
import { useState } from "react";
import { AISummaryPanel } from "../components/analytics/AISummaryPanel";
import { EmotionDonutChart } from "../components/analytics/EmotionDonutChart";
import { ExportPanel } from "../components/analytics/ExportPanel";
import { KeywordCloud } from "../components/analytics/KeywordCloud";
import { QuestionAccordion } from "../components/analytics/QuestionAccordion";
import { ResponseSearch } from "../components/analytics/ResponseSearch";
import { ResponseVolumeChart } from "../components/analytics/ResponseVolumeChart";
import { SentimentByQuestionChart } from "../components/analytics/SentimentByQuestionChart";
import { SentimentTrendChart } from "../components/analytics/SentimentTrendChart";
import { ThemeBreakdownChart } from "../components/analytics/ThemeBreakdownChart";
import { AppShell } from "../components/layout/AppShell";
import { BuilderNav } from "../components/layout/BuilderNav";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { MetricCard } from "../components/ui/MetricCard";
import { Modal } from "../components/ui/Modal";
import { SkeletonBlock } from "../components/ui/SkeletonBlock";
import { Toggle } from "../components/ui/Toggle";
import { useToast } from "../components/ui/Toast";

function LoadingCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-5">
          <SkeletonBlock className="h-5 w-44" />
          <SkeletonBlock className="mt-3 h-4 w-28" />
          <SkeletonBlock className="mt-6 h-64" />
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [publicEnabled, setPublicEnabled] = useState(true);
  const { showToast } = useToast();

  function regenerate() {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      showToast({ title: "Insights updated", variant: "success" });
    }, 1100);
  }

  return (
    <AppShell>
      {loading ? <div className="ai-progress" /> : null}
      <BuilderNav />
      <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Analytics - Q4 customer satisfaction</h1>
            <p className="mt-1 text-sm text-gray-500">43 responses - Last updated 2 hours ago</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" leadingIcon={<Sparkles className="h-4 w-4 text-accent-600" />} onClick={regenerate}>Regenerate insights</Button>
            <Button variant="secondary" leadingIcon={<Share2 className="h-4 w-4" />} onClick={() => setShareOpen(true)}>Share report</Button>
            <Button variant="secondary" leadingIcon={<Download className="h-4 w-4" />}>Download PDF</Button>
            <Button variant="secondary" leadingIcon={<Download className="h-4 w-4" />}>Export XLSX</Button>
            <Button variant="ghost" leadingIcon={<Calendar className="h-4 w-4" />}>Last 30 days</Button>
          </div>
        </div>

        <div className="mt-6">
          <AISummaryPanel loading={loading} onRegenerate={regenerate} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Overall sentiment score" value="78% positive" sub="Up from 66%" trend="+12 pts" />
          <MetricCard label="Avg response length" value="1m 48s" sub="Rich spoken answers" />
          <MetricCard label="Top emotion detected" value="Satisfied" sub="Dominant across responses" />
          <MetricCard label="Response volume trend" value="+14 this week" sub="Momentum is increasing" trend="+19%" />
        </div>

        <section className="mt-6">
          {loading ? (
            <LoadingCharts />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 motion-safe:animate-[fade-in_200ms_ease]">
              <SentimentTrendChart />
              <ResponseVolumeChart />
              <ThemeBreakdownChart />
              <SentimentByQuestionChart />
              <KeywordCloud />
              <EmotionDonutChart />
            </div>
          )}
        </section>

        <section className="mt-8">
          <QuestionAccordion />
        </section>

        <section className="mt-8">
          <ResponseSearch />
        </section>

        <section className="mt-8">
          <ExportPanel />
        </section>
      </div>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share analytics report" description="Public reports exclude individual respondent data.">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable public link</p>
              <p className="mt-1 text-sm text-gray-500">Anyone with the URL can view summary charts and themes.</p>
            </div>
            <Toggle checked={publicEnabled} onClick={() => setPublicEnabled((value) => !value)} />
          </div>
          <Input defaultValue="https://survica.app/report/acme-q4" readOnly />
          <Button onClick={() => setShareOpen(false)}>Copy link</Button>
        </div>
      </Modal>
    </AppShell>
  );
}
