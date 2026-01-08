import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  MessageCircle, Users, ChevronRight, Settings, Loader2, 
  TrendingUp, Bot, Crown, Shield, Activity, Clock
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/use-user";
import { useChats } from "@/hooks/use-chats";

const API_BASE = import.meta.env.VITE_API_URL || '';

const roleConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  owner: { icon: <Crown size={12} />, label: "Владелец", color: "text-yellow-400" },
  admin: { icon: <Shield size={12} />, label: "Админ", color: "text-blue-400" },
  moderator: { icon: <Shield size={12} />, label: "Модератор", color: "text-green-400" },
};

export default function Dashboard() {
  useSEO({
    title: "Личный кабинет | Cortes AI",
    description: "Управляйте настройками бота Cortes",
    canonical: "/dashboard",
  });

  const { user } = useAuthContext();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: chatsData, isLoading: chatsLoading } = useChats();

  const chats = chatsData?.chats ?? [];
  const displayName = user?.name || user?.username || "Пользователь";
  const avatarUrl = user?.avatar ? `${API_BASE}${user.avatar}` : null;

  const totalMessagesToday = chats.reduce((sum, c) => sum + (c.messages_today || 0), 0);
  const activeChats = chats.filter(c => c.bot_active).length;
  const totalMembers = chats.reduce((sum, c) => sum + (c.members_count || 0), 0);

  if (statsLoading || chatsLoading) {
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
      <div className="grid lg:grid-cols-3 gap-6 h-full">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Welcome + Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {/* Welcome Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Добро пожаловать</p>
                  <h1 className="text-xl font-bold">{displayName}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4 text-green-400" />
                <span>{stats?.days_active || 1} дней с Cortes</span>
              </div>
            </div>

            {/* Activity Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Активность сегодня</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold text-primary">{totalMessagesToday}</p>
                  <p className="text-sm text-muted-foreground">сообщений</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{activeChats}</p>
                  <p className="text-sm text-muted-foreground">активных чатов</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chats List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col min-h-0"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Мои чаты
                <span className="text-sm font-normal text-muted-foreground">({chats.length})</span>
              </h3>
              <Link href="/dashboard/chats">
                <Button variant="ghost" size="sm" className="text-primary">
                  Все <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="flex-1 overflow-auto space-y-2">
              {chats.length > 0 ? chats.slice(0, 6).map((chat, idx) => (
                <Link key={chat.id} href={`/dashboard/chats/${chat.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`${API_BASE}/chats/${chat.id}/avatar`}
                          alt={chat.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <span className="fallback-emoji hidden text-lg">💬</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${chat.bot_active ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{chat.name}</p>
                        {chat.role && roleConfig[chat.role] && (
                          <span className={`flex items-center gap-1 text-xs ${roleConfig[chat.role].color}`}>
                            {roleConfig[chat.role].icon}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{chat.members_count.toLocaleString()} участников</p>
                    </div>

                    <div className="text-right shrink-0">
                      {chat.messages_today > 0 ? (
                        <>
                          <p className="font-medium">{chat.messages_today}</p>
                          <p className="text-xs text-muted-foreground">сегодня</p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">—</p>
                      )}
                    </div>

                    <Settings className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </motion.div>
                </Link>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12">
                  <Bot className="w-16 h-16 text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground mb-4">Нет подключённых чатов</p>
                  <a href="https://t.me/CortesAiBot" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary hover:bg-primary/90">
                      Добавить бота
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          {/* Stats Overview */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4">Общая статистика</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Всего сообщений</span>
                </div>
                <span className="font-bold">{stats?.messages_total?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Участников</span>
                </div>
                <span className="font-bold">{totalMembers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Дней активности</span>
                </div>
                <span className="font-bold">{stats?.days_active || 1}</span>
              </div>
            </div>
          </div>

          {/* Bot Status */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src="/favicon.webp" alt="Cortes" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold">Cortes Ai Entity</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">Онлайн</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Бот активен в {activeChats} из {chats.length} чатов
            </p>
          </div>

          {/* Add Chat CTA */}
          {chats.length > 0 && (
            <div className="p-6 rounded-2xl border border-dashed border-white/20 text-center">
              <p className="text-sm text-muted-foreground mb-3">Хотите добавить ещё чат?</p>
              <a href="https://t.me/CortesAiBot" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20">
                  + Добавить бота
                </Button>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
