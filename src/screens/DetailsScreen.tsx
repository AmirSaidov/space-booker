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
}

export const DetailsScreen = ({
  desk,
  room,
  onBack,
  onBook,
  onRelease,
  onScanQr,
  scannedQrValue,
}: DetailsScreenProps) => {
  const isAvailable = desk.status === "available";
  const isMine = desk.status === "mine";

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

          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Проверка по QR (пока без бэкенда)</p>
                <p className="mt-1 text-sm break-words">
                  {scannedQrValue ? scannedQrValue : <span className="text-muted-foreground">QR не сканировали</span>}
                </p>
              </div>
              <Button onClick={onScanQr} variant="outline" className="shrink-0 h-9 rounded-lg px-3">
                Сканировать
              </Button>
            </div>
          </div>

          {!isAvailable && !isMine && (
            <p className="mt-6 text-sm text-muted-foreground">
              Это место уже занято другим сотрудником.
            </p>
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
          <Button
            onClick={onBook}
            disabled={!isAvailable}
            className="h-12 rounded-xl text-base font-semibold shadow-button"
          >
            Забронировать
          </Button>
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
