import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  detail?: string;
};

const TOKEN_KEY = "sb_token";

let _cachedToken: string | null = null;
let _tokenInitialized = false;

export const getAuthToken = async () => {
  if (_tokenInitialized) return _cachedToken;
  try {
    _cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    _tokenInitialized = true;
    return _cachedToken;
  } catch {
    return null;
  }
};

export const setAuthToken = async (token: string | null) => {
  _cachedToken = token;
  _tokenInitialized = true;
  try {
    if (token === null) await AsyncStorage.removeItem(TOKEN_KEY);
    else await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
};

export const apiBaseUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.105:8000";
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
  const token = auth ? await getAuthToken() : null;

  const res = await fetch(joinUrl(apiBaseUrl(), path), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
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
      await setAuthToken(null);
      DeviceEventEmitter.emit("auth:unauthorized");
    }
    
    throw new ApiError(msg, res.status, payload);
  }

  return body as T;
}
