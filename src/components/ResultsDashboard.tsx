import { UrlResult } from "@/types/prism";
import { IntentRadar } from "./IntentRadar";
import { Download } from "lucide-react";

interface ResultsDashboardProps {
  results: UrlResult[];
  onReset: () => void;
}

export function ResultsDashboard({ results, onReset }: ResultsDashboardProps) {
  const intentCounts = results.reduce(
    (acc, r) => {
      acc[r.dominant_intent] = (acc[r.dominant_intent] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const avgConfidence =
    results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Summary */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-card border border-border rounded-lg px-5 py-4 flex-1 min-w-[140px]">
          <p className="text-xs text-muted-foreground">URLs Analysed</p>
          <p className="font-display text-2xl text-primary mt-1">{results.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg px-5 py-4 flex-1 min-w-[140px]">
          <p className="text-xs text-muted-foreground">Avg Confidence</p>
          <p className="font-display text-2xl text-foreground mt-1">
            {(avgConfidence * 100).toFixed(1)}%
          </p>
        </div>
        {Object.entries(intentCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([intent, count]) => (
            <div
              key={intent}
              className="bg-card border border-border rounded-lg px-5 py-4 flex-1 min-w-[140px]"
            >
              <p className="text-xs text-muted-foreground capitalize">{intent}</p>
              <p className="font-display text-2xl text-foreground mt-1">{count}</p>
            </div>
          ))}
      </div>

      {/* Radar charts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, i) => (
          <IntentRadar key={i} result={result} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            const header = "url,status_code,informational_score,navigational_score,commercial_score,transactional_score,dominant_intent,confidence,intent_mixedness";
            const rows = results.map((r) =>
              [r.url, r.status_code, r.informational_score, r.navigational_score, r.commercial_score, r.transactional_score, r.dominant_intent, r.confidence, r.intent_mixedness].join(",")
            );
            const csv = [header, ...rows].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "prism_intent_output.csv";
            a.click();
          }}
          className="font-display text-xs text-foreground hover:text-primary transition-colors px-6 py-2 border border-border rounded-md hover:border-primary/40 flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
        <button
          onClick={onReset}
          className="font-display text-xs text-muted-foreground hover:text-primary transition-colors px-6 py-2 border border-border rounded-md hover:border-primary/40"
        >
          ← New Analysis
        </button>
      </div>
    </div>
  );
}
