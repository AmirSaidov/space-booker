export type DeskStatus = "available" | "occupied" | "mine";

export interface Desk {
  id: number; // visual number
  dbId?: number; // backend primary key
  qrCode?: string; // backend qr code value
  status: DeskStatus;
  // grid position & size for the floor map
  col: number;
  row: number;
  w?: number;
  h?: number;
  occupiedAt?: string;
  occupantName?: string;
}

export interface Room {
  id: string;
  name: string;
  floor: number;
  desks: Desk[];
}

export type Screen =
  | "login"
  | "register"
  | "forgot"
  | "workspace"
  | "scanner"
  | "details"
  | "success"
  | "bookings"
  | "history"
  | "profile"
  | "notifications"
  | "rooms"
  | "admin_users"
  | "admin_history";

export interface Booking {
  id: string;
  deskId: number;
  dbId?: number;
  roomId: string;
  roomName: string;
  floor: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string; // HH:MM, present in history
  status: "active" | "completed" | "cancelled";
}

export interface AppNotification {
  id: string;
  title: string;
  text: string;
  time: string;
  read: boolean;
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  position: string;
  department: string;
  preferred_room?: string;
  is_staff?: boolean;
}
