import { useEffect, useState } from "react";
import type { UploadedWorkbook } from "@/lib/api";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export interface Template {
  id: string;
  name: string;
  query: string;
  autoRun?: boolean;
}

const STORAGE_KEY = "ewp_mtm8_templates";

interface TemplateManagerProps {
  workbook?: UploadedWorkbook;
  currentQuery: string;
  onApplyTemplate: (template: Template) => void;
  onReplaceQuery: (query: string) => void;
}

export function TemplateManager({
  workbook,
  currentQuery,
  onApplyTemplate,
  onReplaceQuery
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Template[];
        setTemplates(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch {
      // ignore
    }
  }, [templates]);

  // Auto-run template on new workbook
  useEffect(() => {
    if (!workbook) return;
    const auto = templates.find((t) => t.autoRun);
    if (auto) {
      onReplaceQuery(auto.query);
      onApplyTemplate(auto);
    }
  }, [workbook, templates, onApplyTemplate, onReplaceQuery]);

  const handleSave = () => {
    if (!name.trim() || !currentQuery.trim()) return;
    const t: Template = {
      id: crypto.randomUUID(),
      name: name.trim(),
      query: currentQuery.trim(),
      autoRun: false
    };
    setTemplates((prev) => [...prev, t]);
    setName("");
  };

  const toggleAutoRun = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, autoRun: !t.autoRun } : { ...t, autoRun: false }
      )
    );
  };

  const removeTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Card
      title="Templates"
      description="Save queries as reusable templates. Optionally mark one template to auto-run whenever a new workbook is uploaded."
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template name (e.g. Revenue by Region)"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
          />
          <Button
            variant="ghost"
            onClick={handleSave}
            disabled={!name.trim() || !currentQuery.trim()}
          >
            Save template
          </Button>
        </div>

        {templates.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            No templates yet. Type a query above, give it a name here and press
            “Save template”.
          </p>
        ) : (
          <ul className="space-y-2">
            {templates.map((t) => (
              <li
                key={t.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-800">
                      {t.name}
                    </p>
                    {t.autoRun && <Badge>Auto-run on upload</Badge>}
                  </div>
                  <p className="line-clamp-2 text-[11px] text-slate-500">
                    {t.query}
                  </p>
                  <div className="mt-1 flex gap-2 text-[11px]">
                    <button
                      className="text-slate-700 hover:text-slate-900"
                      onClick={() => onApplyTemplate(t)}
                    >
                      Apply
                    </button>
                    <button
                      className="text-slate-500 hover:text-slate-800"
                      onClick={() => toggleAutoRun(t.id)}
                    >
                      {t.autoRun ? "Disable auto-run" : "Set as auto-run"}
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removeTemplate(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
