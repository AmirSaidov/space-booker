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

export async function updateUserProfile(data: any) {
  return apiJson<any>("/api/auth/me", { method: "PATCH", body: JSON.stringify(data) });
}

export async function fetchUserHistory() {
  return apiJson<any[]>("/api/auth/history", { method: "GET" });
}

export async function clearUserHistory() {
  return apiJson<{ success: boolean; message: string }>("/api/auth/history", { method: "DELETE" });
}

export async function fetchGlobalHistory() {
  return apiJson<any[]>("/api/history/recent", { method: "GET" });
}

export async function fetchAdminUsers() {
  return apiJson<any[]>("/api/admin/users", { method: "GET" });
}

export async function fetchAdminHistory(page: number = 1) {
  return apiJson<any>(`/api/admin/history?page=${page}`, { method: "GET" });
}
