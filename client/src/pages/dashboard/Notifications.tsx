import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Bell, Check, CheckCheck, Trash2, Trophy, MessageCircle,
  Zap, Users, Star, Settings, Filter
} from "lucide-react";
import { useState } from "react";

type NotificationType = "achievement" | "quest" | "chat" | "system" | "level";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, type: "achievement", title: "Новое достижение!", message: "Вы получили достижение «Болтун» за 1000 сообщений", time: "5 мин назад", read: false },
  { id: 2, type: "quest", title: "Квест выполнен", message: "Вы завершили квест «Отправить 100 сообщений» и получили 500 XP", time: "1 час назад", read: false },
  { id: 3, type: "level", title: "Новый уровень!", message: "Поздравляем! Вы достигли 42 уровня", time: "2 часа назад", read: false },
  { id: 4, type: "chat", title: "Dev Community", message: "Вас назначили модератором чата", time: "5 часов назад", read: true },
  { id: 5, type: "system", title: "Обновление системы", message: "Добавлены новые функции в RPG систему", time: "1 день назад", read: true },
  { id: 6, type: "quest", title: "Новый квест", message: "Доступен новый еженедельный квест «Пригласить друга»", time: "2 дня назад", read: true },
  { id: 7, type: "achievement", title: "Достижение близко", message: "Осталось 22% до достижения «Геймер»", time: "3 дня назад", read: true },
  { id: 8, type: "chat", title: "Crypto Talk", message: "Новый участник присоединился к чату", time: "4 дня назад", read: true },
];

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  achievement: { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  quest: { icon: Zap, color: "text-green-400", bg: "bg-green-400/10" },
  chat: { icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
  system: { icon: Settings, color: "text-muted-foreground", bg: "bg-white/5" },
  level: { icon: Star, color: "text-primary", bg: "bg-primary/10" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  useSEO({
    title: "Уведомления | Cortes AI",
    description: "Центр уведомлений Cortes",
    canonical: "/dashboard/notifications",
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Уведомления
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-xs font-medium">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">История событий и оповещений</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="border-white/10 h-8">
            <CheckCheck size={14} className="mr-1" />
            Прочитать все
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} className="border-white/10 h-8 text-red-400 hover:text-red-300">
            <Trash2 size={14} className="mr-1" />
            Очистить
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Filter size={14} className="text-muted-foreground shrink-0" />
        {[
          { key: "all", label: "Все" },
          { key: "achievement", label: "Достижения" },
          { key: "quest", label: "Квесты" },
          { key: "level", label: "Уровни" },
          { key: "chat", label: "Чаты" },
          { key: "system", label: "Система" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as NotificationType | "all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? "bg-primary text-white"
                : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-auto space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Нет уведомлений</p>
          </div>
        ) : (
          filteredNotifications.map((notification, idx) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors group ${
                  notification.read 
                    ? "bg-white/[0.02] border-white/5" 
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon size={18} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-medium text-sm ${notification.read ? "text-muted-foreground" : "text-white"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">{notification.time}</p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check size={14} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-400 hover:text-red-300"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
