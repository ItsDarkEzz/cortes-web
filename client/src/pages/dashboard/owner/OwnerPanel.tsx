/**
 * Owner Panel - Главная страница панели владельца
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, MessageCircle, Bot, Shield, Activity, Clock,
  TrendingUp, DollarSign, Zap, Server, ChevronRight,
  Ban, Send, CreditCard, BarChart3, Calendar
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBotStats, useLLMUsage, useTopLLMChats } from "@/hooks/use-owner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function LLMUsageWidget() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const { data, isLoading } = useLLMUsage(period);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-yellow-400" />
            Использование LLM
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Расходы и статистика моделей
          </p>
        </div>
        
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-4 bg-white/5">
            <TabsTrigger value="24h">24ч</TabsTrigger>
            <TabsTrigger value="7d">7д</TabsTrigger>
            <TabsTrigger value="30d">30д</TabsTrigger>
            <TabsTrigger value="all">Все</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-muted-foreground mb-1">Всего вызовов</p>
              <p className="text-2xl font-bold">
                {data?.entries.reduce((acc, e) => acc + e.calls_count, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-muted-foreground mb-1">Всего токенов</p>
              <p className="text-2xl font-bold">
                {formatNumber(data?.total_tokens || 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
              <p className="text-xs text-green-400 mb-1">Общая стоимость</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCost(data?.total_cost || 0)}
              </p>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Детализация по моделям</h4>
            {data?.entries && data.entries.length > 0 ? (
              data.entries.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entry.model}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                          {entry.provider}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.avg_latency_ms.toFixed(0)}ms avg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 text-sm w-full sm:w-auto">
                    <div className="flex flex-col items-end">
                      <span>{entry.calls_count} calls</span>
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(entry.tokens_input + entry.tokens_output)} tok
                      </span>
                    </div>
                    <span className="text-green-400 font-mono w-20 text-right">
                      {formatCost(entry.cost)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 border border-dashed border-white/10 rounded-xl">
                Нет данных за выбранный период
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TopChatsWidget() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const { data, isLoading } = useTopLLMChats(5, period);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Топ активных чатов
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Лидеры по расходам LLM
          </p>
        </div>
        
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-4 bg-white/5">
            <TabsTrigger value="24h">24ч</TabsTrigger>
            <TabsTrigger value="7d">7д</TabsTrigger>
            <TabsTrigger value="30d">30д</TabsTrigger>
            <TabsTrigger value="all">Все</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {data?.chats && data.chats.length > 0 ? (
            data.chats.map((chat, idx) => (
              <div key={chat.chat_id} className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-blue-400 transition-colors">
                      {chat.title || chat.username || chat.first_name || `Chat ${chat.chat_id}`}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {chat.chat_id}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-green-400 font-medium text-sm">
                    {formatCost(chat.cost_total)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {chat.calls_count} calls • {formatNumber(chat.tokens_total)} tok
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8 border border-dashed border-white/10 rounded-xl">
              Нет данных об активности чатов
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function OwnerPanel() {
  const { data: stats, isLoading: statsLoading } = useBotStats();

  if (statsLoading) {
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
    { icon: Calendar, label: "Память", href: "/dashboard/owner/memory", color: "text-cyan-400" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-2 h-full"
              >
                <action.icon className={`w-6 h-6 ${action.color}`} />
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

        {/* Detailed Stats */}
        <div className="grid lg:grid-cols-2 gap-6">
          <LLMUsageWidget />
          <TopChatsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}
