import { useRef, useEffect, useState, useCallback } from "react";
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

/** Minimum comfortable column width in px */
const MIN_COL_PX = 52;
const GAP_PX = 10;
const ROW_HEIGHT_PX = 56;
const INNER_PAD = 14; // p-3.5 ≈ 14px

export const FloorMap = ({ desks, highlightId, onDeskClick }: FloorMapProps) => {
  const maxCol = desks.reduce((m, d) => Math.max(m, d.col + (d.w ?? 1) - 1), 6);
  const maxRow = desks.reduce((m, d) => Math.max(m, d.row + (d.h ?? 1) - 1), 1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // The natural (unscaled) width the grid wants
  const naturalGridW = maxCol * MIN_COL_PX + (maxCol - 1) * GAP_PX;
  const naturalW = naturalGridW + INNER_PAD * 2;
  const naturalGridH = maxRow * ROW_HEIGHT_PX + (maxRow - 1) * GAP_PX;
  const naturalH = naturalGridH + INNER_PAD * 2;

  const recalc = useCallback(() => {
    if (!wrapperRef.current) return;
    const avail = wrapperRef.current.clientWidth;
    setScale(avail >= naturalW ? 1 : avail / naturalW);
  }, [naturalW]);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  return (
    <div ref={wrapperRef} className="w-full" style={{ height: naturalH * scale }}>
      <div
        className="relative bg-background border border-border rounded-2xl origin-top-left"
        style={{
          width: naturalW,
          height: naturalH,
          padding: INNER_PAD,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: `${Math.round(naturalW / maxCol)}px ${Math.round(naturalH / maxRow)}px`,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${maxCol}, ${MIN_COL_PX}px)`,
            gridAutoRows: ROW_HEIGHT_PX,
            gap: GAP_PX,
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
    </div>
  );
};
