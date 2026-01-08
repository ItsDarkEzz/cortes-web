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
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Профиль
          </h1>
          <p className="text-sm text-muted-foreground">Управление данными аккаунта</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
            <Edit2 size={16} className="mr-2" />
            Редактировать
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="border-white/10" disabled={updateName.isPending}>
              <X size={16} className="mr-2" />
              Отмена
            </Button>
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600" disabled={updateName.isPending}>
              {updateName.isPending ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Check size={16} className="mr-2" />}
              Сохранить
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-4 min-h-0 overflow-hidden">
        {/* Main Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-4 overflow-auto"
        >
          {/* Avatar & Basic Info */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 border border-white/10">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden shadow-lg shadow-primary/20">
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
                  <span className={`fallback-emoji text-5xl ${avatarUrl ? 'hidden' : ''}`}>👤</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Имя</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">О себе</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold">{displayName}</h2>
                    </div>
                    <p className="text-muted-foreground mb-2">{username}</p>
                    <p className="text-sm text-white/70">{formData.bio || "Нет описания"}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <MessageCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xl font-bold">{(stats?.messages_total ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Сообщений</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{stats?.chats_count ?? 0}</p>
              <p className="text-xs text-muted-foreground">Чатов</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Calendar className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xl font-bold">{stats?.days_active ?? 0}</p>
              <p className="text-xs text-muted-foreground">Дней</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4">Информация аккаунта</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Telegram ID</span>
                <span className="text-sm font-mono">{user?.id ?? "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Username</span>
                <span className="text-sm">{username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Дней активности</span>
                <span className="text-sm">{stats?.days_active ?? 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Дата регистрации</span>
                <span className="text-sm flex items-center gap-1">
                  <Calendar size={12} />
                  {joinedAt}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Activity Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(stats?.messages_total ?? 0).toLocaleString()}</p>
                <p className="text-xs text-blue-400">Всего сообщений</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Активен в {stats?.chats_count ?? 0} чатах
            </div>
          </div>

          {/* Quests Card */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold text-sm mb-3">Квесты</h3>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-primary">{stats?.quests_completed ?? 0}</p>
              <p className="text-xs text-muted-foreground">Выполнено квестов</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
