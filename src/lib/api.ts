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

export interface EngineRunResponse {
  ok: boolean;
  result?: any;
  context?: any;
  error?: string;
}

// Vite env: set VITE_BACKEND_URL on Vercel
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL?.toString().replace(/\/+$/, "") ?? "";

if (!BACKEND_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "[ExcelWizPro] VITE_BACKEND_URL is not set – frontend will still run but API calls will fail."
  );
}

export async function uploadWorkbook(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData
    });

    const data = (await res.json()) as any;

    return {
      ok: !!data.ok,
      workbook: data.workbook,
      schemas: data.schemas,
      error: data.error
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message ?? "Upload failed"
    };
  }
}

export async function runEngineApi(
  query: string,
  workbook?: UploadedWorkbook | null
): Promise<EngineRunResponse> {
  try {
    const res = await fetch(`${BACKEND_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        workbook: workbook ?? null
      })
    });

    const data = (await res.json()) as any;

    return {
      ok: !!data.ok,
      result: data.result,
      context: data.context,
      error: data.error
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message ?? "Engine error"
    };
  }
}
