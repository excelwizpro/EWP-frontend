import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export interface UploadedSheet {
  name: string;
  rows: any[][];
}

export interface UploadedWorkbook {
  sheets: UploadedSheet[];
}

export interface UploadResponse {
  ok: boolean;
  workbook?: UploadedWorkbook;
  schemas?: any;
  error?: string;
}

export interface RunEngineResponse {
  ok: boolean;
  result?: any;
  context?: any;
  error?: string;
}

export async function uploadWorkbookApi(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await axios.post(`${BASE}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return res.data as UploadResponse;
}

export async function runEngineApi(
  query: string,
  workbook?: UploadedWorkbook
): Promise<RunEngineResponse> {
  const payload: any = { query };
  if (workbook) payload.workbook = workbook;

  const res = await axios.post(`${BASE}/run`, payload, {
    headers: { "Content-Type": "application/json" }
  });

  return res.data as RunEngineResponse;
}
