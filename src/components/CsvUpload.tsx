import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

interface CsvUploadProps {
  onUpload: (csvText: string) => void;
}

export function CsvUpload({ onUpload }: CsvUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const csvTextRef = useRef<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      csvTextRef.current = e.target?.result as string;
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleGo = () => {
    if (csvTextRef.current) {
      onUpload(csvTextRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div
        className={`
          relative w-full border-2 border-dashed rounded-lg p-12
          flex flex-col items-center gap-4 cursor-pointer transition-all duration-300
          ${dragOver
            ? "border-primary bg-primary/5 glow-primary"
            : fileName
              ? "border-primary/40 bg-card"
              : "border-border bg-card hover:border-muted-foreground"
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-muted-foreground" />
        {fileName ? (
          <div className="text-center">
            <p className="font-display text-sm text-primary">{fileName}</p>
            <p className="text-xs text-muted-foreground mt-1">Ready to analyse</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-foreground">Drop your CSV here</p>
            <p className="text-xs text-muted-foreground mt-1">
              Must contain a column named <span className="font-display text-primary">url</span>
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <button
        onClick={handleGo}
        disabled={!fileName}
        className={`
          font-display text-sm font-semibold tracking-wider uppercase px-12 py-3 rounded-md
          transition-all duration-300
          ${fileName
            ? "bg-primary text-primary-foreground glow-primary hover:glow-strong"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
          }
        `}
      >
        Analyse
      </button>
    </div>
  );
}
