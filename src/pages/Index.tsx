import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/booking/PhoneFrame";
import { SideMenu } from "@/components/booking/SideMenu";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { ForgotPasswordScreen } from "@/screens/ForgotPasswordScreen";
import { WorkspaceScreen } from "@/screens/WorkspaceScreen";
import { DetailsScreen } from "@/screens/DetailsScreen";
import { SuccessScreen } from "@/screens/SuccessScreen";
import { BookingsScreen } from "@/screens/BookingsScreen";
import { HistoryScreen } from "@/screens/HistoryScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { RoomsScreen } from "@/screens/RoomsScreen";
import { NavKey } from "@/components/booking/BottomNav";
import { ScannerModal } from "@/components/qr/ScannerModal";
import { login, register, getUserProfile, fetchUserHistory } from "@/lib/auth";
import { occupyPlace, fetchRoomPlaces, fetchRooms, releasePlace } from "@/lib/places";
import { getAuthToken } from "@/lib/api";
import {
  AppNotification,
  Booking,
  Desk,
  Room,
  Screen,
  UserProfile,
} from "@/types/booking";

const initialRooms: Room[] = [
  {
    id: "401",
    name: "Кабинет 401",
    floor: 4,
    desks: [
      // Top row — 4 horizontal desks
      { id: 1, status: "available", col: 2, row: 1, w: 2 },
      { id: 2, status: "available", col: 4, row: 1, w: 2 },
      { id: 3, status: "available", col: 6, row: 1, w: 2 },
      { id: 4, status: "available", col: 8, row: 1, w: 2 },
      // Left column — 2 vertical desks
      { id: 5, status: "available", col: 1, row: 3, h: 2 },
      { id: 6, status: "available", col: 1, row: 5, h: 2 },
      // Right column — 3 vertical desks
      { id: 7, status: "available", col: 10, row: 3, h: 2 },
      { id: 8, status: "available", col: 10, row: 5, h: 2 },
      { id: 9, status: "available", col: 10, row: 7, h: 2 },
    ],
  },
  {
    id: "407",
    name: "Кабинет 407",
    floor: 4,
    desks: [
      // Top row — 1 small portrait + 3 wide desks
      { id: 1, status: "available", col: 2, row: 1, h: 2 },
      { id: 2, status: "available", col: 3, row: 1, w: 2 },
      { id: 3, status: "available", col: 5, row: 1, w: 2 },
      { id: 4, status: "available", col: 7, row: 1, w: 2 },
      // Left column — 2 portrait + 1 landscape at bottom
      { id: 5, status: "available", col: 1, row: 3, h: 2 },
      { id: 6, status: "available", col: 1, row: 5, h: 2 },
      { id: 7, status: "available", col: 1, row: 7, w: 2 },
      // Center — 1 portrait + 1 landscape
      { id: 8, status: "available", col: 5, row: 3, h: 2 },
      { id: 9, status: "available", col: 4, row: 5, w: 2 },
      // Right column — 3 desks
      { id: 10, status: "available", col: 9, row: 3, h: 2 },
      { id: 11, status: "available", col: 9, row: 5, h: 2 },
      { id: 12, status: "available", col: 9, row: 7, h: 2 },
    ],
  },
  {
    id: "302",
    name: "Кабинет 302",
    floor: 3,
    desks: [
      { id: 1, status: "available", col: 1, row: 1, w: 2 },
      { id: 2, status: "available", col: 3, row: 1, w: 2 },
      { id: 3, status: "available", col: 5, row: 1, w: 2 },
      { id: 4, status: "available", col: 1, row: 3, w: 2 },
      { id: 5, status: "available", col: 3, row: 3, w: 2 },
      { id: 6, status: "available", col: 5, row: 3, w: 2 },
    ],
  },
  {
    id: "210",
    name: "Кабинет 210",
    floor: 2,
    desks: [
      { id: 1, status: "available", col: 1, row: 1, h: 2 },
      { id: 2, status: "available", col: 3, row: 1, w: 2 },
      { id: 3, status: "available", col: 5, row: 1, w: 2 },
      { id: 4, status: "available", col: 1, row: 3, w: 2 },
      { id: 5, status: "available", col: 4, row: 3, w: 3 },
    ],
  },
];

const initialUser: UserProfile = {
  name: "Иван Петров",
  email: "ivan.petrov@example.com",
  position: "Frontend-разработчик",
  department: "Команда продукта",
};

const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Бронь на завтра",
    text: "Не забудьте — стол 7, кабинет 407 в 09:30.",
    time: "Сейчас",
    read: false,
  },
  {
    id: "n2",
    title: "Новый этаж доступен",
    text: "Кабинеты 2 этажа теперь можно бронировать.",
    time: "Вчера",
    read: false,
  },
];

