import { MapPin, Calendar } from "lucide-react";
import { BottomNav, NavKey } from "@/components/booking/BottomNav";
import { Booking } from "@/types/booking";

interface Props {
  bookings: Booking[];
  onNavigate: (key: NavKey) => void;
}

export const HistoryScreen = ({ bookings, onNavigate }: Props) => {
  const past = bookings.filter((b) => b.status !== "active");

  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 md:px-8 pt-4 pb-3 text-center">
        <h1 className="text-base font-semibold">История</h1>
      </header>

      <div className="flex-1 px-5 md:px-8 pt-2 pb-4 space-y-3 overflow-y-auto">
        {past.length === 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">История пуста</p>
          </div>
        )}

        {past.map((b) => (
          <article
            key={b.id}
            className="rounded-2xl border border-border bg-card shadow-soft p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">Стол {b.deskId}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{b.date}</p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  b.status === "completed"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-destructive-soft text-destructive"
                }`}
              >
                {b.status === "completed" ? "Завершена" : "Отменена"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {b.roomName}
              {b.endTime && (
                <span className="ml-auto tabular-nums">
                  {b.startTime}–{b.endTime}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );
};
