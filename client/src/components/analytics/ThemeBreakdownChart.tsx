import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ui/ChartCard";
import { themeBreakdown } from "../../lib/demoData";

export function ThemeBreakdownChart() {
  return (
    <ChartCard title="Top themes" subtitle="AI-extracted from transcripts">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={themeBreakdown} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis type="category" dataKey="theme" width={110} tickLine={false} axisLine={false} tick={{ fill: "#374151", fontSize: 12 }} />
            <RechartsTooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
