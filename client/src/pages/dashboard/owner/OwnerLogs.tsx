/**
 * Owner Logs - Логи в реальном времени
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Activity, Search, Wifi, WifiOff, 
  AlertCircle, Info, AlertTriangle, XCircle, Bug, ArrowLeft
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOwnerLogs } from "@/hooks/use-owner";
import { logsWebSocket, type OwnerLogEntry } from "@/lib/api";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

const levelConfig: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  DEBUG: { icon: Bug, color: "text-gray-400", bg: "bg-gray-500/10" },
  INFO: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
  WARNING: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ERROR: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  CRITICAL: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/20" },
};

const sourceConfig: Record<string, string> = {
  bot: "🤖 Bot",
  observer: "👁 Observer",
  core: "🧠 Core",
  api: "🌐 API",
  scheduler: "⏰ Scheduler",
  moderation: "🛡 Moderation",
  memory: "💾 Memory",
};

export default function OwnerLogs() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [wsConnected, setWsConnected] = useState(false);
  const [realtimeLogs, setRealtimeLogs] = useState<OwnerLogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const { data: logsData, isLoading } = useOwnerLogs({
    limit: 100,
    level: level !== "all" ? level : undefined,
    source: source !== "all" ? source : undefined,
    search: search || undefined,
  });

  // WebSocket подключение
  useEffect(() => {
    const token = apiClient.getAccessToken();
    if (token) {
      logsWebSocket.setOnMessage((log) => {
        setRealtimeLogs((prev) => [log, ...prev].slice(0, 200));
      });
      logsWebSocket.setOnStatusChange(setWsConnected);
      logsWebSocket.connect(token);
    }

    return () => {
      logsWebSocket.disconnect();
    };
  }, []);

  // Автоскролл
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [realtimeLogs, autoScroll]);

  // Объединяем логи из API и WebSocket
  const allLogs = [...realtimeLogs, ...(logsData?.logs || [])];
  
  // Фильтруем дубликаты по id
  const uniqueLogs = allLogs.filter((log, index, self) => 
    index === self.findIndex((l) => l.id === log.id)
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard/owner')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Логи в реальном времени</h1>
            {wsConnected ? (
              <span className="flex items-center gap-1 text-sm text-green-400">
                <Wifi className="w-4 h-4" />
                Подключено
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-red-400">
                <WifiOff className="w-4 h-4" />
                Отключено
              </span>
            )}
          </div>
          <Button
            variant={autoScroll ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
          >
            {autoScroll ? "Автоскролл вкл" : "Автоскролл выкл"}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в логах..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
              <SelectValue placeholder="Уровень" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все уровни</SelectItem>
              <SelectItem value="DEBUG">Debug</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
              <SelectValue placeholder="Источник" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все источники</SelectItem>
              <SelectItem value="bot">Bot</SelectItem>
              <SelectItem value="observer">Observer</SelectItem>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="scheduler">Scheduler</SelectItem>
              <SelectItem value="moderation">Moderation</SelectItem>
              <SelectItem value="memory">Memory</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-auto rounded-xl bg-black/20 border border-white/10 p-2 font-mono text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : uniqueLogs.length > 0 ? (
            <div className="space-y-1">
              {uniqueLogs.map((log, idx) => {
                const config = levelConfig[log.level] || levelConfig.INFO;
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={log.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-2 p-2 rounded ${config.bg} hover:bg-white/5 transition-colors`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                    <span className="text-muted-foreground shrink-0 w-20">
                      {formatTime(log.timestamp)}
                    </span>
                    <span className="shrink-0 w-24 text-xs">
                      {sourceConfig[log.source] || log.source}
                    </span>
                    <span className="flex-1 break-all">{log.message}</span>
                    {log.chat_id && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        chat:{log.chat_id}
                      </span>
                    )}
                    {log.user_id && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        user:{log.user_id}
                      </span>
                    )}
                  </motion.div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Нет логов для отображения
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
