import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Gamepad2, Star, Target, Flame, Award, TrendingUp } from "lucide-react";

const mockUser = {
  level: 42,
  xp: 8750,
  xpToNext: 10000,
  rank: "Легенда чата",
  totalXp: 125000,
  streak: 15,
};

const mockQuests = [
  { id: 1, title: "Отправить 100 сообщений", progress: 78, max: 100, reward: "500 XP", type: "daily" },
  { id: 2, title: "Получить 10 реакций", progress: 4, max: 10, reward: "200 XP", type: "daily" },
  { id: 3, title: "Пригласить друга", progress: 0, max: 1, reward: "1000 XP", type: "weekly" },
  { id: 4, title: "Написать 1000 сообщений", progress: 847, max: 1000, reward: "2000 XP", type: "achievement" },
];

const mockLeaderboard = [
  { rank: 1, name: "Алексей", level: 58, xp: 185000, avatar: "👨‍💻" },
  { rank: 2, name: "Мария", level: 52, xp: 156000, avatar: "👩‍🎨" },
  { rank: 3, name: "Шахриёр", level: 42, xp: 125000, avatar: "🧑‍💻", isYou: true },
  { rank: 4, name: "Дмитрий", level: 38, xp: 98000, avatar: "🧔" },
  { rank: 5, name: "Анна", level: 35, xp: 87000, avatar: "👩‍🔬" },
];

const statCards = [
  { icon: Star, label: "Уровень", value: mockUser.level, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { icon: TrendingUp, label: "Всего XP", value: mockUser.totalXp.toLocaleString(), color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Flame, label: "Streak", value: `${mockUser.streak} дней`, color: "text-orange-400", bg: "bg-orange-400/10" },
  { icon: Award, label: "Ранг", value: mockUser.rank, color: "text-purple-400", bg: "bg-purple-400/10" },
];

export default function RPG() {
  useSEO({
    title: "RPG Прогресс | Cortes AI",
    description: "Ваш игровой прогресс в системе Cortes",
    canonical: "/dashboard/rpg",
  });

  const xpProgress = (mockUser.xp / mockUser.xpToNext) * 100;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-primary" />
          RPG Прогресс
        </h1>
        <p className="text-sm text-muted-foreground">Выполняйте квесты и поднимайтесь в рейтинге</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Прогресс до уровня {mockUser.level + 1}</span>
          <span className="text-sm text-primary">{mockUser.xp.toLocaleString()} / {mockUser.xpToNext.toLocaleString()} XP</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="flex-1 grid lg:grid-cols-2 gap-4 min-h-0">
        {/* Quests */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Активные квесты
          </h3>
          <div className="space-y-3 flex-1 overflow-auto">
            {mockQuests.map((quest) => (
              <div key={quest.id} className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{quest.title}</span>
                  <span className="text-xs text-primary">{quest.reward}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(quest.progress / quest.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-12 text-right">
                    {quest.progress}/{quest.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            Таблица лидеров
          </h3>
          <div className="space-y-2 flex-1 overflow-auto">
            {mockLeaderboard.map((user) => (
              <div 
                key={user.rank}
                className={`flex items-center gap-3 p-2 rounded-lg ${user.isYou ? "bg-primary/20 border border-primary/30" : "bg-white/5"}`}
              >
                <span className={`w-6 text-center font-bold ${
                  user.rank === 1 ? "text-yellow-400" : 
                  user.rank === 2 ? "text-gray-400" : 
                  user.rank === 3 ? "text-orange-400" : "text-muted-foreground"
                }`}>
                  {user.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name} {user.isYou && <span className="text-primary">(вы)</span>}</p>
                  <p className="text-[10px] text-muted-foreground">Lvl {user.level} • {user.xp.toLocaleString()} XP</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
