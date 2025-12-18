import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  User, Camera, Save, Calendar, Trophy, MessageCircle,
  Star, Crown, Edit2, Check, X
} from "lucide-react";
import { useState } from "react";

const mockUser = {
  name: "Шахриёр",
  username: "@shahriyor_dev",
  bio: "Разработчик и энтузиаст AI технологий",
  avatar: "🧑‍💻",
  telegramId: "123456789",
  joinedAt: "15 марта 2024",
  level: 42,
  xp: 125000,
  rank: "Легенда чата",
  chatsCount: 4,
  messagesCount: 12847,
  achievementsCount: 23,
};

const avatarOptions = ["🧑‍💻", "👨‍💻", "👩‍💻", "🧔", "👨‍🎨", "👩‍🎨", "🦸‍♂️", "🦸‍♀️", "🧙‍♂️", "🧙‍♀️", "🤖", "👽"];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    bio: mockUser.bio,
    avatar: mockUser.avatar,
  });

  useSEO({
    title: "Профиль | Cortes AI",
    description: "Редактирование профиля пользователя",
    canonical: "/dashboard/profile",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Здесь будет API запрос
  };

  const handleCancel = () => {
    setFormData({
      name: mockUser.name,
      bio: mockUser.bio,
      avatar: mockUser.avatar,
    });
    setIsEditing(false);
  };

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
            <Button variant="outline" onClick={handleCancel} className="border-white/10">
              <X size={16} className="mr-2" />
              Отмена
            </Button>
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              <Check size={16} className="mr-2" />
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
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-lg shadow-primary/20">
                  {formData.avatar}
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Camera size={14} />
                  </button>
                )}
                
                {/* Avatar Picker */}
                {showAvatarPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-full left-0 mt-2 p-3 rounded-xl bg-card border border-white/10 shadow-xl z-10"
                  >
                    <div className="grid grid-cols-4 gap-2">
                      {avatarOptions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, avatar: emoji }));
                            setShowAvatarPicker(false);
                          }}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl hover:bg-white/10 transition-colors ${
                            formData.avatar === emoji ? "bg-primary/20 ring-2 ring-primary" : ""
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
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
                      <h2 className="text-2xl font-bold">{formData.name}</h2>
                      <Crown className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-muted-foreground mb-2">{mockUser.username}</p>
                    <p className="text-sm text-white/70">{formData.bio}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <MessageCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xl font-bold">{mockUser.messagesCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Сообщений</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-xl font-bold">{mockUser.achievementsCount}</p>
              <p className="text-xs text-muted-foreground">Достижений</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Star className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{mockUser.chatsCount}</p>
              <p className="text-xs text-muted-foreground">Чатов</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4">Информация аккаунта</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Telegram ID</span>
                <span className="text-sm font-mono">{mockUser.telegramId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Username</span>
                <span className="text-sm">{mockUser.username}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Дата регистрации</span>
                <span className="text-sm flex items-center gap-1">
                  <Calendar size={12} />
                  {mockUser.joinedAt}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Level & Rank */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Level Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">Уровень {mockUser.level}</p>
                <p className="text-xs text-yellow-400">{mockUser.rank}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Всего XP</span>
                <span className="text-yellow-400">{mockUser.xp.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
              </div>
            </div>
          </div>

          {/* Rank Progress */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold text-sm mb-3">Путь к следующему рангу</h3>
            <div className="space-y-2">
              {[
                { name: "Новичок", level: 1, done: true },
                { name: "Активист", level: 10, done: true },
                { name: "Ветеран", level: 25, done: true },
                { name: "Легенда", level: 40, done: true },
                { name: "Мастер", level: 50, done: false, current: true },
              ].map((rank, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    rank.done ? "bg-green-500/20 text-green-400" : 
                    rank.current ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                  }`}>
                    {rank.done ? "✓" : rank.level}
                  </div>
                  <span className={`text-sm ${rank.current ? "text-primary font-medium" : rank.done ? "text-white" : "text-muted-foreground"}`}>
                    {rank.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
