import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { UrlResult } from "@/types/prism";

interface IntentRadarProps {
  result: UrlResult;
}

export function IntentRadar({ result }: IntentRadarProps) {
  const data = [
    { intent: "Informational", value: result.informational_score, fullMark: 1 },
    { intent: "Navigational", value: result.navigational_score, fullMark: 1 },
    { intent: "Commercial", value: result.commercial_score, fullMark: 1 },
    { intent: "Transactional", value: result.transactional_score, fullMark: 1 },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs text-primary truncate" title={result.url}>
            {result.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dominant: <span className="text-foreground capitalize">{result.dominant_intent}</span>
          </p>
        </div>
        <span
          className={`
            font-display text-xs px-2 py-0.5 rounded-full
            ${result.confidence > 0.4
              ? "bg-primary/15 text-primary"
              : "bg-secondary text-muted-foreground"
            }
          `}
        >
          {(result.confidence * 100).toFixed(0)}%
        </span>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(220 14% 18%)" />
            <PolarAngleAxis
              dataKey="intent"
              tick={{ fill: "hsl(215 12% 50%)", fontSize: 10, fontFamily: "Circular" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 1]}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              stroke="hsl(174 72% 52%)"
              fill="hsl(174 72% 52%)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 18% 10%)",
                border: "1px solid hsl(220 14% 18%)",
                borderRadius: "6px",
                fontFamily: "Circular",
                fontSize: "11px",
              }}
              formatter={(value: number) => [(value * 100).toFixed(1) + "%"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {data.map((d) => (
          <div key={d.intent} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{d.intent}</span>
            <span className="font-display text-foreground">{(d.value * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
