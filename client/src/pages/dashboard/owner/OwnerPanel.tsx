/**
 * Owner Panel - Главная страница панели владельца
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, MessageCircle, Bot, Shield, Activity, Clock,
  TrendingUp, DollarSign, Zap, Server, ChevronRight,
  Ban, Send, CreditCard
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useBotStats, useLLMUsage } from "@/hooks/use-owner";
import { Loader2 } from "lucide-react";

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}д ${hours}ч`;
  if (hours > 0) return `${hours}ч ${mins}м`;
  return `${mins}м`;
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

export default function OwnerPanel() {
  const { data: stats, isLoading: statsLoading } = useBotStats();
  const { data: llmUsage, isLoading: llmLoading } = useLLMUsage('24h');

  if (statsLoading || llmLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const quickActions = [
    { icon: Activity, label: "Логи", href: "/dashboard/owner/logs", color: "text-blue-400" },
    { icon: Ban, label: "Баны", href: "/dashboard/owner/bans", color: "text-red-400" },
    { icon: Server, label: "Чаты", href: "/dashboard/owner/chats", color: "text-green-400" },
    { icon: CreditCard, label: "Подписки", href: "/dashboard/owner/subscriptions", color: "text-purple-400" },
    { icon: Send, label: "Рассылка", href: "/dashboard/owner/broadcast", color: "text-orange-400" },
    { icon: Zap, label: "LLM настройки", href: "/dashboard/owner/llm", color: "text-yellow-400" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Панель владельца
            </h1>
            <p className="text-muted-foreground">Полный контроль над ботом</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">Бот онлайн</span>
            <span className="text-sm text-muted-foreground ml-2">
              Uptime: {formatUptime(stats?.uptime_seconds || 0)}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
                <p className="font-medium text-sm">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Users */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-muted-foreground">Пользователи</span>
            </div>
            <p className="text-3xl font-bold">{stats?.total_users?.toLocaleString() || 0}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-green-400">+{stats?.active_users_24h || 0} за 24ч</span>
              <span className="text-muted-foreground">{stats?.active_users_7d || 0} за 7д</span>
            </div>
          </motion.div>

          {/* Chats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <span className="text-xs text-muted-foreground">Чаты</span>
            </div>
            <p className="text-3xl font-bold">{stats?.total_chats || 0}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-green-400">{stats?.active_chats || 0} активных</span>
            </div>
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-muted-foreground">Сообщения</span>
            </div>
            <p className="text-3xl font-bold">{stats?.total_messages_24h?.toLocaleString() || 0}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-muted-foreground">за 24 часа</span>
            </div>
          </motion.div>

          {/* Bans */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <Ban className="w-5 h-5 text-red-400" />
              <span className="text-xs text-muted-foreground">Глобальные баны</span>
            </div>
            <p className="text-3xl font-bold">{stats?.global_bans_count || 0}</p>
            <Link href="/dashboard/owner/bans">
              <span className="text-sm text-primary hover:underline cursor-pointer">Управление →</span>
            </Link>
          </motion.div>
        </div>

        {/* LLM Usage */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Использование LLM (24ч)
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {stats?.llm_calls_24h?.toLocaleString() || 0} вызовов
              </span>
              <span className="text-muted-foreground">
                {stats?.llm_tokens_24h?.toLocaleString() || 0} токенов
              </span>
              <span className="text-green-400 font-medium">
                {formatCost(stats?.llm_cost_24h || 0)}
              </span>
            </div>
          </div>

          {llmUsage?.entries && llmUsage.entries.length > 0 ? (
            <div className="space-y-2">
              {llmUsage.entries.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{entry.model}</p>
                      <p className="text-xs text-muted-foreground">{entry.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span>{entry.calls_count} вызовов</span>
                    <span className="text-muted-foreground">
                      {(entry.tokens_input + entry.tokens_output).toLocaleString()} токенов
                    </span>
                    <span className="text-green-400">{formatCost(entry.cost)}</span>
                    <span className="text-muted-foreground">{entry.avg_latency_ms.toFixed(0)}ms</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Нет данных об использовании LLM</p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
