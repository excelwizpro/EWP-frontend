"use client";

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
    if (!Array.isArray(parsed)) return [];
    return parsed;
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

  const handleSave = () => {
    if (!name.trim() || !query.trim()) return;

    const tpl: Template = {
      id: `${Date.now()}`,
      name: name.trim(),
      query: query.trim(),
      autoRun
    };

    setTemplates((prev) => [tpl, ...prev]);
    setName("");
    setQuery("");
    setAutoRun(true);
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApply = (tpl: Template) => {
    onApplyTemplate(tpl);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-slate-900">Templates</h2>
      <p className="mb-3 text-xs text-slate-500">
        Save common questions as templates. When auto-run is on, they will run automatically when you upload a new workbook.
      </p>

      <div className="space-y-2 rounded-xl bg-slate-50 p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template name (e.g. Monthly revenue summary)"
          className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
        />
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the report this template should generate..."
          className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[11px] text-slate-600">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="h-3 w-3 rounded border-slate-300 text-brand focus:ring-brand-soft"
            />
            Auto-run this template when a new workbook is uploaded
          </label>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Save template
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {templates.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            No templates yet. Create one above.
          </p>
        ) : (
          templates.map((tpl) => (
            <div
              key={tpl.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs"
            >
              <div>
                <p className="font-semibold text-slate-800">{tpl.name}</p>
                <p className="line-clamp-2 text-[11px] text-slate-500">
                  {tpl.query}
                </p>
                {tpl.autoRun && (
                  <p className="mt-0.5 text-[10px] font-medium text-emerald-600">
                    Auto-run on upload
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={() => handleApply(tpl)}
                  className="rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-white hover:bg-brand-dark"
                >
                  Use
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(tpl.id)}
                  className="text-[11px] text-slate-400 hover:text-red-500"
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
