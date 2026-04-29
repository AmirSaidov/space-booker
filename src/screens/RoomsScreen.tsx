import { ChevronLeft, Check } from "lucide-react";
import { Room } from "@/types/booking";

interface Props {
  rooms: Room[];
  currentRoomId: string;
  onBack: () => void;
  onSelect: (id: string) => void;
}

export const RoomsScreen = ({ rooms, currentRoomId, onBack, onSelect }: Props) => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 pt-4 pb-3 grid grid-cols-3 items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-foreground -ml-1.5 justify-self-start"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>
        <h1 className="text-base font-semibold text-center">Кабинет</h1>
        <span />
      </header>

      <div className="flex-1 px-5 pt-2 pb-4 space-y-2 overflow-y-auto">
        {rooms.map((r) => {
          const free = r.desks.filter((d) => d.status === "available").length;
          const isCurrent = r.id === currentRoomId;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect(r.id)}
              className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition-colors ${
                isCurrent
                  ? "bg-primary-soft border-primary/30"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex-1">
                <h2 className="font-semibold">{r.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.floor} этаж · {free} свободно из {r.desks.length}
                </p>
              </div>
              {isCurrent && <Check className="w-5 h-5 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
