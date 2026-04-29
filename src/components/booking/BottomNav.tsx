import { Map, Calendar, Clock, User } from "lucide-react";

interface BottomNavProps {
  active?: "map" | "bookings" | "history" | "profile";
}

const items = [
  { key: "map", label: "Карта", icon: Map },
  { key: "bookings", label: "Мои брони", icon: Calendar },
  { key: "history", label: "История", icon: Clock },
  { key: "profile", label: "Профиль", icon: User },
] as const;

export const BottomNav = ({ active = "map" }: BottomNavProps) => {
  return (
    <nav className="border-t border-border bg-background px-2 pt-2 pb-3">
      <ul className="flex items-center justify-around">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <li key={key}>
              <button
                type="button"
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};