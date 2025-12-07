import { useCallback, useState } from "react";
import type { UploadedWorkbook } from "@/lib/api";
import { runEngineApi } from "@/lib/api";
import { WorkbookUploader } from "@/components/WorkbookUploader";
import { TemplateManager, type Template } from "@/components/TemplateManager";
import { OutputViewer } from "@/components/OutputViewer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function App() {
  const [workbook, setWorkbook] = useState<UploadedWorkbook | undefined>();
  const [schemas, setSchemas] = useState<any>();
  const [query, setQuery] = useState("");
  const [refine, setRefine] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>();
  const [context, setContext] = useState<any>();

  const effectiveQuery = refine.trim()
    ? `${query.trim()}\n\nRefine / adjust as follows:\n${refine.trim()}`
    : query;

  const handleUploaded = (wb?: UploadedWorkbook, s?: any) => {
    setWorkbook(wb);
    setSchemas(s);
    setError(null);
    setResult(undefined);
    setContext(undefined);
  };

  const handleApplyTemplate = (t: Template) => {
    setQuery(t.query);
    setRefine("");
  };

  const handleRun = useCallback(async () => {
    if (!effectiveQuery.trim()) return;
    setRunning(true);
    setError(null);
    setResult(undefined);
    setContext(undefined);

    const res = await runEngineApi(effectiveQuery, workbook ?? null);

    if (!res.ok) {
      setError(res.error ?? "Engine error");
    } else {
      setResult(res.result);
      setContext(res.context);
    }

    setRunning(false);
  }, [effectiveQuery, workbook]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top nav */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-subtle">
              EW
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">
                ExcelWizPro{" "}
                <span className="align-middle">
                  <Badge>MTM-8</Badge>
                </span>
              </p>
              <p className="text-xs text-slate-500">
                White-label UI shell for your multi-intent MTM-8 engine.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Backend:
              <span className="font-medium text-slate-700">
                Render · /upload · /run
              </span>
            </span>
            <span className="mt-0.5 text-[10px] text-slate-400">
              Schemas: {schemas ? "detected" : "pending"}
            </span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 md:flex-row">
        {/* Left column */}
        <div className="flex w-full flex-col gap-4 md:w-[38%]">
          <WorkbookUploader onUploaded={handleUploaded} />

          <TemplateManager
            workbook={workbook}
            currentQuery={query}
            onApplyTemplate={(t) => {
              handleApplyTemplate(t);
            }}
            onReplaceQuery={setQuery}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">
              Engine notes
            </h2>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>• MTM-8 parses the workbook into regions and fields.</li>
              <li>• It builds a semantic graph and calculation IR.</li>
              <li>
                • This UI just previews what the backend already understands –{" "}
                you’ll wire it into Excel formulas, tables and pivots.
              </li>
            </ul>
          </section>
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col gap-4 md:w-[62%]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">
              2 · Ask a question
            </h2>
            <p className="mb-3 text-xs text-slate-500">
              Describe the table, pivot, chart or KPI you want. The engine uses
              the uploaded workbook as context.
            </p>

            <div className="space-y-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Show total revenue by region for the last 6 months as a table and a KPI card."
                className="w-full min-h-[90px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-800">Refine</p>
                  <p className="text-[11px] text-slate-500">
                    Optional: nudge the engine without rewriting everything.
                  </p>
                </div>
                <textarea
                  value={refine}
                  onChange={(e) => setRefine(e.target.value)}
                  placeholder='e.g. "Focus only on Europe and sort descending by revenue."'
                  className="w-full min-h-[60px] rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  onClick={handleRun}
                  disabled={running || !effectiveQuery.trim()}
                >
                  {running ? (
                    <>
                      <Spinner />
                      Running MTM-8…
                    </>
                  ) : (
                    <>
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                      Run MTM-8
                    </>
                  )}
                </Button>
                <div className="flex flex-1 flex-wrap items-center justify-end gap-3 text-[11px] text-slate-500">
                  <span>
                    Workbook:{" "}
                    <strong className="font-semibold">
                      {workbook
                        ? `${workbook.sheets.length} sheet(s)`
                        : "not uploaded"}
                    </strong>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    Query length:{" "}
                    <strong>{effectiveQuery.trim().length}</strong> chars
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex min-h-[260px] flex-1">
            <OutputViewer result={result} context={context} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
          <p className="text-[11px] text-slate-500">
            ExcelWizPro MTM-8 · minimal white UI shell over your semantic
            engine.
          </p>
          <p className="text-[11px] text-slate-400">v1.0 · Frontend only</p>
        </div>
      </footer>
    </div>
  );
}
