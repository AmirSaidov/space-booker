import { Desk } from "@/types/booking";

interface FloorMapProps {
  desks: Desk[];
  highlightId?: number | null;
  onDeskClick?: (desk: Desk) => void;
}

const STATUS_DOT: Record<Desk["status"], string> = {
  available: "bg-success",
  occupied: "bg-destructive",
  mine: "bg-success",
};

export const FloorMap = ({ desks, highlightId, onDeskClick }: FloorMapProps) => {
  return (
    <div
      className="relative w-full bg-background border border-border rounded-2xl p-3 sm:p-4 md:p-6"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "clamp(20px, 2.2vw, 28px) clamp(20px, 2.2vw, 28px)",
      }}
    >
      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoRows: "clamp(44px, 5.2vw, 68px)",
        }}
      >
        {desks.map((d) => {
          const isMine = d.status === "mine" || d.id === highlightId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onDeskClick?.(d)}
              className={`relative rounded-md border flex items-center justify-center text-sm font-semibold transition-all active:scale-95 ${
                isMine
                  ? "bg-success border-success text-success-foreground shadow-soft"
                  : d.status === "occupied"
                  ? "bg-destructive-soft border-destructive/40 text-foreground"
                  : "bg-background border-foreground/30 text-foreground hover:border-primary"
              }`}
              style={{
                gridColumn: `${d.col} / span ${d.w ?? 1}`,
                gridRow: `${d.row} / span ${d.h ?? 1}`,
              }}
            >
              {d.id}
              {!isMine && (
                <span
                  className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-background ${STATUS_DOT[d.status]}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
