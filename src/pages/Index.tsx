import { useMemo, useState } from "react";
import { PhoneFrame } from "@/components/booking/PhoneFrame";
import { LoginScreen } from "@/screens/LoginScreen";
import { WorkspaceScreen } from "@/screens/WorkspaceScreen";
import { ScannerScreen } from "@/screens/ScannerScreen";
import { DetailsScreen } from "@/screens/DetailsScreen";
import { SuccessScreen } from "@/screens/SuccessScreen";
import { Desk, Room, Screen } from "@/types/booking";

// Mock floor layout — desks placed on a 6-col grid like the reference
const initialRoom: Room = {
  id: "407",
  name: "Кабинет 407",
  floor: 4,
  desks: [
    { id: 1, status: "available", col: 1, row: 1, h: 2 },
    { id: 2, status: "available", col: 3, row: 1, w: 2 },
    { id: 3, status: "available", col: 5, row: 1, w: 2 },
    { id: 4, status: "occupied", col: 1, row: 3, h: 2 },
    { id: 7, status: "available", col: 3, row: 3, w: 2 },
    { id: 8, status: "available", col: 5, row: 3 },
    { id: 10, status: "available", col: 6, row: 4, h: 2 },
    { id: 5, status: "available", col: 1, row: 5, h: 2 },
    { id: 9, status: "available", col: 3, row: 5, w: 2 },
    { id: 11, status: "available", col: 5, row: 5 },
    { id: 6, status: "available", col: 2, row: 7, w: 2 },
    { id: 12, status: "available", col: 5, row: 6, w: 2 },
  ],
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [room, setRoom] = useState<Room>(initialRoom);
  const [scannedDeskId, setScannedDeskId] = useState<number | null>(null);
  const [myDeskId, setMyDeskId] = useState<number | null>(null);
  const [bookingTime, setBookingTime] = useState<string>("10:30");

  const scannedDesk = useMemo(
    () => room.desks.find((d) => d.id === scannedDeskId) ?? null,
    [room, scannedDeskId]
  );
  const myDesk = useMemo(
    () => room.desks.find((d) => d.id === myDeskId) ?? null,
    [room, myDeskId]
  );

  const updateDesk = (id: number, status: Desk["status"]) => {
    setRoom((r) => ({
      ...r,
      desks: r.desks.map((d) => (d.id === id ? { ...d, status } : d)),
    }));
  };

  const handleScanned = () => {
    // Pick first available desk to simulate a scanned QR pointing at it
    const target = room.desks.find((d) => d.status === "available");
    setScannedDeskId(target?.id ?? room.desks[0].id);
    setScreen("details");
  };

  const handleBook = () => {
    if (!scannedDesk) return;
    updateDesk(scannedDesk.id, "mine");
    setMyDeskId(scannedDesk.id);
    const now = new Date();
    setBookingTime(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
    setScreen("success");
  };

  const handleRelease = () => {
    if (myDeskId !== null) {
      updateDesk(myDeskId, "available");
      setMyDeskId(null);
    }
    setScannedDeskId(null);
    setScreen("workspace");
  };

  return (
    <PhoneFrame>
      {screen === "login" && (
        <LoginScreen onLogin={() => setScreen("workspace")} />
      )}
      {screen === "workspace" && (
        <WorkspaceScreen
          room={room}
          myDeskId={myDeskId}
          onScan={() => setScreen("scanner")}
        />
      )}
      {screen === "scanner" && (
        <ScannerScreen
          onClose={() => setScreen("workspace")}
          onScanned={handleScanned}
        />
      )}
      {screen === "details" && scannedDesk && (
        <DetailsScreen
          desk={scannedDesk}
          room={room}
          onBack={() => setScreen("workspace")}
          onBook={handleBook}
        />
      )}
      {screen === "success" && (myDesk || scannedDesk) && (
        <SuccessScreen
          desk={(myDesk || scannedDesk)!}
          room={room}
          startTime={bookingTime}
          onRelease={handleRelease}
          onHome={() => setScreen("workspace")}
        />
      )}
    </PhoneFrame>
  );
};

export default Index;
