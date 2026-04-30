import { apiJson, setAuthToken } from "@/lib/api";

export type AuthResponse = {
  token?: string;
  access_token?: string;
  access?: string;
};

const pickToken = (data: AuthResponse) => data.token ?? data.access_token ?? data.access ?? "";

export async function login(email: string, password: string) {
  const data = await apiJson<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(pickToken(data));
  return data;
}

export async function register(name: string, email: string, password: string) {
  const data = await apiJson<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  setAuthToken(pickToken(data));
  return data;
}

export async function getUserProfile() {
  return apiJson<any>("/api/auth/me", { method: "GET" });
}

export async function fetchUserHistory() {
  return apiJson<any[]>("/api/auth/history", { method: "GET" });
}
