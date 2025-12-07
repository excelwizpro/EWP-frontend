import { Card } from "./ui/Card";

interface OutputViewerProps {
  result: any;
  context: any;
}

export function OutputViewer({ result, context }: OutputViewerProps) {
  const hasOutput = result || context;

  return (
    <Card
      title="3 · Engine output"
      description={
        hasOutput
          ? "Preview what MTM-8 produced. In production, this will flow into Excel formulas, tables, pivots, charts and KPI cards."
          : "Run MTM-8 to see semantic context, report plans and formula plans."
      }
      className="flex-1 flex flex-col"
    >
      {!hasOutput ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-xs text-slate-400">
            No output yet. Upload a workbook, describe what you want, then run
            MTM-8.
          </p>
        </div>
      ) : (
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h3 className="mb-2 text-xs font-semibold text-slate-700">
              Result
            </h3>
            <pre className="flex-1 overflow-auto rounded-lg bg-white p-3 text-[11px] leading-relaxed text-slate-800">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
          <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h3 className="mb-2 text-xs font-semibold text-slate-700">
              Semantic context
            </h3>
            <pre className="flex-1 overflow-auto rounded-lg bg-white p-3 text-[11px] leading-relaxed text-slate-800">
              {JSON.stringify(context, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
