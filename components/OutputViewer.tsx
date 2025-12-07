"use client";

interface Props {
  result: any;
  context: any;
}

export function OutputViewer({ result, context }: Props) {
  if (!result && !context) {
    return (
      <div className="flex w-full flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
        Engine output will appear here after you run MTM-8.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {result && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Engine result</h3>
          <pre className="max-h-72 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      {context && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Semantic context</h3>
          <pre className="max-h-72 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
