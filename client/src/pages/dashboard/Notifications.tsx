import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Bell, Check, CheckCheck, Trash2, Trophy, MessageCircle,
  Zap, Users, Star, Settings, Filter, Loader2
} from "lucide-react";
import { useState } from "react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/use-notifications";
import type { Notification } from "@/lib/api";

type NotificationType = "achievement" | "quest" | "info" | "warning" | "system";

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  achievement: { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  quest: { icon: Zap, color: "text-green-400", bg: "bg-green-400/10" },
  info: { icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
  warning: { icon: Bell, color: "text-orange-400", bg: "bg-orange-400/10" },
  system: { icon: Settings, color: "text-muted-foreground", bg: "bg-white/5" },
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;
  return date.toLocaleDateString("ru-RU");
}

export default function Notifications() {
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const { data: notificationsData, isLoading } = useNotifications({ limit: 50 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useSEO({
    title: "Уведомления | Cortes AI",
    description: "Центр уведомлений Cortes",
    canonical: "/dashboard/notifications",
  });

  const notifications = notificationsData?.data ?? [];
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const handleMarkAsRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllRead.mutate();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="border-white/10 h-8" disabled={markAllRead.isPending}>
            <CheckCheck size={14} className="mr-1" />
            Прочитать все
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
          { key: "info", label: "Инфо" },
          { key: "warning", label: "Важное" },
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
            const config = typeConfig[notification.type] || typeConfig.system;
            const Icon = config.icon;
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors group ${
                  notification.is_read 
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
                      <h3 className={`font-medium text-sm ${notification.is_read ? "text-muted-foreground" : "text-white"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">{formatTime(notification.created_at)}</p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markRead.isPending}
                    >
                      <Check size={14} />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
