import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../ui/ChartCard";
import { responseVolume } from "../../lib/demoData";

export function ResponseVolumeChart() {
  return (
    <ChartCard title="Responses over time" subtitle="Daily response count">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={responseVolume}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
            <RechartsTooltip />
            <Bar dataKey="responses" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
