import { useEffect, useState } from "react";
import type { UploadedWorkbook } from "@/lib/api";

export interface Template {
  id: string;
  name: string;
  query: string;
  autoRun: boolean;
}

interface Props {
  workbook?: UploadedWorkbook;
  onApplyTemplate: (tpl: Template) => void;
}

const STORAGE_KEY = "ewp_mtm8_templates_v1";

function loadTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Template[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTemplates(templates: Template[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch {
    // ignore
  }
}

export function TemplateManager({ workbook, onApplyTemplate }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [autoRun, setAutoRun] = useState(true);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    if (!workbook) return;
    // auto-run templates flagged as autoRun
    const auto = templates.filter(t => t.autoRun);
    if (auto.length === 0) return;
    // for now, just pick the first
    onApplyTemplate(auto[0]);
  }, [workbook]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (!name.trim() || !query.trim()) return;
    const tpl: Template = {
      id: `${Date.now()}`,
      name: name.trim(),
      query: query.trim(),
      autoRun
    };
    setTemplates(prev => [tpl, ...prev]);
    setName("");
    setQuery("");
    setAutoRun(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleApply = (tpl: Template) => {
    onApplyTemplate(tpl);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-soft-xl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold text-slate-100">
            Templates &amp; presets
          </h2>
          <p className="text-[11px] text-slate-500">
            Save common analysis flows and auto-run them on new workbooks.
          </p>
        </div>
        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
          Local only
        </span>
      </div>

      <div className="mt-3 space-y-2 rounded-xl bg-slate-900/70 p-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Template name (e.g. Margin by region dashboard)"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
        />
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Describe what this template should build (tables, pivots, charts, KPIs)…"
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
        />
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-[11px] text-slate-400">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={e => setAutoRun(e.target.checked)}
              className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-brand focus:ring-brand-soft"
            />
            Auto-run when a new workbook is uploaded
          </label>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white shadow hover:bg-brand-dark"
          >
            Save template
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {templates.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            No templates yet. Save a few of your favourite questions and flows.
          </p>
        ) : (
          templates.map(tpl => (
            <div
              key={tpl.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px]"
            >
              <div className="max-w-[70%]">
                <p className="truncate text-xs font-semibold text-slate-100">
                  {tpl.name}
                </p>
                <p className="line-clamp-2 text-[11px] text-slate-500">
                  {tpl.query}
                </p>
                {tpl.autoRun && (
                  <p className="mt-0.5 text-[10px] font-medium text-emerald-300">
                    Auto-runs on upload
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={() => handleApply(tpl)}
                  className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-900 hover:bg-white"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(tpl.id)}
                  className="text-[10px] text-slate-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
