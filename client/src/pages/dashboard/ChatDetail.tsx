import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Settings, Users, Bot, Shield, BarChart3, 
  Trash2, Filter, History, Brain, CreditCard, Loader2
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { useChat, useUpdateChat } from "@/hooks/use-chats";
import type { ChatDetails } from "@/lib/api/types";
import { 
  TabBtn, scrollStyles,
  OverviewTab, BotSettingsTab, ModerationTab, FiltersTab, 
  MembersTab, LogsTab, BrainTab, PlanTab 
} from "./chat-detail";

const API_BASE = import.meta.env.VITE_API_URL || '';

type TabType = "overview" | "bot" | "moderation" | "filters" | "members" | "logs" | "brain" | "plan";

export default function ChatDetail() {
  const params = useParams<{ id: string }>();
  const chatId = params.id;
  
  const { data: chat, isLoading } = useChat(chatId);
  const updateChat = useUpdateChat(chatId || "");
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useSEO({ 
    title: `${chat?.name || "Чат"} | Cortes AI`, 
    description: `Настройки чата ${chat?.name || ""}`, 
    canonical: `/dashboard/chats/${chatId}` 
  });

  const handleUpdateChat = async (data: Partial<ChatDetails>) => {
    await updateChat.mutateAsync({ name: data.name, description: data.description, rules: data.rules });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!chat) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center border border-dashed border-white/10 rounded-[40px] bg-[#09090b]/30">
          <p className="font-cortes-display text-2xl text-white mb-4">Узел не найден</p>
          <Link href="/dashboard/chats">
            <span className="inline-flex h-12 w-full max-w-[200px] items-center justify-center rounded-full border border-white/20 px-6 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10">К списку узлов</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Обзор", icon: BarChart3 },
    { key: "bot", label: "Бот", icon: Bot },
    { key: "moderation", label: "Модерация", icon: Shield },
    { key: "filters", label: "Фильтры", icon: Filter },
    { key: "members", label: "Участники", icon: Users },
    { key: "logs", label: "Журнал", icon: History },
    { key: "brain", label: "Мозг", icon: Brain },
    { key: "plan", label: "Тариф", icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8 shrink-0 relative bg-[#09090b]/40 border border-white/10 p-6 md:p-8 rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] w-full min-w-0 max-w-full">
        {/* Subtle glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 w-full min-w-0">
          <div className="flex items-start gap-4 lg:gap-6 min-w-0 w-full">
            <Link href="/dashboard/chats">
              <span className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer shrink-0 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              <img 
                src={`${API_BASE}/chats/${chat.id}/avatar`}
                alt={chat.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 mb-2 min-w-0">
                <h1 className="font-cortes-display text-2xl lg:text-4xl text-white truncate tracking-[-0.02em]">{chat.name}</h1>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-lg ${chat.bot_active ? 'bg-[#3B82F6]' : 'bg-white/20'}`} />
              </div>
              <p className="font-cortes-mono text-[10px] lg:text-xs uppercase tracking-[0.2em] text-white/40 truncate w-full">
                {chat.members_count.toLocaleString()} Users • ID {chat.id}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 shrink-0">
            <Button variant="outline" className="h-10 rounded-xl border-white/10 font-cortes-mono text-[10px] uppercase tracking-[0.1em] text-white hover:bg-white/10">
              <Settings size={14} className="mr-2 shrink-0" />Telegram
            </Button>
            <Button variant="outline" className="h-10 rounded-xl border-red-500/30 font-cortes-mono text-[10px] uppercase tracking-[0.1em] text-red-400 hover:bg-red-500/10 transition-colors">
              <Trash2 size={14} className="mr-2 shrink-0" />Удалить
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto px-1 pb-2 shrink-0 border-b border-white/10 hide-scrollbar w-full min-w-0 max-w-full">
        {tabs.map((tab) => (
          <TabBtn 
            key={tab.key} 
            active={activeTab === tab.key} 
            onClick={() => setActiveTab(tab.key)} 
            icon={tab.icon} 
            label={tab.label} 
          />
        ))}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${scrollStyles} w-full min-w-0 max-w-full`}>
        <div className="pb-36 md:pb-10 w-full min-w-0">
          {activeTab === "overview" && <OverviewTab chat={chat} onUpdate={handleUpdateChat} />}
          {activeTab === "bot" && <BotSettingsTab chatId={chatId!} />}
          {activeTab === "moderation" && <ModerationTab chatId={chatId!} />}
          {activeTab === "filters" && <FiltersTab chatId={chatId!} />}
          {activeTab === "members" && <MembersTab chatId={chatId!} />}
          {activeTab === "logs" && <LogsTab chatId={chatId!} />}
          {activeTab === "brain" && <BrainTab chatId={chatId!} />}
          {activeTab === "plan" && <PlanTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
