import { LogOut, Bell, Globe, Shield, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav, NavKey } from "@/components/booking/BottomNav";
import { UserProfile } from "@/types/booking";

interface Props {
  user: UserProfile;
  onLogout: () => void;
  onNavigate: (key: NavKey) => void;
  onOpenNotifications: () => void;
}

export const ProfileScreen = ({ user, onLogout, onNavigate, onOpenNotifications }: Props) => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 pt-4 pb-3 text-center">
        <h1 className="text-base font-semibold">Профиль</h1>
      </header>

      <div className="flex-1 px-5 pt-2 pb-4 space-y-4 overflow-y-auto">
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

        <section className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <Item icon={<Bell className="w-4 h-4" />} label="Уведомления" onClick={onOpenNotifications} />
          <Item icon={<Globe className="w-4 h-4" />} label="Язык" value="Русский" />
          <Item icon={<Shield className="w-4 h-4" />} label="Конфиденциальность" />
          <Item icon={<HelpCircle className="w-4 h-4" />} label="Помощь" />
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

      <BottomNav active="profile" onNavigate={onNavigate} />
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
