import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Trophy, Lock } from "lucide-react";

const achievements = [
  { id: 1, icon: "🏆", name: "Первопроходец", description: "Первое сообщение в чате", unlocked: true, date: "15 мар 2024" },
  { id: 2, icon: "🔥", name: "На огне", description: "7 дней подряд активности", unlocked: true, date: "22 мар 2024" },
  { id: 3, icon: "💬", name: "Болтун", description: "1000 сообщений", unlocked: true, date: "5 апр 2024" },
  { id: 4, icon: "🎯", name: "Квестоман", description: "50 квестов выполнено", unlocked: true, date: "12 апр 2024" },
  { id: 5, icon: "⭐", name: "Звезда", description: "Получить 100 реакций", unlocked: true, date: "20 апр 2024" },
  { id: 6, icon: "🚀", name: "Ракета", description: "Достичь 10 уровня", unlocked: true, date: "1 мая 2024" },
  { id: 7, icon: "👑", name: "Король", description: "Стать админом чата", unlocked: true, date: "15 мая 2024" },
  { id: 8, icon: "🎮", name: "Геймер", description: "100 квестов выполнено", unlocked: false, progress: 78 },
  { id: 9, icon: "💎", name: "Бриллиант", description: "Достичь 50 уровня", unlocked: false, progress: 84 },
  { id: 10, icon: "🌟", name: "Суперзвезда", description: "500 реакций получено", unlocked: false, progress: 45 },
  { id: 11, icon: "🏅", name: "Чемпион", description: "Топ-1 в таблице лидеров", unlocked: false, progress: 0 },
  { id: 12, icon: "🎪", name: "Шоумен", description: "10000 сообщений", unlocked: false, progress: 12 },
];

export default function Achievements() {
  useSEO({
    title: "Достижения | Cortes AI",
    description: "Ваши достижения в системе Cortes",
    canonical: "/dashboard/achievements",
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Достижения
          </h1>
          <p className="text-sm text-muted-foreground">
            Разблокировано {unlockedCount} из {achievements.length}
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
          <span className="text-yellow-400 font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          transition={{ duration: 1 }}
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
        />
      </div>

      {/* Achievements grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`relative p-4 rounded-xl border text-center transition-colors ${
                achievement.unlocked 
                  ? "bg-white/5 border-white/10 hover:border-white/20" 
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              {!achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock size={12} className="text-muted-foreground" />
                </div>
              )}
              
              <div className={`text-3xl mb-2 ${!achievement.unlocked && "grayscale opacity-40"}`}>
                {achievement.icon}
              </div>
              
              <h3 className={`font-semibold text-sm mb-1 ${!achievement.unlocked && "text-muted-foreground"}`}>
                {achievement.name}
              </h3>
              
              <p className="text-[10px] text-muted-foreground mb-2">
                {achievement.description}
              </p>

              {achievement.unlocked ? (
                <span className="text-[10px] text-green-400">{achievement.date}</span>
              ) : (
                <div className="space-y-1">
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary/50"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{achievement.progress}%</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
