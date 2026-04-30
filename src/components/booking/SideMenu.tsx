import { X, Map, Calendar, Clock, User, LogOut, Bell } from "lucide-react";
import { NavKey } from "./BottomNav";
import { UserProfile } from "@/types/booking";

interface Props {
  open: boolean;
  user: UserProfile;
  onClose: () => void;
  onNavigate: (key: NavKey) => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
}

const items: { key: NavKey; label: string; icon: typeof Map }[] = [
  { key: "map", label: "Карта", icon: Map },
  { key: "bookings", label: "Мои брони", icon: Calendar },
  { key: "history", label: "История", icon: Clock },
  { key: "profile", label: "Профиль", icon: User },
];

export const SideMenu = ({ open, user, onClose, onNavigate, onOpenNotifications, onLogout }: Props) => {
  return (
    <div
      className={`absolute inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[78%] max-w-[320px] bg-background shadow-card flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 md:px-6 pt-5 pb-4 border-b border-border flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="text-muted-foreground p-1 -mt-1 -mr-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-2">
          {items.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                onNavigate(key);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-5 md:px-6 py-3 hover:bg-secondary text-left"
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              onOpenNotifications();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-5 md:px-6 py-3 hover:bg-secondary text-left"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Уведомления</span>
          </button>
        </nav>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="m-4 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive-soft text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </aside>
    </div>
  );
};
