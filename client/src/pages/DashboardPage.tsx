import { Plus } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { LiveDrawer } from "../components/responses/LiveDrawer";
import { SurveyRow } from "../components/survey/SurveyRow";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Chip } from "../components/ui/Chip";
import { MetricCard } from "../components/ui/MetricCard";
import { surveys } from "../lib/demoData";

export default function DashboardPage() {
  const [filter, setFilter] = useState("All");
  const [liveOpen, setLiveOpen] = useState(false);
  const filteredSurveys = filter === "All" ? surveys : surveys.filter((survey) => survey.status === filter.toLowerCase());

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Good morning, Jane</h1>
            <p className="mt-1 text-sm text-gray-500">Here is what is happening</p>
          </div>
          <Button leadingIcon={<Plus className="h-4 w-4" />}>New survey</Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total responses" value="128" sub="Across all surveys" trend="+12%" />
          <MetricCard label="Active surveys" value="2" sub="Publishing now" />
          <MetricCard label="Avg completion rate" value="78%" sub="Last 30 days" trend="+4%" />
          <MetricCard label="Pending transcripts" value="6" sub="Ready for AI processing" trend="Needs review" trendDirection="down" />
        </div>

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900">My surveys</h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Active", "Draft", "Closed"].map((item) => (
                <Chip key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</Chip>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {filteredSurveys.map((survey) => (
              <SurveyRow key={survey.id} survey={survey} onOpenLive={() => setLiveOpen(true)} />
            ))}
          </div>
        </section>

        <Card className="mt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Latest insights from Q4 customer satisfaction</p>
              <h2 className="mt-2 text-lg font-medium text-gray-900">Customers praise fast delivery, but pricing needs clearer communication.</h2>
            </div>
            <a href="/dashboard/surveys/q4-customer-satisfaction/analytics" className="text-sm font-medium text-accent-600">
              Open full analytics
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip active>Top theme: delivery speed</Chip>
            <Chip active>78% positive sentiment</Chip>
            <Chip active>+14 responses this week</Chip>
          </div>
        </Card>
      </div>
      <LiveDrawer open={liveOpen} onClose={() => setLiveOpen(false)} />
    </AppShell>
  );
}
