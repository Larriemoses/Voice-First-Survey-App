import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ui/ChartCard";
import { orgSentimentTrend } from "../../lib/demoData";

export function OrgSentimentChart() {
  return (
    <ChartCard title="Sentiment over time (all surveys)" subtitle="Positive sentiment by survey">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={orgSentimentTrend}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <RechartsTooltip />
            <Line type="monotone" dataKey="q4" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="onboarding" stroke="#F97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="exit" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
