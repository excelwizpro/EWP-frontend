"use client";

import { useRef, useState } from "react";
import { uploadWorkbookApi, UploadedWorkbook } from "@/lib/api";

interface Props {
  onUploaded: (workbook: UploadedWorkbook | undefined, schemas: any) => void;
}

export function WorkbookUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const res = await uploadWorkbookApi(file);
      if (!res.ok) {
        setError(res.error || "Upload failed");
        onUploaded(undefined, undefined);
      } else {
        onUploaded(res.workbook, res.schemas);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload error");
      onUploaded(undefined, undefined);
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  return (
    <div className="space-y-3">
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center text-xs transition-colors ${
          dragOver
            ? "border-brand bg-brand-soft/40"
            : "border-slate-300 bg-slate-50/80"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <p className="mb-2 font-medium text-slate-800">
          Drop an .xlsx workbook here
        </p>
        <p className="mb-3 text-[11px] text-slate-500">
          MTM-8 will inspect sheets, headers and datatypes to infer regions,
          measures and dimensions.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-dark"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Browse files"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {error}
        </div>
      )}

      <p className="text-[11px] text-slate-500">
        Files are processed in-memory via the backend only. Nothing is stored
        permanently.
      </p>
    </div>
  );
}
