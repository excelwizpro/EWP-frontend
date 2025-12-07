"use client";

import { useState } from "react";
import type { UploadedWorkbook } from "@/lib/api";

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
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Upload failed");
      }

      onUploaded(json.workbook, json.schemas);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
      onUploaded(undefined, undefined);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-700">
        Upload workbook (.xlsx)
      </label>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleChange}
        disabled={uploading}
        className="block w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-dark"
      />
      {uploading && (
        <p className="text-[11px] text-slate-500">Uploading &amp; analysing workbook…</p>
      )}
      {error && (
        <p className="text-[11px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
