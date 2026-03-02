import { ProcessingState } from "@/types/prism";

interface ProgressTrackerProps {
  state: ProcessingState;
}

export function ProgressTracker({ state }: ProgressTrackerProps) {
  const { urls, currentIndex, currentUrl, results } = state;
  const total = urls.length;
  const progress = total > 0 ? ((currentIndex + (state.phase === "complete" ? 1 : 0)) / total) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-display text-sm text-muted-foreground">
          Processing <span className="text-primary">{Math.min(currentIndex + 1, total)}</span>
          <span className="text-muted-foreground/60"> / {total}</span>
        </p>
        <p className="font-display text-sm text-primary">{Math.round(progress)}%</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-primary/50 animate-scan-line" />
        </div>
      </div>

      {/* Current URL */}
      <div className="bg-card border border-border rounded-md px-4 py-3">
        <p className="font-display text-xs text-muted-foreground truncate">
          {state.phase === "complete" ? "✓ Complete" : `→ ${currentUrl}`}
        </p>
      </div>

      {/* URL list */}
      <div className="max-h-64 overflow-y-auto space-y-1">
        {urls.map((url, i) => {
          const done = i < results.length;
          const active = i === currentIndex && state.phase !== "complete";
          return (
            <div
              key={i}
              className={`
                flex items-center gap-3 px-3 py-1.5 rounded text-xs font-display transition-colors
                ${active ? "bg-primary/10 text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/40"}
              `}
            >
              <span className="w-4 text-center">
                {done ? "✓" : active ? "▸" : "·"}
              </span>
              <span className="truncate">{url}</span>
              {done && results[i] && (
                <span className="ml-auto text-primary/70 whitespace-nowrap">
                  {results[i].dominant_intent}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
