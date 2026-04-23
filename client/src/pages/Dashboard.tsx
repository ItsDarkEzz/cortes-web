import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  MessageCircle, Users, ChevronRight, Settings, Loader2, 
  Activity, Clock, Crown, Shield, ShieldCheck
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/use-user";
import { useChats } from "@/hooks/use-chats";

const API_BASE = import.meta.env.VITE_API_URL || '';

const roleConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  owner: { icon: <Crown size={12} />, label: "Владелец", color: "text-yellow-400" },
  admin: { icon: <Shield size={12} />, label: "Админ", color: "text-blue-400" },
  moderator: { icon: <ShieldCheck size={12} />, label: "Модератор", color: "text-green-400" },
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
           <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 h-full min-h-0">
        
        {/* Left Column - Main Content */}
        <div className="flex flex-col gap-6 min-w-0">
          
          {/* Bento Grid Top Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {/* Identity Card */}
            <div className="relative overflow-hidden p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#3B82F6]/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
               <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                 <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center overflow-hidden ring-1 ring-white/10 shadow-lg">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-cortes-display text-white">C</span>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                      <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#3B82F6]">В сети</span>
                    </div>
                 </div>

                 <div>
                   <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] mb-2">Оператор</p>
                   <h1 className="font-cortes-display text-[clamp(2rem,3vw,2.5rem)] leading-[0.9] tracking-[-0.04em] text-white truncate">
                     {displayName}
                   </h1>
                 </div>
               </div>
            </div>

            {/* Daily Activity Card */}
            <div className="relative overflow-hidden p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
               <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#8B5CF6]/10 rounded-full blur-[60px] pointer-events-none translate-y-1/2 translate-x-1/4" />
               <div className="relative z-10">
                 <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Активность сегодня</p>
                 <div className="font-cortes-display text-[clamp(3.5rem,5vw,5rem)] leading-[0.85] tracking-[-0.06em] text-white">
                   {totalMessagesToday}
                 </div>
               </div>
               
               <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                 <div>
                   <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Группы</p>
                   <p className="font-cortes-display text-2xl text-white">{activeChats}</p>
                 </div>
                 <div>
                   <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Дней с нами</p>
                   <p className="font-cortes-display text-2xl text-white">{stats?.days_active || 1}</p>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Chats Flow Module */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 flex flex-col p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-cortes-display text-2xl text-white tracking-tight">Подключенные Узлы</h3>
                <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
                  Доступно чатов: {chats.length}
                </p>
              </div>
              <Link href="/dashboard/chats">
                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2.5 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10 hover:text-white cursor-pointer group">
                  Все чаты
                  <ChevronRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
            
            <div className="grid gap-3 flex-1 content-start">
              {chats.length > 0 ? chats.slice(0, 6).map((chat, idx) => (
                <Link key={chat.id} href={`/dashboard/chats/${chat.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04] hover:border-white/10 cursor-pointer overflow-hidden"
                  >
                    {chat.bot_active && (
                       <div className="absolute left-0 inset-y-0 w-1 bg-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <div className="flex min-w-0 items-center gap-4 pl-2">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-hidden">
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
                          <span className="fallback-emoji hidden font-cortes-mono text-[10px] text-white/40">ID</span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#09090b] ${chat.bot_active ? 'bg-[#3B82F6]' : 'bg-white/20'}`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-cortes-display text-lg text-white truncate leading-none mt-1">{chat.name}</p>
                          {chat.role && roleConfig[chat.role] && (
                            <span className={`inline-flex items-center gap-1 ${roleConfig[chat.role].color}`}>
                              {roleConfig[chat.role].icon}
                            </span>
                          )}
                        </div>
                        <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                          {chat.members_count.toLocaleString()} участников
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 pr-2">
                      <div className="hidden sm:block text-right">
                        {chat.messages_today > 0 ? (
                          <>
                            <p className="font-cortes-display text-xl text-white leading-none">{chat.messages_today}</p>
                            <p className="font-cortes-mono text-[9px] uppercase tracking-[0.2em] text-[#3B82F6] mt-1">сегодня</p>
                          </>
                        ) : (
                          <p className="font-cortes-mono text-[10px] text-white/20">—</p>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all bg-[#09090b]">
                         <Settings className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-6">
                    <span className="font-cortes-display text-2xl text-white/20">0</span>
                  </div>
                  <h3 className="font-cortes-display text-2xl text-white mb-2">Сеть пуста</h3>
                  <p className="text-white/40 mb-8 max-w-xs leading-relaxed">Система не обнаружила подключенных групп. Инициируйте добавление бота.</p>
                  <a href="https://t.me/CortesAiBot" target="_blank" rel="noopener noreferrer">
                    <span className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105">
                      Добавить Cortes
                    </span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-6"
        >
          {/* Global Terminal Card */}
          <div className="p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <h3 className="font-cortes-display text-2xl text-white mb-8 border-b border-white/10 pb-4">Терминал данных</h3>
            <div className="space-y-6">
              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-4 h-4 text-[#3B82F6]" />
                  <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Объем сообщений</span>
                </div>
                <div className="font-cortes-display text-4xl text-white group-hover:text-[#3B82F6] transition-colors">
                  {stats?.messages_total?.toLocaleString() || 0}
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Покрытие аудитории</span>
                </div>
                <div className="font-cortes-display text-4xl text-white group-hover:text-[#8B5CF6] transition-colors">
                  {totalMembers.toLocaleString()}
                </div>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Циклы активности</span>
                </div>
                <div className="font-cortes-display text-4xl text-white">
                  {stats?.days_active || 1}
                </div>
              </div>
            </div>
          </div>

          {/* System Status Node */}
          <div className="p-8 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.1),transparent_70%)] bg-[#09090b]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-[16px] overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                 <span className="font-cortes-display text-[1rem] text-white">C</span>
              </div>
              <div>
                <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] mb-1">Ядро системы</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <span className="font-cortes-display text-xl text-white leading-none mt-1">Функционирует</span>
                </div>
              </div>
            </div>
            <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] leading-relaxed text-white/40">
              Выделено {activeChats} вычислительных узлов из {chats.length} возможных подключений.
            </p>
          </div>

          {/* Add Chat CTA (only if they already have chats) */}
          {chats.length > 0 && (
             <a href="https://t.me/CortesAiBot" target="_blank" rel="noopener noreferrer" className="mt-2 text-center block">
                <span className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-white/10 px-6 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/50 transition-all hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6]">
                  + Инициализировать новый узел
                </span>
             </a>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
