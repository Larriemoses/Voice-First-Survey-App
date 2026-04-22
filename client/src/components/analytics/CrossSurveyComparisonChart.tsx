import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ui/ChartCard";
import { orgSurveyVolume } from "../../lib/demoData";

export function CrossSurveyComparisonChart() {
  return (
    <ChartCard title="Response volume by survey" subtitle="Published surveys">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={orgSurveyVolume}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="survey" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <RechartsTooltip />
            <Bar dataKey="responses" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
