import { Calendar, MapPin, Clock, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav, NavKey } from "@/components/booking/BottomNav";
import { Booking } from "@/types/booking";

interface Props {
  bookings: Booking[];
  onCancel: (id: string) => void;
  onScan: () => void;
  onNavigate: (key: NavKey) => void;
}

export const BookingsScreen = ({ bookings, onCancel, onScan, onNavigate }: Props) => {
  const active = bookings.filter((b) => b.status === "active");

  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 md:px-8 pt-4 pb-3 text-center">
        <h1 className="text-base font-semibold">Мои брони</h1>
      </header>

      <div className="flex-1 px-5 md:px-8 pt-2 pb-4 space-y-3 overflow-y-auto">
        {active.length === 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">У вас пока нет активных броней</p>
            <Button onClick={onScan} className="mt-6 h-11 rounded-xl shadow-button gap-2">
              <QrCode className="w-4 h-4" /> Сканировать QR
            </Button>
          </div>
        )}

        {active.map((b) => (
          <article
            key={b.id}
            className="rounded-2xl border border-border bg-card shadow-card p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">Стол {b.deskId}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Активна</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-success-soft text-success">
                Активна
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Row icon={<MapPin className="w-4 h-4" />} label={b.roomName} />
              <Row icon={<Calendar className="w-4 h-4" />} label={b.date} />
              <Row icon={<Clock className="w-4 h-4" />} label={`с ${b.startTime}`} />
            </dl>
            <Button
              onClick={() => onCancel(b.id)}
              variant="outline"
              className="mt-4 w-full h-10 rounded-xl border-destructive/30 text-destructive hover:bg-destructive-soft hover:text-destructive"
            >
              Освободить
            </Button>
          </article>
        ))}
      </div>

      <BottomNav active="bookings" onNavigate={onNavigate} />
    </div>
  );
};

const Row = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 text-foreground">
    <span className="text-muted-foreground">{icon}</span>
    <span>{label}</span>
  </div>
);
