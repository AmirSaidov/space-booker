import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/booking/StatusBadge";
import { Desk, Room } from "@/types/booking";

interface DetailsScreenProps {
  desk: Desk;
  room: Room;
  onBack: () => void;
  onBook: () => void;
  onRelease: () => void;
  onScanQr: () => void;
  scannedQrValue: string | null;
  isAdmin?: boolean;
}

export const DetailsScreen = ({
  desk,
  room,
  onBack,
  onBook,
  onRelease,
  onScanQr,
  scannedQrValue,
  isAdmin = false,
}: DetailsScreenProps) => {
  const isAvailable = desk.status === "available";
  const isMine = desk.status === "mine";

  // Calculate elapsed time if occupiedAt is present
  const occupiedMinutes = desk.occupiedAt
    ? Math.floor((new Date().getTime() - new Date(desk.occupiedAt).getTime()) / 60000)
    : 0;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 md:px-8 pt-4 pb-3 grid grid-cols-3 items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-foreground -ml-1.5 justify-self-start"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>
        <h1 className="text-base font-semibold text-center">Рабочее место</h1>
        <span />
      </header>

      <div className="flex-1 px-5 md:px-8 pt-4">
        <div className="rounded-2xl border border-border bg-card shadow-card p-5">
          <h2 className="text-2xl font-bold tracking-tight">Стол {desk.id}</h2>
          <div className="mt-2">
            <StatusBadge status={desk.status} />
          </div>

          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-xs text-muted-foreground">Кабинет</dt>
              <dd className="text-base font-semibold mt-0.5">
                {room.name.replace("Кабинет ", "")}
              </dd>
            </div>

          </dl>

          {/* Occupied by someone else — show occupant info */}
          {!isAvailable && !isMine && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <h3 className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Занят сотрудником</h3>
              <p className="text-base font-bold">{desk.occupantName || "Неизвестный"}</p>
              {occupiedMinutes > 0 && (
                <p className="text-sm text-muted-foreground mt-1">Сидит: {occupiedMinutes} мин</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 md:px-8 pb-6 pt-4 flex flex-col gap-3">
        {isMine ? (
          <Button
            onClick={onRelease}
            variant="outline"
            className="h-12 rounded-xl text-base font-semibold border-destructive/30 text-destructive hover:bg-destructive-soft hover:text-destructive"
          >
            Освободить
          </Button>
        ) : (
          !isAdmin ? (
            <Button
              onClick={onBook}
              disabled={!isAvailable}
              className="h-12 rounded-xl text-base font-semibold shadow-button"
            >
              Забронировать
            </Button>
          ) : null
        )}
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 rounded-xl text-base font-semibold border-primary/30 text-primary hover:bg-primary-soft hover:text-primary"
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};
