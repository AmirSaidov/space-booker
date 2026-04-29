import { Menu, Bell, ChevronDown, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/booking/BottomNav";
import { FloorMap } from "@/components/booking/FloorMap";
import { Room } from "@/types/booking";

interface WorkspaceScreenProps {
  room: Room;
  myDeskId: number | null;
  onScan: () => void;
}

export const WorkspaceScreen = ({ room, myDeskId, onScan }: WorkspaceScreenProps) => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between">
        <button className="p-1.5 -ml-1.5 text-foreground" aria-label="Меню">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-base font-semibold">Мои места</h1>
        <button className="p-1.5 -mr-1.5 text-foreground relative" aria-label="Уведомления">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>
      </header>

      <div className="px-5">
        <button className="inline-flex items-center gap-1 text-sm font-medium text-foreground py-1">
          {room.name}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 px-5 pt-3 pb-4">
        <FloorMap desks={room.desks} highlightId={myDeskId} />

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" /> Свободно
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" /> Занято
          </span>
          {myDeskId !== null && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-success" /> Моё место
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-3">
        <Button
          onClick={onScan}
          className="w-full h-12 rounded-xl text-base font-semibold shadow-button gap-2"
        >
          <ScanLine className="w-5 h-5" />
          Сканировать QR
        </Button>
      </div>

      <BottomNav active="map" />
    </div>
  );
};