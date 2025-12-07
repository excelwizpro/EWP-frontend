import { useState } from "react";

interface Props {
  result: any;
  context: any;
  running: boolean;
}

type TabId = "context" | "result" | "raw";

export function OutputViewer({ result, context, running }: Props) {
  const [tab, setTab] = useState<TabId>("context");

  const hasContext = !!context;
  const hasResult = !!result;

  if (!hasContext && !hasResult && !running) {
    return (
      <div className="flex w-full flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 text-xs text-slate-500">
        Engine output will appear here after you run MTM-8.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft-xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px]">
            🔍
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-100">
              MTM-8 semantic breakdown
            </p>
            <p className="text-[11px] text-slate-500">
              Inspect what the engine understood and how it plans the report.
            </p>
          </div>
        </div>
        {running && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Running MTM-8…
          </span>
        )}
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-900/80 p-1">
        <button
          type="button"
          onClick={() => setTab("context")}
          className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition ${
            tab === "context"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-400 hover:text-slate-100"
          }`}
        >
          Semantic context
        </button>
        <button
          type="button"
          onClick={() => setTab("result")}
          className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition ${
            tab === "result"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-400 hover:text-slate-100"
          }`}
        >
          Engine result
        </button>
        <button
          type="button"
          onClick={() => setTab("raw")}
          className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition ${
            tab === "raw"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-400 hover:text-slate-100"
          }`}
        >
          Raw JSON
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/40" />
        <pre className="relative h-full max-h-[360px] overflow-auto bg-transparent p-3 text-[11px] leading-relaxed text-slate-100">
          {tab === "context" && (hasContext ? JSON.stringify(context, null, 2) : "// No semantic context returned yet.")}
          {tab === "result" && (hasResult ? JSON.stringify(result, null, 2) : "// No engine result yet.")}
          {tab === "raw" &&
            JSON.stringify(
              {
                context: context ?? null,
                result: result ?? null
              },
              null,
              2
            )}
        </pre>
      </div>
    </div>
  );
}
