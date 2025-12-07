import { useState } from "react";
import type { UploadedWorkbook } from "@/lib/api";
import { uploadWorkbookApi } from "@/lib/api";

interface Props {
  onUploaded: (wb: UploadedWorkbook | undefined, schemas: any) => void;
}

export function WorkbookUploader({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const res = await uploadWorkbookApi(file);
      if (!res.ok) {
        throw new Error(res.error || "Upload failed");
      }
      onUploaded(res.workbook, res.schemas);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
      onUploaded(undefined, undefined);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-100">Workbook</p>
          <p className="text-[11px] text-slate-400">
            Upload .xlsx and MTM-8 will infer regions, measures, dimensions.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-6 text-center transition hover:border-slate-500 hover:bg-slate-900/70">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/70 shadow-sm">
          <span className="text-lg">📄</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-100">
            Drop Excel file or click to browse
          </p>
          <p className="text-[11px] text-slate-500">
            .xlsx • first row as headers • up to ~5MB
          </p>
        </div>
        {uploading && (
          <p className="text-[11px] text-emerald-300">
            Analysing workbook with MTM-8 schema builder…
          </p>
        )}
        {error && (
          <p className="text-[11px] text-red-300">
            {error}
          </p>
        )}
      </label>
    </div>
  );
}
