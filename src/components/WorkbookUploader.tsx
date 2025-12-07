import { useRef, useState } from "react";
import { uploadWorkbook, type UploadedWorkbook } from "@/lib/api";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Spinner } from "./ui/Spinner";

interface WorkbookUploaderProps {
  onUploaded: (wb?: UploadedWorkbook, schemas?: any) => void;
}

export function WorkbookUploader({ onUploaded }: WorkbookUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (file?: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setError(null);
    setUploading(true);

    const res = await uploadWorkbook(file);
    setUploading(false);

    if (!res.ok) {
      setError(res.error ?? "Upload failed");
      onUploaded(undefined, undefined);
      return;
    }
    onUploaded(res.workbook, res.schemas);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    void handleFileChange(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card
      title="1 · Workbook"
      description="Upload an Excel workbook (.xlsx). MTM-8 will infer regions, measures and dimensions automatically."
      className="shadow-none border-dashed"
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-300 hover:bg-slate-100"
        onClick={handleClick}
      >
        <p className="text-xs font-medium text-slate-700">
          Drop an Excel file here, or click to browse.
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          We only send the file to your MTM-8 backend.
        </p>
        {fileName && (
          <p className="mt-2 truncate text-[11px] text-slate-500">
            Selected: <span className="font-semibold text-slate-700">{fileName}</span>
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>Tip: A clean header row dramatically improves semantic detection.</span>
        {uploading && (
          <span className="inline-flex items-center gap-1">
            <Spinner size={12} />
            Uploading…
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {error}
        </p>
      )}
    </Card>
  );
}
