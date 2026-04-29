export type DeskStatus = "available" | "occupied" | "mine";

export interface Desk {
  id: number;
  status: DeskStatus;
  // grid position & size for the floor map
  col: number;
  row: number;
  w?: number;
  h?: number;
}

export interface Room {
  id: string;
  name: string;
  floor: number;
  desks: Desk[];
}

export type Screen =
  | "login"
  | "workspace"
  | "scanner"
  | "details"
  | "success";