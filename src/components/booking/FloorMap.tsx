import { Desk } from "@/types/booking";

interface FloorMapProps {
  desks: Desk[];
  highlightId?: number | null;
}

const STATUS_DOT: Record<Desk["status"], string> = {
  available: "bg-success",
  occupied: "bg-destructive",
  mine: "bg-success",
};

export const FloorMap = ({ desks, highlightId }: FloorMapProps) => {
  return (
    <div
      className="relative w-full bg-background border border-border rounded-2xl p-3"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoRows: "44px",
        }}
      >
        {desks.map((d) => {
          const isMine = d.status === "mine" || d.id === highlightId;
          return (
            <div
              key={d.id}
              className={`relative rounded-md border flex items-center justify-center text-sm font-semibold transition-colors ${
                isMine
                  ? "bg-success border-success text-success-foreground shadow-soft"
                  : "bg-background border-foreground/30 text-foreground"
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
            </div>
          );
        })}
      </div>
    </div>
  );
};