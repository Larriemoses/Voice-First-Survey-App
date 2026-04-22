import { Calendar, Download, Sparkles } from "lucide-react";
import { CrossSurveyComparisonChart } from "../components/analytics/CrossSurveyComparisonChart";
import { OrgSentimentChart } from "../components/analytics/OrgSentimentChart";
import { AppShell } from "../components/layout/AppShell";
import { AIInsightCard } from "../components/ui/AIInsightCard";
import { Button } from "../components/ui/button";
import { ChartCard } from "../components/ui/ChartCard";
import { MetricCard } from "../components/ui/MetricCard";
import { themeBreakdown } from "../lib/demoData";

export default function OrgAnalyticsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Organization analytics</h1>
            <p className="mt-1 text-sm text-gray-500">Across 4 surveys - 128 total responses</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" leadingIcon={<Calendar className="h-4 w-4" />}>Last 30 days</Button>
            <Button variant="secondary" leadingIcon={<Download className="h-4 w-4" />}>Download report</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Total responses" value="128" />
          <MetricCard label="Surveys published" value="4" />
          <MetricCard label="Overall sentiment" value="72%" trend="+6%" />
          <MetricCard label="Avg completion rate" value="78%" />
          <MetricCard label="Responses this month" value="43" trend="+14" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <CrossSurveyComparisonChart />
          <OrgSentimentChart />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <ChartCard title="Organisation-wide themes" subtitle="Sorted by frequency across all surveys">
            <div className="space-y-4">
              {themeBreakdown.map((theme, index) => (
                <div key={theme.theme}>
                  <div className="mb-1 flex items-center justify-between text-sm text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className={index % 2 === 0 ? "h-2 w-2 rounded-full bg-primary-500" : "h-2 w-2 rounded-full bg-accent-500"} />
                      {theme.theme}
                    </span>
                    <span>{theme.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className={index < 2 ? "h-full w-4/5 rounded-full bg-primary-500" : "h-full w-1/2 rounded-full bg-primary-500"} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
          <AIInsightCard
            icon={<Sparkles className="h-4 w-4" />}
            title="What your customers are consistently saying across all surveys"
            body="Customers consistently value fast delivery, practical support, and clear next steps. The most repeated opportunity is pricing transparency, especially before renewal or plan-limit discussions."
            confidence={88}
          />
        </div>
      </div>
    </AppShell>
  );
}
