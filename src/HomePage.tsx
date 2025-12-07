import { useCallback, useState } from "react";
import { WorkbookUploader } from "@/components/WorkbookUploader";
import { Template, TemplateManager } from "@/components/TemplateManager";
import { OutputViewer } from "@/components/OutputViewer";
import { UploadedWorkbook, runEngineApi } from "@/lib/api";

export function HomePage() {
  const [workbook, setWorkbook] = useState<UploadedWorkbook | undefined>(undefined);
  const [schemas, setSchemas] = useState<any>(undefined);
  const [query, setQuery] = useState("");
  const [refine, setRefine] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(undefined);
  const [context, setContext] = useState<any>(undefined);

  const handleUploaded = (wb: UploadedWorkbook | undefined, s: any) => {
    setWorkbook(wb);
    setSchemas(s);
    setError(null);
    setResult(undefined);
    setContext(undefined);
  };

  const effectiveQuery = refine.trim()
    ? `${query.trim()}

Refine / adjust as follows:
${refine.trim()}`
    : query;

  const handleRun = useCallback(async () => {
    if (!effectiveQuery.trim()) return;
    setRunning(true);
    setError(null);
    setResult(undefined);
    setContext(undefined);
    try {
      const res = await runEngineApi(effectiveQuery, workbook);
      if (!res.ok) {
        setError(res.error || "Engine error");
      } else {
        setResult(res.result);
        setContext(res.context);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Engine error");
    } finally {
      setRunning(false);
    }
  }, [effectiveQuery, workbook]);

  const handleApplyTemplate = (t: Template) => {
    setQuery(t.query);
    setRefine("");
  };

  return (
    <div className="gradient-ring flex min-h-screen flex-col bg-slate-950">
      {/* Top nav / brand bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 shadow-soft-xl ring-1 ring-slate-700/70">
              <span className="text-sm font-semibold text-slate-50">EW</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">
                ExcelWizPro{" "}
                <span className="ml-1 align-middle text-[11px] font-medium text-slate-400">
                  · MTM-8 semantic engine
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                Multi-intent workbook understanding · tables · pivots · charts · KPIs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
              Backend{" "}
              <span className="font-medium text-slate-100">
                Render · /upload · /run
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-4 px-4 py-4">
        {/* Left column */}
        <section className="flex w-[36%] flex-col gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft-xl">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Step 1 · Workbook
            </h2>
            <WorkbookUploader onUploaded={handleUploaded} />

            {workbook && (
              <div className="mt-4 space-y-2 rounded-2xl bg-slate-900/60 p-3">
                <p className="text-[11px] font-medium text-slate-300">
                  Detected sheets
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {workbook.sheets.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-100"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {schemas && (
              <p className="mt-2 text-[11px] text-slate-500">
                Schema built for{" "}
                <span className="font-semibold text-slate-200">
                  {schemas.length}
                </span>{" "}
                region(s).
              </p>
            )}
          </div>

          <TemplateManager workbook={workbook} onApplyTemplate={handleApplyTemplate} />

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft-xl">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Engine status
            </h2>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• MTM-8 pipeline: tokenize → bind → semantic graph → IR.</li>
              <li>• Multi-intent support: compare, trend, ratio, KPI, rank, filters.</li>
              <li>• Workbook-aware: regions, measures, dimensions, time windows.</li>
            </ul>
          </div>
        </section>

        {/* Right column */}
        <section className="flex w-[64%] flex-col gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-soft-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Step 2 · Ask MTM-8
                </h2>
                <p className="text-[11px] text-slate-500">
                  Describe the table, pivot, chart or KPI you want. The engine reads directly
                  from the uploaded workbook.
                </p>
              </div>
              <div className="hidden text-right text-[11px] text-slate-500 sm:block">
                <p>
                  Workbook:{" "}
                  <span className="font-semibold text-slate-100">
                    {workbook ? `${workbook.sheets.length} sheet(s)` : "not uploaded"}
                  </span>
                </p>
                <p>
                  Query length:{" "}
                  <span className="font-semibold text-slate-100">
                    {effectiveQuery.length}
                  </span>{" "}
                  chars
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <label className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-100">
                    Core intent
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Be explicit about measures, dimensions and time if possible.
                  </span>
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Show total revenue and margin % by region for the last 6 months, as a table plus a single KPI card for global revenue."
                  className="mt-1 w-full min-h-[96px] rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-100">Refine</p>
                  <p className="text-[11px] text-slate-500">
                    Optional tweaks without rewriting the whole prompt.
                  </p>
                </div>
                <textarea
                  value={refine}
                  onChange={(e) => setRefine(e.target.value)}
                  placeholder='e.g. "Focus only on EMEA, sort by revenue desc, and add a YoY KPI."'
                  className="w-full min-h-[70px] rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-[11px] text-red-200">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={running || !effectiveQuery.trim()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft-xl shadow-brand/40 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {running ? (
                    <>
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Running MTM-8…
                    </>
                  ) : (
                    <>
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                      Run MTM-8 on this workbook
                    </>
                  )}
                </button>
                <div className="flex flex-1 items-center justify-end gap-2 text-[11px] text-slate-500 sm:hidden">
                  <span>
                    Sheets:{" "}
                    <span className="font-semibold text-slate-100">
                      {workbook ? workbook.sheets.length : 0}
                    </span>
                  </span>
                  <span>·</span>
                  <span>
                    {effectiveQuery.length}{" "}
                    <span className="text-slate-400">chars</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-[260px] flex-1">
            <OutputViewer result={result} context={context} running={running} />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <p className="text-[11px] text-slate-500">
            ExcelWizPro MTM-8 · semantic reporting engine for Excel. This UI is a thin shell over the backend.
          </p>
          <p className="text-[11px] text-slate-500">
            Frontend · Vite + React · Backend · Render · v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
