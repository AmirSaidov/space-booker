export type ApiErrorPayload = {
  message?: string;
  error?: string;
  detail?: string;
};

const TOKEN_KEY = "sb_token";

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null) => {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
};

export const apiBaseUrl = () => {
  const raw = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL;
  return raw ? raw.replace(/\/+$/, "") : "";
};

const joinUrl = (base: string, path: string) => {
  if (!base) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;
  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export async function apiJson<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = init;
  const token = auth ? getAuthToken() : null;

  const res = await fetch(joinUrl(apiBaseUrl(), path), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? ((await res.json().catch(() => undefined)) as unknown) : await res.text().catch(() => "");

  if (!res.ok) {
    const payload = (typeof body === "object" && body !== null ? (body as ApiErrorPayload) : undefined) ?? undefined;
    const msg =
      payload?.message ||
      payload?.error ||
      payload?.detail ||
      (typeof body === "string" && body ? body : `Request failed: ${res.status}`);
    
    // If 401 Unauthorized, clear token and broadcast event so the app can redirect to login
    if (res.status === 401) {
      setAuthToken(null);
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    
    throw new ApiError(msg, res.status, payload);
  }

  return body as T;
}

