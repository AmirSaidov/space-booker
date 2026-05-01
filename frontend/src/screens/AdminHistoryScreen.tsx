import { useEffect, useState } from "react";
import { ChevronLeft, MapPin, Calendar, Clock, User as UserIcon } from "lucide-react";
import { fetchAdminHistory } from "@/lib/auth";

interface AdminHistoryScreenProps {
  onBack: () => void;
}

export const AdminHistoryScreen = ({ onBack }: AdminHistoryScreenProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAdminHistory(page)
      .then((res) => {
        if (res && Array.isArray(res.results)) {
          if (page === 1) {
            setHistory(res.results);
          } else {
            setHistory(prev => [...prev, ...res.results]);
          }
          setHasMore(res.next !== null);
        } else if (Array.isArray(res)) {
          // If no pagination just an array
          setHistory(res);
          setHasMore(false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) setPage(p => p + 1);
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      <header className="px-5 md:px-8 pt-4 pb-3 flex items-center justify-between border-b border-border">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-foreground -ml-1.5 justify-self-start"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>
        <h1 className="text-base font-semibold">Вся история</h1>
        <div className="w-8" />
      </header>

      <div className="flex-1 px-5 md:px-8 pt-4 pb-6 space-y-3 overflow-y-auto">
        {history.length === 0 && !loading && (
          <div className="mt-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Нет записей</p>
          </div>
        )}

        {history.map((h, i) => (
          <article
            key={`${h.id}-${i}`}
            className="rounded-2xl border border-border bg-card shadow-soft p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold">{h.user?.name || h.user?.username}</h2>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {h.room_name}, Стол {h.place_number}
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  !h.end_time
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {!h.end_time ? "Активно" : "Завершено"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {new Date(h.start_time).toLocaleString("ru-RU", {
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
              })}
              {h.end_time ? ` – ${new Date(h.end_time).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}` : ""}
            </div>
          </article>
        ))}

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? "Загрузка..." : "Показать еще"}
          </button>
        )}
      </div>
    </div>
  );
};
