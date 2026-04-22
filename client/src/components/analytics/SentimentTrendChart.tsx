import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../ui/ChartCard";
import { sentimentTrend } from "../../lib/demoData";

export function SentimentTrendChart() {
  return (
    <ChartCard
      title="Sentiment trend"
      subtitle="Last 30 days"
      actions={[
        { label: "7d" },
        { label: "30d", active: true },
        { label: "90d" },
        { label: "All" },
      ]}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sentimentTrend}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} domain={[0, 100]} />
            <RechartsTooltip />
            <Line type="monotone" dataKey="positive" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="negative" stroke="#F97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
