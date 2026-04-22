import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ui/ChartCard";
import { sentimentByQuestion } from "../../lib/demoData";

export function SentimentByQuestionChart() {
  return (
    <ChartCard title="Sentiment per question" subtitle="Positive, neutral, and negative share">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sentimentByQuestion}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="question" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="positive" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="neutral" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="negative" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
