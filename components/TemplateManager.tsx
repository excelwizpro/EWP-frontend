"use client";

import { useEffect, useState } from "react";
import type { UploadedWorkbook } from "@/lib/api";

export interface Template {
  id: string;
  name: string;
  query: string;
  createdAt: string;
  sheetSummary?: string;
}

interface Props {
  workbook?: UploadedWorkbook;
  onApplyTemplate: (t: Template) => void;
}

const STORAGE_KEY = "ewp-mtm8-templates";

function loadTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
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
  const [queryDraft, setQueryDraft] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const handleSave = () => {
    if (!queryDraft.trim()) return;
    const id = `tpl_${Date.now()}`;
    const sheetSummary = workbook
      ? `${workbook.sheets.length} sheet(s): ${workbook.sheets
          .map((s) => s.name)
          .join(", ")}`
      : undefined;

    const tpl: Template = {
      id,
      name: name.trim() || "Untitled template",
      query: queryDraft,
      createdAt: new Date().toISOString(),
      sheetSummary
    };

    const next = [tpl, ...templates];
    setTemplates(next);
    saveTemplates(next);
    setName("");
  };

  const handleDelete = (id: string) => {
    const next = templates.filter((t) => t.id !== id);
    setTemplates(next);
    saveTemplates(next);
    if (selectedId === id) setSelectedId(null);
  };

  const selected = templates.find((t) => t.id === selectedId) || null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-slate-900">
        Templates (beta)
      </h2>
      <p className="mb-3 text-xs text-slate-500">
        Save frequently-used MTM-8 prompts and re-run them on new workbooks.
      </p>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Template name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
        />
        <textarea
          placeholder="Paste or type the prompt you want to save as a template."
          value={queryDraft}
          onChange={(e) => setQueryDraft(e.target.value)}
          className="w-full min-h-[70px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand-soft"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!queryDraft.trim()}
          className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save template
        </button>
      </div>

      {templates.length > 0 ? (
        <div className="mt-4 grid gap-2 text-[11px] text-slate-700">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedId(t.id);
                onApplyTemplate(t);
              }}
              className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-left transition ${
                selectedId === t.id
                  ? "border-brand bg-brand-soft/60"
                  : "border-slate-200 bg-slate-50 hover:border-brand-soft"
              }`}
            >
              <span className="flex-1 truncate">
                <span className="font-semibold">{t.name}</span>
                {t.sheetSummary && (
                  <span className="ml-1 text-slate-500">
                    · {t.sheetSummary}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(t.id);
                }}
                className="ml-2 text-[10px] text-slate-400 hover:text-red-500"
              >
                Delete
              </button>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-slate-400">
          No templates yet. Save a query above and it will appear here.
        </p>
      )}
    </div>
  );
}
