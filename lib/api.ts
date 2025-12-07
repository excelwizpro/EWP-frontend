export interface UploadedSheet {
  name: string;
  rows: any[][];
}

export interface UploadedWorkbook {
  sheets: UploadedSheet[];
}

export interface RunEngineResponse {
  ok: boolean;
  error?: string;
  result?: any;
  context?: any;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function runEngineApi(
  query: string,
  workbook?: UploadedWorkbook
): Promise<RunEngineResponse> {
  const payload: any = { query };
  if (workbook) payload.workbook = workbook;

  const res = await fetch(`${BACKEND_URL}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      ok: false,
      error: text || `HTTP ${res.status}`
    };
  }

  const json = await res.json();
  return json as RunEngineResponse;
}
