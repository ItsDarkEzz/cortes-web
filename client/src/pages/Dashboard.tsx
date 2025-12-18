import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  MessageCircle, Trophy, Zap, Users, Calendar, Crown, TrendingUp,
  ChevronRight, Star, Target, Settings
} from "lucide-react";

const mockUser = {
  name: "Шахриёр",
  username: "@shahriyor_dev",
  avatar: "🧑‍💻",
  level: 42,
  xp: 8750,
  xpToNext: 10000,
  rank: "Легенда чата",
};

const mockStats = [
  { icon: MessageCircle, label: "Сообщений", value: "12.8K", change: "+12%", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Zap, label: "Квестов", value: "156", change: "+8%", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { icon: Trophy, label: "Достижений", value: "23", change: "+3", color: "text-green-400", bg: "bg-green-400/10" },
  { icon: Calendar, label: "Дней", value: "89", change: "streak", color: "text-purple-400", bg: "bg-purple-400/10" },
];

const mockChats = [
  { id: 1, name: "Dev Community", members: 1250, role: "Админ", active: true, unread: 5 },
  { id: 2, name: "Crypto Talk", members: 890, role: "Участник", active: true, unread: 0 },
];

const mockQuests = [
  { title: "Отправить 100 сообщений", progress: 78, reward: "500 XP" },
  { title: "Получить 10 реакций", progress: 40, reward: "200 XP" },
];

export default function Dashboard() {
  useSEO({
    title: "Личный кабинет | Cortes AI",
    description: "Управляйте настройками бота Cortes",
    canonical: "/dashboard",
  });

  const xpProgress = (mockUser.xp / mockUser.xpToNext) * 100;

  return (
    <DashboardLayout>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-display font-bold">
          Привет, <span className="text-gradient-primary">{mockUser.name}</span> 👋
        </h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-3 mb-4"
      >
        {mockStats.map((stat, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-full blur-2xl opacity-40`} />
            <div className="relative flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <span className="ml-auto text-[10px] text-green-400 flex items-center gap-0.5">
                <TrendingUp size={10} />
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Content grid */}
      <div className="flex-1 grid lg:grid-cols-3 gap-4 min-h-0">
        {/* Profile & Quests */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Profile */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                {mockUser.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold">{mockUser.name}</h2>
                  <Crown className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-xs text-muted-foreground">{mockUser.rank}</p>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-black/20">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  Уровень {mockUser.level}
                </span>
                <span className="text-primary">{mockUser.xp.toLocaleString()} XP</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          </div>

          {/* Quests */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Активные квесты
            </h3>
            <div className="space-y-3">
              {mockQuests.map((quest, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{quest.title}</span>
                    <span className="text-primary">{quest.reward}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${quest.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/rpg">
              <Button variant="ghost" size="sm" className="w-full mt-3 text-primary text-xs h-8">
                Все квесты <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Chats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Ваши чаты
            </h3>
            <Link href="/dashboard/chats">
              <Button variant="ghost" size="sm" className="text-primary h-7 text-xs">
                Все <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-2 flex-1">
            {mockChats.map((chat) => (
              <motion.div 
                key={chat.id}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                      💬
                    </div>
                    {chat.active && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{chat.name}</p>
                    <p className="text-xs text-muted-foreground">{chat.members.toLocaleString()} участников</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chat.unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-[10px] font-medium">
                      {chat.unread}
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-1 rounded bg-white/10 text-muted-foreground">
                    {chat.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-lg border border-dashed border-white/20 text-center">
            <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 text-xs">
              + Добавить в чат
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
