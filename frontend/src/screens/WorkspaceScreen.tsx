import { Menu, Bell, ChevronDown, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav, NavKey } from "@/components/booking/BottomNav";
import { FloorMap } from "@/components/booking/FloorMap";
import { Desk, Room } from "@/types/booking";

interface WorkspaceScreenProps {
  room: Room;
  myDeskId: number | null;
  onScan: () => void;
  onDeskClick: (desk: Desk) => void;
  onOpenRooms: () => void;
  onNavigate: (key: NavKey) => void;
  isAdmin?: boolean;
}

export const WorkspaceScreen = ({
  room,
  myDeskId,
  onScan,
  onDeskClick,
  onOpenRooms,
  onNavigate,
  isAdmin = false,
}: WorkspaceScreenProps) => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 md:px-8 pt-4 pb-3 flex items-center justify-center">
        <h1 className="text-base font-semibold">Мои места</h1>
      </header>

      <div className="px-5 md:px-8">
        <button
          onClick={onOpenRooms}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground py-1"
        >
          {room.name}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 px-5 md:px-8 pt-3 pb-4">
        <FloorMap desks={room.desks} highlightId={myDeskId} onDeskClick={onDeskClick} />

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

      {!isAdmin && (
        <div className="px-5 md:px-8 pb-3">
          <Button
            onClick={onScan}
            className="w-full h-12 rounded-xl text-base font-semibold shadow-button gap-2"
          >
            <ScanLine className="w-5 h-5" />
            Сканировать QR
          </Button>
        </div>
      )}

      <BottomNav active="map" isAdmin={isAdmin} onNavigate={onNavigate} />
    </div>
  );
};
