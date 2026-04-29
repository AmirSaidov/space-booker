import { DeskStatus } from "@/types/booking";

const STYLES: Record<DeskStatus, { label: string; className: string }> = {
  available: {
    label: "Свободен",
    className: "bg-success-soft text-success",
  },
  occupied: {
    label: "Занят",
    className: "bg-destructive-soft text-destructive",
  },
  mine: {
    label: "Моё место",
    className: "bg-primary-soft text-primary",
  },
};

export const StatusBadge = ({ status }: { status: DeskStatus }) => {
  const s = STYLES[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  );
};