"use client";

interface Props {
  result: any;
  context?: any;
}

export function OutputViewer({ result, context }: Props) {
  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
        MTM-8 output will appear here after you run a query.
      </div>
    );
  }

  const semantic = result.semanticContext || context || {};

  return (
    <div className="flex w-full flex-1 gap-4">
      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">
          Engine summary
        </h3>
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            <span className="font-semibold">Primary intent:</span>{" "}
            {semantic.intent?.intent || "n/a"}
          </p>
          <p>
            <span className="font-semibold">Measures:</span>{" "}
            {Array.isArray(semantic.measures) && semantic.measures.length > 0
              ? semantic.measures.map((m: any) => m.field).join(", ")
              : "none detected"}
          </p>
          <p>
            <span className="font-semibold">Group by:</span>{" "}
            {Array.isArray(semantic.groupBys) &&
            semantic.groupBys.length > 0
              ? semantic.groupBys.map((g: any) => g.field).join(", ")
              : "none"}
          </p>
        </div>
      </div>
      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-100">
            Raw JSON (debug)
          </h3>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
            MTM-8 payload
          </span>
        </div>
        <pre className="h-full max-h-[320px] overflow-auto text-[11px] leading-relaxed">
{JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}
