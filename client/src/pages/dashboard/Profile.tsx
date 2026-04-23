import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  User, Calendar, MessageCircle,
  Edit2, Check, X, Loader2, Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserStats, useUpdateUserName } from "@/hooks/use-user";

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Profile() {
  const { user } = useAuthContext();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const updateName = useUpdateUserName();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.username || "",
        bio: "",
      });
    }
  }, [user]);

  useSEO({
    title: "Профиль | Cortes AI",
    description: "Редактирование профиля пользователя",
    canonical: "/dashboard/profile",
  });

  const handleSave = async () => {
    if (formData.name !== user?.name) {
      await updateName.mutateAsync(formData.name);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || user?.username || "",
      bio: "",
    });
    setIsEditing(false);
  };

  if (statsLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      </DashboardLayout>
    );
  }

  const displayName = user?.name || user?.username || "Пользователь";
  const username = user?.username ? `@${user.username}` : `ID: ${user?.id}`;
  const joinedAt = user?.created_at ? new Date(user.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const avatarUrl = user?.id ? `${API_BASE}/user/avatar/${user.id}` : null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
              Личное Дело.
            </h1>
            <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-3">
              Управление идентификатором
            </p>
          </div>
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
             {!isEditing ? (
               <span onClick={() => setIsEditing(true)} className="inline-flex h-12 w-full sm:w-auto cursor-pointer items-center justify-center rounded-2xl bg-white px-8 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                 <Edit2 size={14} className="mr-2" />
                 Редактировать
               </span>
             ) : (
               <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                 <span onClick={handleCancel} className={`inline-flex h-12 w-full sm:w-auto cursor-pointer items-center justify-center rounded-2xl border border-white/20 px-8 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10 ${updateName.isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                   <X size={14} className="mr-2" />
                   Отмена
                 </span>
                 <span onClick={handleSave} className={`inline-flex h-12 w-full sm:w-auto cursor-pointer items-center justify-center rounded-2xl bg-[#3B82F6] px-8 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 shadow-[0_0_15px_rgba(59,130,246,0.5)] ${updateName.isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                   {updateName.isPending ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Check size={14} className="mr-2" />}
                   Сохранить
                 </span>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr_380px] gap-6 min-h-0 pb-36 md:pb-10 overflow-x-hidden overflow-y-auto w-full min-w-0 max-w-full">
        {/* Main Profile Area */}
        <div className="flex flex-col gap-6">
          
          {/* Avatar & Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-[200px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-[24px] bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 border border-[rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-md">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={displayName} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={`fallback-emoji font-cortes-display text-5xl text-white ${avatarUrl ? 'hidden' : ''}`}>ID</span>
                </div>
              </div>

              <div className="flex-1 w-full text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Позывной</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full h-12 px-4 rounded-[16px] bg-black border border-white/20 font-cortes-display text-xl text-white focus:outline-none focus:border-[#3B82F6]/50 transition-colors shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Описание (Bio)</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={2}
                        className="w-full px-4 py-3 rounded-[16px] bg-black border border-white/20 font-cortes-mono text-xs text-white focus:outline-none focus:border-[#3B82F6]/50 resize-none transition-colors shadow-inner"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <h2 className="font-cortes-display text-4xl lg:text-5xl text-white mb-2 tracking-[-0.03em]">{displayName}</h2>
                    <p className="font-cortes-mono text-[12px] uppercase tracking-[0.1em] text-[#3B82F6] mb-4">{username}</p>
                    <p className="text-sm leading-relaxed text-white/50 max-w-lg">{formData.bio || "Нет дополнительных данных по этому идентификатору."}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Core Info */}
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <h3 className="font-cortes-display text-2xl text-white mb-6 border-b border-white/10 pb-4">Системный реестр</h3>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4">
                <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Telegram ID</span>
                <span className="font-cortes-mono text-sm text-white mt-1 sm:mt-0">{user?.id ?? "—"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4">
                <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Username</span>
                <span className="font-cortes-mono text-sm text-white mt-1 sm:mt-0">{username}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4">
                <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Циклы активности</span>
                <span className="font-cortes-display text-xl text-white mt-1 sm:mt-0">{stats?.days_active ?? 1}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2">
                <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Активирован</span>
                <span className="font-cortes-mono text-[10px] text-white mt-1 sm:mt-0 flex items-center gap-2">
                  <Calendar size={12} className="text-[#3B82F6]" />
                  {joinedAt}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-6"
        >
          {/* Main Stats Block */}
          <div className="p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
             <h3 className="font-cortes-display text-2xl text-white mb-8 border-b border-white/10 pb-4">Производительность</h3>
             
             <div className="space-y-8">
               <div className="group">
                 <div className="flex items-center gap-3 mb-2">
                   <MessageCircle className="w-5 h-5 text-[#3B82F6]" />
                   <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Эмиссия</span>
                 </div>
                 <div className="font-cortes-display text-5xl text-white group-hover:text-[#3B82F6] transition-colors leading-none tracking-[-0.04em]">
                   {(stats?.messages_total ?? 0).toLocaleString()}
                 </div>
                 <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-[#3B82F6] mt-2">Всего сообщений</p>
               </div>

               <div className="group">
                 <div className="flex items-center gap-3 mb-2">
                   <Users className="w-5 h-5 text-[#8B5CF6]" />
                   <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Узлы связи</span>
                 </div>
                 <div className="font-cortes-display text-5xl text-white group-hover:text-[#8B5CF6] transition-colors leading-none tracking-[-0.04em]">
                   {stats?.chats_count ?? 0}
                 </div>
                 <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-[#8B5CF6] mt-2">Управляет чатами</p>
               </div>
             </div>
          </div>

          {/* Quests Summary */}
          <div className="p-8 rounded-[32px] border border-[#8B5CF6]/30 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1),transparent_70%)] bg-[#09090b] shadow-[0_10px_30px_rgba(139,92,246,0.2)]">
            <h3 className="font-cortes-display text-xl text-white mb-4">Награды ядра</h3>
            <div className="text-center py-6 border border-white/10 rounded-[20px] bg-black/50">
              <p className="font-cortes-display text-6xl text-white mb-2 leading-none">{stats?.quests_completed ?? 0}</p>
              <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] px-4 leading-relaxed">Квестов<br/>Выполнено</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
