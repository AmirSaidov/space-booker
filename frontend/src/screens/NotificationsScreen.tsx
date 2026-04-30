import { ChevronLeft, Bell } from "lucide-react";
import { AppNotification } from "@/types/booking";

interface Props {
  notifications: AppNotification[];
  onBack: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationsScreen = ({ notifications, onBack, onMarkRead }: Props) => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="px-5 md:px-8 pt-4 pb-3 grid grid-cols-3 items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-foreground -ml-1.5 justify-self-start"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>
        <h1 className="text-base font-semibold text-center">Уведомления</h1>
        <span />
      </header>

      <div className="flex-1 px-5 md:px-8 pt-2 pb-4 space-y-2 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Bell className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Пока нет уведомлений</p>
          </div>
        )}

        {notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => onMarkRead(n.id)}
            className={`w-full text-left rounded-2xl border p-4 transition-colors ${
              n.read
                ? "bg-card border-border"
                : "bg-primary-soft border-primary/20"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-sm">{n.title}</h2>
              <span className="text-[11px] text-muted-foreground shrink-0">{n.time}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{n.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
