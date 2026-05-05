import { apiJson } from "./api";

export async function occupyPlace(placeId: number, qrCode?: string) {
  return apiJson<{ success: boolean }>(`/api/places/${placeId}/occupy`, {
    method: "POST",
    body: JSON.stringify({ qr_code: qrCode }),
  });
}

export async function fetchRoomPlaces(roomId: string) {
  return apiJson<any[]>(`/api/rooms/${roomId}/places`);
}

export async function fetchRooms() {
  return apiJson<any[]>("/api/rooms");
}

export async function releasePlace(placeId: number) {
  return apiJson<{ success: boolean }>(`/api/places/${placeId}/leave`, {
    method: "POST",
  });
}
