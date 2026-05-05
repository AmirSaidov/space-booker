import { apiJson } from "./api";

const normalizeList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export const fetchAdminUsers = async () => {
  const data = await apiJson<any>("/api/admin/users");
  return normalizeList(data);
};

export const fetchAdminActiveBookings = async () => {
  const data = await apiJson<any>("/api/admin/active-bookings");
  return normalizeList(data);
};

export const fetchAdminHistory = async () => {
  const data = await apiJson<any>("/api/admin/history");
  return normalizeList(data);
};