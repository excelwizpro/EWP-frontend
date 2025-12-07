export interface UploadedSheet {
  name: string;
  rows: any[][];
}

export interface UploadedWorkbook {
  sheets: UploadedSheet[];
}

export interface EngineRunResponse {
  ok: boolean;
  error?: string;
  result?: any;
  context?: any;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";

function ensureBackendUrl(): string {
  if (!BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_URL is not set. Configure it in Vercel / .env."
    );
  }
  return BASE_URL;
}

export async function uploadWorkbookApi(file: File): Promise<{
  ok: boolean;
  workbook?: UploadedWorkbook;
  schemas?: any;
  error?: string;
}> {
  const backend = ensureBackendUrl();

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${backend}/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      ok: false,
      error: `Upload failed (${res.status}): ${text}`
    };
  }

  const json = await res.json();
  return json;
}

export async function runEngineApi(
  query: string,
  workbook?: UploadedWorkbook
): Promise<EngineRunResponse> {
  const backend = ensureBackendUrl();

  const res = await fetch(`${backend}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      workbook
    })
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      ok: false,
      error: `Engine call failed (${res.status}): ${text}`
    };
  }

  return res.json();
}