const today = () => new Date().toISOString().slice(0, 10);
const nowHM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>(getAuthToken() ? "workspace" : "login");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [scannedDeskId, setScannedDeskId] = useState<number | null>(null);
  const [, setScannedData] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanDeskTarget, setScanDeskTarget] = useState<number | null>(null);
  const [deskQrValues, setDeskQrValues] = useState<Record<number, string>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingTime, setBookingTime] = useState<string>("");

  const room = useMemo(
    () => rooms.find((r) => r.id === currentRoomId) ?? rooms[0] ?? initialRooms[0],
    [rooms, currentRoomId]
  );
  const myDeskId = useMemo(() => {
    const mine = room.desks.find((d) => d.status === "mine");
    return mine ? mine.id : null;
  }, [room.desks]);
  
  const hasActiveBooking = useMemo(() => {
    return bookings.some(b => b.status === "active");
  }, [bookings]);

  const scannedDesk = useMemo(
    () => room.desks.find((d) => d.id === scannedDeskId) ?? null,
    [room, scannedDeskId]
  );

  useEffect(() => {
    if (screen === "workspace" || screen === "profile") {
      getUserProfile()
        .then((data) => {
          if (data && data.email) {
            setUser((prev) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {});
        
      fetchUserHistory()
        .then((history) => {
          if (Array.isArray(history)) {
            const mappedBookings: Booking[] = history.map((h: any) => {
               let st = "completed";
               if (!h.end_time) st = "active";
               
               const sTime = new Date(h.start_time);
               let eTime;
               if (h.end_time) eTime = new Date(h.end_time);

               return {
                 id: String(h.id),
                 deskId: h.place_number,
                 roomId: String(h.room_id),
                 roomName: h.room_name,
                 floor: 1, // default
                 date: sTime.toISOString().slice(0, 10),
                 startTime: `${String(sTime.getHours()).padStart(2, "0")}:${String(sTime.getMinutes()).padStart(2, "0")}`,
                 endTime: eTime ? `${String(eTime.getHours()).padStart(2, "0")}:${String(eTime.getMinutes()).padStart(2, "0")}` : undefined,
                 status: st as any,
               };
            });
            setBookings(mappedBookings);
          }
        })
        .catch(() => {});
        
      fetchRooms()
        .then((data) => {
          if (Array.isArray(data)) {
            setRooms((rs) => {
              const updatedRooms = data.map((apiRoom) => {
                const apiName = apiRoom.name.toLowerCase();
                const existing = rs.find((r) => r.id === String(apiRoom.id)) || 
                                 initialRooms.find((r) => apiName.includes(r.id) || r.name.toLowerCase().includes(apiName));
                return {
                  id: String(apiRoom.id),
                  name: apiRoom.name,
                  floor: existing?.floor || 1,
                  desks: existing?.desks || [],
                };
              });
              if (!currentRoomId && updatedRooms.length > 0) {
                setCurrentRoomId(updatedRooms[0].id);
              }
              return updatedRooms;
            });
          }
        })
        .catch(() => {});
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "workspace" && currentRoomId) {
      fetchRoomPlaces(currentRoomId)
        .then((places) => {
          setRooms((rs) =>
            rs.map((r) => {
              if (r.id !== currentRoomId) return r;
              
              // If room had no layout (created via admin), generate simple grid
              let desks = [...r.desks];
              if (desks.length === 0 && places.length > 0) {
                desks = places.map((p: any, i: number) => ({
                  id: p.number,
                  status: "available",
                  col: (i % 6) + 1,
                  row: Math.floor(i / 6) * 2 + 1,
                }));
              }

              const newDesks = desks.map((desk) => {
                const p = places.find((x: any) => x.number === desk.id);
                if (p) {
                  let st: Desk["status"] = "available";
                  if (p.status === "booked" || p.backend_status === "occupied") {
                    st = p.user?.id === user?.id ? "mine" : "occupied";
                  }
                  return { ...desk, dbId: p.id, status: st };
                }
                return desk;
              });
              return { ...r, desks: newDesks };
            })
          );
        })
        .catch(() => {});
    }
  }, [screen, currentRoomId, user?.id]);

  const updateDesk = (roomId: string, id: number, status: Desk["status"]) => {
    setRooms((rs) =>
      rs.map((r) =>
        r.id !== roomId
          ? r
          : { ...r, desks: r.desks.map((d) => (d.id === id ? { ...d, status } : d)) }
      )
    );
  };

  const extractDeskId = (text: string) => {
    const m = text.match(/\d+/);
    if (!m) return null;
    const id = Number(m[0]);
    return Number.isFinite(id) ? id : null;
  };

  const parsePlaceIdFromQr = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const parts = url.pathname.split("/").filter(Boolean);
      const placeIdx = parts.findIndex((p) => p === "place" || p === "places");
      if (placeIdx === -1) return extractDeskId(decodedText);
      const idPart = parts[placeIdx + 1];
      const id = Number(idPart);
      return Number.isFinite(id) ? id : null;
    } catch {
      return extractDeskId(decodedText);
    }
  };

  const openWorkspaceScanner = () => {
    setScanDeskTarget(null);
    setScannerOpen(true);
  };

  const openDeskScanner = (deskId: number) => {
    setScanDeskTarget(deskId);
    setScannerOpen(true);
  };

  const handleDecoded = (decodedText: string) => {
    console.log(decodedText);
    setScannedData(decodedText);
    toast.success("QR считан");
    setScannerOpen(false);

    if (scanDeskTarget !== null) {
      setDeskQrValues((prev) => ({ ...prev, [scanDeskTarget]: decodedText }));
      setScanDeskTarget(null);
      return;
    }

    const maybeDeskId = parsePlaceIdFromQr(decodedText);
    if (maybeDeskId !== null && room.desks.some((d) => d.id === maybeDeskId)) {
      setScannedDeskId(maybeDeskId);
      setDeskQrValues((prev) => ({ ...prev, [maybeDeskId]: decodedText }));
      setScreen("details");
    }
  };

  const handleBook = () => {
    if (!scannedDesk) return;
    if (hasActiveBooking) {
      toast.error("У вас уже есть активная бронь");
      return;
    }
    const scannedForDesk = deskQrValues[scannedDesk.id] ?? null;
    if (!scannedForDesk) {
      toast.error("Сначала отсканируйте QR этого стола");
      return;
    }
    if (!scannedDesk.dbId) {
      toast.error("Ошибка: место не привязано к серверу");
      return;
    }

    void (async () => {
      try {
        await occupyPlace(scannedDesk.dbId!, scannedForDesk);
        
        // Refresh history to get the active booking
        const history = await fetchUserHistory();
        if (Array.isArray(history)) {
          const mappedBookings: Booking[] = history.map((h: any) => {
             let st = "completed";
             if (!h.end_time) st = "active";
             const sTime = new Date(h.start_time);
             let eTime;
             if (h.end_time) eTime = new Date(h.end_time);
             return {
               id: String(h.id),
               deskId: h.place_number,
               roomId: String(h.room_id),
               roomName: h.room_name,
               floor: 1,
               date: sTime.toISOString().slice(0, 10),
               startTime: `${String(sTime.getHours()).padStart(2, "0")}:${String(sTime.getMinutes()).padStart(2, "0")}`,
               endTime: eTime ? `${String(eTime.getHours()).padStart(2, "0")}:${String(eTime.getMinutes()).padStart(2, "0")}` : undefined,
               status: st as any,
             };
          });
          setBookings(mappedBookings);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Не удалось забронировать";
        toast.error(msg);
        return;
      }

      updateDesk(room.id, scannedDesk.id, "mine");
      const time = nowHM();
      setBookingTime(time);
      setScreen("success");
      toast.success(`Стол ${scannedDesk.id} забронирован`);
    })();
    return;
    toast.success(`Стол ${scannedDesk.id} забронирован`);
  };

  const handleRelease = () => {
    if (!myDeskId) {
      setScannedDeskId(null);
      setScreen("workspace");
      return;
    }
    const mineDesk = room.desks.find((d) => d.id === myDeskId);
    if (!mineDesk || !mineDesk.dbId) return;

    void (async () => {
      try {
        await releasePlace(mineDesk.dbId!);
        const history = await fetchUserHistory();
        if (Array.isArray(history)) {
          const mappedBookings: Booking[] = history.map((h: any) => {
             let st = "completed";
             if (!h.end_time) st = "active";
             const sTime = new Date(h.start_time);
             let eTime;
             if (h.end_time) eTime = new Date(h.end_time);
             return {
               id: String(h.id),
               deskId: h.place_number,
               roomId: String(h.room_id),
               roomName: h.room_name,
               floor: 1,
               date: sTime.toISOString().slice(0, 10),
               startTime: `${String(sTime.getHours()).padStart(2, "0")}:${String(sTime.getMinutes()).padStart(2, "0")}`,
               endTime: eTime ? `${String(eTime.getHours()).padStart(2, "0")}:${String(eTime.getMinutes()).padStart(2, "0")}` : undefined,
               status: st as any,
             };
          });
          setBookings(mappedBookings);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Не удалось освободить место";
        toast.error(msg);
        return;
      }

      updateDesk(room.id, myDeskId, "available");
      toast.success("Место освобождено");
      setScannedDeskId(null);
      setScreen("workspace");
    })();
  };

  const handleCancelBooking = (id: string) => {
    const b = bookings.find((x) => x.id === id);
    if (!b) return;
    updateDesk(b.roomId, b.deskId, "available");
    setBookings((all) =>
      all.map((x) =>
        x.id === id ? { ...x, status: "cancelled", endTime: nowHM() } : x
      )
    );
    toast.success("Бронь отменена");
  };

  const handleDeskClick = (desk: Desk) => {
    setScannedDeskId(desk.id);
    setScreen("details");
  };

  const handleNavigate = (key: NavKey) => {
    if (key === "map") setScreen("workspace");
    if (key === "bookings") setScreen("bookings");
    if (key === "history") setScreen("history");
    if (key === "profile") setScreen("profile");
  };

  const handleLogout = () => {
    setScreen("login");
    toast.success("Вы вышли из аккаунта");
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <PhoneFrame>
      {screen === "login" && (
        <LoginScreen
          onLogin={async ({ email, password }) => {
            try {
              await login(email, password);
              setScreen("workspace");
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Не удалось войти";
              toast.error(msg);
            }
          }}
          onRegister={() => setScreen("register")}
          onForgot={() => setScreen("forgot")}
        />
      )}
      {screen === "register" && (
        <RegisterScreen
          onRegister={async ({ name, email, password }) => {
            try {
              await register(name, email, password);
              setScreen("workspace");
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Не удалось зарегистрироваться";
              toast.error(msg);
            }
          }}
          onBack={() => setScreen("login")}
        />
      )}
      {screen === "forgot" && (
        <ForgotPasswordScreen onBack={() => setScreen("login")} />
      )}
      {screen === "workspace" && currentRoomId && (
        <WorkspaceScreen
          room={room}
          myDeskId={myDeskId}
          unreadCount={unread}
          onScan={openWorkspaceScanner}
          onDeskClick={handleDeskClick}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenNotifications={() => setScreen("notifications")}
          onOpenRooms={() => setScreen("rooms")}
          onNavigate={handleNavigate}
        />
      )}
      {screen === "details" && scannedDesk && (
        <DetailsScreen
          desk={scannedDesk}
          room={room}
          onBack={() => setScreen("workspace")}
          onBook={handleBook}
          onRelease={handleRelease}
          onScanQr={() => openDeskScanner(scannedDesk.id)}
          scannedQrValue={deskQrValues[scannedDesk.id] ?? null}
        />
      )}
      {screen === "success" && scannedDesk && (
        <SuccessScreen
          desk={scannedDesk}
          room={room}
          startTime={bookingTime}
          onRelease={handleRelease}
          onHome={() => setScreen("workspace")}
        />
      )}
      {screen === "bookings" && (
        <BookingsScreen
          bookings={bookings}
          onCancel={handleCancelBooking}
          onScan={openWorkspaceScanner}
          onNavigate={handleNavigate}
        />
      )}
      {screen === "history" && (
        <HistoryScreen bookings={bookings} onNavigate={handleNavigate} />
      )}
      {screen === "profile" && (
        <ProfileScreen
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onOpenNotifications={() => setScreen("notifications")}
        />
      )}
      {screen === "notifications" && (
        <NotificationsScreen
          notifications={notifications}
          onBack={() => setScreen("workspace")}
          onMarkRead={(id) =>
            setNotifications((all) =>
              all.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
          }
        />
      )}
      {screen === "rooms" && (
        <RoomsScreen
          rooms={rooms}
          currentRoomId={currentRoomId}
          onBack={() => setScreen("workspace")}
          onSelect={(id) => {
            setCurrentRoomId(id);
            setScreen("workspace");
          }}
        />
      )}

      <SideMenu
        open={menuOpen}
        user={user}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
        onOpenNotifications={() => setScreen("notifications")}
        onLogout={handleLogout}
      />

      <ScannerModal
        open={scannerOpen}
        onOpenChange={(open) => {
          setScannerOpen(open);
          if (!open) setScanDeskTarget(null);
        }}
        title={scanDeskTarget ? `Сканировать QR для стола ${scanDeskTarget}` : "Сканирование QR"}
        onDecode={handleDecoded}
      />
    </PhoneFrame>
  );
};

export default Index;

