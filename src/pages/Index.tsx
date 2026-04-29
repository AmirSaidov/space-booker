import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/booking/PhoneFrame";
import { SideMenu } from "@/components/booking/SideMenu";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { ForgotPasswordScreen } from "@/screens/ForgotPasswordScreen";
import { WorkspaceScreen } from "@/screens/WorkspaceScreen";
import { ScannerScreen } from "@/screens/ScannerScreen";
import { DetailsScreen } from "@/screens/DetailsScreen";
import { SuccessScreen } from "@/screens/SuccessScreen";
import { BookingsScreen } from "@/screens/BookingsScreen";
import { HistoryScreen } from "@/screens/HistoryScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { RoomsScreen } from "@/screens/RoomsScreen";
import { NavKey } from "@/components/booking/BottomNav";
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
  },
  {
    id: "302",
    name: "Кабинет 302",
    floor: 3,
    desks: [
      { id: 1, status: "available", col: 1, row: 1, w: 2 },
      { id: 2, status: "occupied", col: 3, row: 1, w: 2 },
      { id: 3, status: "available", col: 5, row: 1, w: 2 },
      { id: 4, status: "available", col: 1, row: 3, w: 2 },
      { id: 5, status: "available", col: 3, row: 3, w: 2 },
      { id: 6, status: "occupied", col: 5, row: 3, w: 2 },
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
  const [screen, setScreen] = useState<Screen>("login");
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentRoomId, setCurrentRoomId] = useState<string>("407");
  const [scannedDeskId, setScannedDeskId] = useState<number | null>(null);
  const [myBookingId, setMyBookingId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [user] = useState<UserProfile>(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingTime, setBookingTime] = useState<string>("");

  const room = useMemo(
    () => rooms.find((r) => r.id === currentRoomId) ?? rooms[0],
    [rooms, currentRoomId]
  );
  const myDeskId = useMemo(() => {
    const active = bookings.find((b) => b.id === myBookingId && b.status === "active");
    return active && active.roomId === room.id ? active.deskId : null;
  }, [bookings, myBookingId, room.id]);

  const scannedDesk = useMemo(
    () => room.desks.find((d) => d.id === scannedDeskId) ?? null,
    [room, scannedDeskId]
  );

  const updateDesk = (roomId: string, id: number, status: Desk["status"]) => {
    setRooms((rs) =>
      rs.map((r) =>
        r.id !== roomId
          ? r
          : { ...r, desks: r.desks.map((d) => (d.id === id ? { ...d, status } : d)) }
      )
    );
  };

  const handleScanned = () => {
    const target = room.desks.find((d) => d.status === "available");
    setScannedDeskId(target?.id ?? room.desks[0].id);
    setScreen("details");
  };

  const handleBook = () => {
    if (!scannedDesk) return;
    if (myBookingId) {
      toast.error("У вас уже есть активная бронь");
      return;
    }
    updateDesk(room.id, scannedDesk.id, "mine");
    const time = nowHM();
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      deskId: scannedDesk.id,
      roomId: room.id,
      roomName: room.name,
      floor: room.floor,
      date: today(),
      startTime: time,
      status: "active",
    };
    setBookings((b) => [newBooking, ...b]);
    setMyBookingId(newBooking.id);
    setBookingTime(time);
    setScreen("success");
    toast.success(`Стол ${scannedDesk.id} забронирован`);
  };

  const handleRelease = () => {
    if (!myBookingId) {
      setScannedDeskId(null);
      setScreen("workspace");
      return;
    }
    const active = bookings.find((b) => b.id === myBookingId);
    if (active) {
      updateDesk(active.roomId, active.deskId, "available");
      setBookings((all) =>
        all.map((b) =>
          b.id === myBookingId
            ? { ...b, status: "completed", endTime: nowHM() }
            : b
        )
      );
      toast.success("Место освобождено");
    }
    setMyBookingId(null);
    setScannedDeskId(null);
    setScreen("workspace");
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
    if (id === myBookingId) setMyBookingId(null);
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
          onLogin={() => setScreen("workspace")}
          onRegister={() => setScreen("register")}
          onForgot={() => setScreen("forgot")}
        />
      )}
      {screen === "register" && (
        <RegisterScreen
          onRegister={() => setScreen("workspace")}
          onBack={() => setScreen("login")}
        />
      )}
      {screen === "forgot" && (
        <ForgotPasswordScreen onBack={() => setScreen("login")} />
      )}
      {screen === "workspace" && (
        <WorkspaceScreen
          room={room}
          myDeskId={myDeskId}
          unreadCount={unread}
          onScan={() => setScreen("scanner")}
          onDeskClick={handleDeskClick}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenNotifications={() => setScreen("notifications")}
          onOpenRooms={() => setScreen("rooms")}
          onNavigate={handleNavigate}
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
          onRelease={handleRelease}
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
          onScan={() => setScreen("scanner")}
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
    </PhoneFrame>
  );
};

export default Index;
