import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, MessageCircle, Bot, Shield, Activity, Clock,
  TrendingUp, DollarSign, Zap, Server, ChevronRight,
  Ban, Send, CreditCard, BarChart3, Calendar, ShieldAlert
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBotStats, useLLMUsage, useTopLLMChats } from "@/hooks/use-owner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const scrollStyles = "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20";

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}д ${hours}ч`;
  if (hours > 0) return `${hours}ч ${mins}м`;
  return `${mins}м`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function LLMUsageWidget() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const { data, isLoading } = useLLMUsage(period);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 md:p-8 rounded-[32px] bg-[#09090b]/80 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] w-full min-w-0"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6 w-full min-w-0">
        <div className="min-w-0">
          <h3 className="font-cortes-display text-2xl flex items-center gap-3 text-white truncate">
            <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
            Использование LLM
          </h3>
          <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 truncate">
            Расходы и запросы к моделям
          </p>
        </div>
        
        <div className="flex bg-white/[0.02] border border-white/10 p-1 rounded-2xl w-full sm:w-auto shrink-0">
          {['24h', '7d', '30d', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-[14px] font-cortes-mono text-[10px] uppercase tracking-[0.1em] transition-all ${period === p ? "bg-white text-black shadow-sm" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              {p === 'all' ? 'Все' : p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 min-w-0 flex flex-col items-center text-center">
              <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 truncate w-full">Запросов</p>
              <p className="font-cortes-display text-4xl text-white truncate w-full">
                {formatNumber(data?.entries.reduce((acc, e) => acc + e.calls_count, 0) || 0)}
              </p>
            </div>
            <div className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 min-w-0 flex flex-col items-center text-center">
              <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 truncate w-full">Токенов</p>
              <p className="font-cortes-display text-4xl text-white truncate w-full">
                {formatNumber(data?.total_tokens || 0)}
              </p>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 mt-6">
            <h4 className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 px-2">Детализация по моделям</h4>
            {data?.entries && data.entries.length > 0 ? (
              data.entries.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all gap-4 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-[14px] bg-[#09090b] shadow-inner border border-white/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-cortes-display text-lg leading-none tracking-tight text-white mb-1.5 truncate">{entry.model}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-[#3B82F6] px-2 py-0.5 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 truncate">
                          {entry.provider}
                        </span>
                        <span className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/30 truncate">
                          {entry.avg_latency_ms.toFixed(0)}MS
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 text-sm shrink-0">
                    <div className="flex flex-col items-end min-w-[80px]">
                      <span className="font-cortes-mono text-[11px] text-white tracking-[0.05em]">{formatNumber(entry.calls_count)} CALLS</span>
                      <span className="font-cortes-mono text-[9px] text-white/40 tracking-[0.1em] mt-1">
                        {formatNumber(entry.tokens_input + entry.tokens_output)} TOK
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/30 py-8 border border-dashed border-white/10 rounded-[20px] bg-white/[0.01]">
                Нет данных за период
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TopChatsWidget() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const { data, isLoading } = useTopLLMChats(5, period);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 md:p-8 rounded-[32px] bg-[#09090b]/80 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] w-full min-w-0"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6 w-full min-w-0">
        <div className="min-w-0">
          <h3 className="font-cortes-display text-2xl flex items-center gap-3 text-white truncate">
            <TrendingUp className="w-5 h-5 text-[#3B82F6] shrink-0" />
            Топ узлов
          </h3>
          <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 truncate">
            Лидеры по расходам нейросети
          </p>
        </div>
        
        <div className="flex bg-white/[0.02] border border-white/10 p-1 rounded-2xl w-full sm:w-auto shrink-0">
          {['24h', '7d', '30d', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-[14px] font-cortes-mono text-[10px] uppercase tracking-[0.1em] transition-all ${period === p ? "bg-white text-black shadow-sm" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              {p === 'all' ? 'Все' : p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      ) : (
        <div className="space-y-3">
          {data?.chats && data.chats.length > 0 ? (
            data.chats.map((chat, idx) => (
              <div key={chat.chat_id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all gap-4 min-w-0 overflow-hidden">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-[14px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                    <span className="font-cortes-display text-xl text-[#3B82F6]">{idx + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-cortes-display text-lg leading-none tracking-tight text-white mb-1.5 truncate group-hover:text-[#3B82F6] transition-colors">
                      {chat.title || chat.username || chat.first_name || `Chat ${chat.chat_id}`}
                    </p>
                    <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/40 truncate">
                      ID: {chat.chat_id}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-row justify-between sm:flex-col sm:items-end gap-1 shrink-0">
                  <span className="font-cortes-mono text-[10px] text-white/60 tracking-[0.1em] mt-1 sm:mt-0">
                    {formatNumber(chat.calls_count)} CALLS • {formatNumber(chat.tokens_total)} TOK
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/30 py-8 border border-dashed border-white/10 rounded-[20px] bg-white/[0.01]">
              Нет данных активности
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
        <div className="flex-1 flex items-center justify-center w-full min-w-0">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      </DashboardLayout>
    );
  }

  const quickActions = [
    { icon: Activity, label: "Логи", href: "/dashboard/owner/logs", color: "text-[#3B82F6]" },
    { icon: Ban, label: "Глобал Баны", href: "/dashboard/owner/bans", color: "text-red-500" },
    { icon: Server, label: "Все узлы", href: "/dashboard/owner/chats", color: "text-emerald-400" },
    { icon: CreditCard, label: "Подписки", href: "/dashboard/owner/subscriptions", color: "text-[#8B5CF6]" },
    { icon: Send, label: "Рассылка", href: "/dashboard/owner/broadcast", color: "text-orange-400" },
    { icon: Zap, label: "Нейросеть", href: "/dashboard/owner/llm", color: "text-yellow-400" },
    { icon: Calendar, label: "Память RAG", href: "/dashboard/owner/memory", color: "text-cyan-400" },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-x-hidden overflow-y-auto w-full min-w-0 max-w-full pb-36 md:pb-10">
        <div className="space-y-6 w-full min-w-0 max-w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 shrink-0 min-w-0 w-full">
            <div className="min-w-0 flex-1">
              <h1 className="font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white flex items-center gap-4">
                <ShieldAlert className="w-10 h-10 text-red-500 shrink-0 hidden sm:block" />
                Root Панель.
              </h1>
              <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-3 truncate max-w-full">
                Абсолютный контроль над ядром
              </p>
            </div>
            <div className="flex flex-col items-end shrink-0 py-2 sm:py-0 w-full sm:w-auto">
              <div className="flex items-center gap-3 px-4 py-2 rounded-[16px] bg-white/[0.02] border border-white/5 shadow-inner">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                  <span className="relative w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-green-400">Online</span>
              </div>
              <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-white/30 mt-2 text-right w-full sm:w-auto">
                UPTIME: {formatUptime(stats?.uptime_seconds || 0)}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8 min-w-0 w-full">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-5 rounded-[20px] bg-[#09090b] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 h-full group"
                >
                  <action.icon className={`w-6 h-6 ${action.color} group-hover:scale-110 transition-transform`} />
                  <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/60 group-hover:text-white transition-colors">{action.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Main Massive Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 min-w-0 w-full">
            {/* Users */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 md:p-8 rounded-[32px] bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_70%)] bg-[#09090b] border border-blue-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between min-h-[180px] min-w-0"
            >
              <div className="flex items-center justify-between mb-4">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-blue-400/50">Пользователи</span>
              </div>
              <div>
                <p className="font-cortes-display text-[3.5rem] leading-[0.8] tracking-[-0.04em] text-white mb-3">
                  {formatNumber(stats?.total_users || 0)}
                </p>
                <div className="flex flex-col gap-1">
                  <span className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-blue-400/80">
                    +{stats?.active_users_24h || 0} за последние 24ч
                  </span>
                  <span className="font-cortes-mono text-[8px] uppercase tracking-[0.1em] text-white/30">
                    {stats?.active_users_7d || 0} активных за 7 дней
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Chats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="p-6 md:p-8 rounded-[32px] bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.1),transparent_70%)] bg-[#09090b] border border-emerald-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between min-h-[180px] min-w-0"
            >
              <div className="flex items-center justify-between mb-4">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
                <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-emerald-400/50">Сущности чатов</span>
              </div>
              <div>
                <p className="font-cortes-display text-[3.5rem] leading-[0.8] tracking-[-0.04em] text-white mb-3">
                  {formatNumber(stats?.total_chats || 0)}
                </p>
                <div className="flex flex-col gap-1">
                  <span className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-emerald-400/80">
                    {stats?.active_chats || 0} с активным ботом
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 md:p-8 rounded-[32px] bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.1),transparent_70%)] bg-[#09090b] border border-[#8B5CF6]/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between min-h-[180px] min-w-0"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
                <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-[#8B5CF6]/50">Трафик сообщений</span>
              </div>
              <div>
                <p className="font-cortes-display text-[3.5rem] leading-[0.8] tracking-[-0.04em] text-white mb-3">
                  {formatNumber(stats?.total_messages_24h || 0)}
                </p>
                <div className="flex flex-col gap-1">
                  <span className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-[#8B5CF6]/80">
                    Прочитано за 24 часа
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Bans */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="p-6 md:p-8 rounded-[32px] bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.15),transparent_70%)] bg-[#09090b] border border-red-500/30 shadow-[0_20px_40px_rgba(239,68,68,0.1)] relative overflow-hidden flex flex-col justify-between min-h-[180px] min-w-0"
            >
              <div className="flex items-center justify-between mb-4">
                <Ban className="w-6 h-6 text-red-500" />
                <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-red-500/50">Глобальные баны</span>
              </div>
              <div>
                <p className="font-cortes-display text-[3.5rem] leading-[0.8] tracking-[-0.04em] text-red-500 mb-3 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  {formatNumber(stats?.global_bans_count || 0)}
                </p>
                <Link href="/dashboard/owner/bans">
                  <span className="font-cortes-mono text-[9px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                    Управление реестром <ChevronRight size={10} />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Detailed Stats */}
          <div className="grid lg:grid-cols-2 gap-6 min-w-0 w-full">
            <LLMUsageWidget />
            <TopChatsWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
