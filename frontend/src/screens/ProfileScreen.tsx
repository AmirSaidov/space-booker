import { LogOut, Bell, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav, NavKey } from "@/components/booking/BottomNav";
import { UserProfile, Room } from "@/types/booking";

interface Props {
  user: UserProfile;
  rooms: Room[];
  onLogout: () => void;
  onNavigate: (key: NavKey) => void;
  onOpenNotifications: () => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
  isAdmin?: boolean;
}

export const ProfileScreen = ({ user, rooms, isAdmin = false, onLogout, onNavigate, onOpenNotifications, onUpdateProfile }: Props) => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 md:px-8 pt-4 pb-3 text-center">
        <h1 className="text-base font-semibold">Профиль</h1>
      </header>

      <div className="flex-1 px-5 md:px-8 pt-2 pb-4 space-y-4 overflow-y-auto">
        <section className="rounded-2xl border border-border bg-card shadow-card p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {user.position} · {user.department}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden flex flex-col">
          <Item icon={<Bell className="w-4 h-4" />} label="Уведомления" onClick={onOpenNotifications} />
          <div className="w-full flex items-center gap-3 px-4 py-3.5 border-t border-border bg-card text-left relative">
            <span className="text-muted-foreground"><MapPin className="w-4 h-4" /></span>
            <span className="flex-1 text-sm font-medium">Мой кабинет</span>
            <select
              value={user.preferred_room || ""}
              onChange={(e) => onUpdateProfile({ preferred_room: e.target.value })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="" disabled className="text-foreground bg-background">Не выбран</option>
              {rooms.map(r => <option key={r.id} value={r.id} className="text-foreground bg-background">{r.name}</option>)}
            </select>
            <span className="text-xs text-muted-foreground pointer-events-none">
              {rooms.find(r => r.id === String(user.preferred_room))?.name || "Не выбран"}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </section>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive-soft hover:text-destructive gap-2"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </Button>

        <p className="text-center text-xs text-muted-foreground">Версия 1.0.0</p>
      </div>

      <BottomNav active="profile" isAdmin={isAdmin} onNavigate={onNavigate} />
    </div>
  );
};

const Item = ({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 hover:bg-secondary transition-colors text-left"
  >
    <span className="text-muted-foreground">{icon}</span>
    <span className="flex-1 text-sm font-medium">{label}</span>
    {value && <span className="text-xs text-muted-foreground">{value}</span>}
    <ChevronRight className="w-4 h-4 text-muted-foreground" />
  </button>
);
