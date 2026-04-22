import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { ChartCard } from "../ui/ChartCard";
import { emotionDistribution } from "../../lib/demoData";

export function EmotionDonutChart() {
  return (
    <ChartCard title="Emotion breakdown" subtitle="Dominant emotion: satisfied">
      <div className="grid min-h-64 gap-4 sm:grid-cols-[1fr_180px] sm:items-center">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={emotionDistribution} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2}>
                {emotionDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {emotionDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-3 text-sm text-gray-700">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                {item.name}
              </span>
              <span className="text-gray-500">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
