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
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!chat) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">Чат не найден</p>
          <Link href="/dashboard/chats">
            <Button>Вернуться к чатам</Button>
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
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link href="/dashboard/chats">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden">
          <img 
            src={`${API_BASE}/chats/${chat.id}/avatar`}
            alt={chat.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold">{chat.name}</h1>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <p className="text-sm text-muted-foreground">{chat.members_count.toLocaleString()} участников</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/10">
            <Settings size={16} className="mr-2" />Telegram
          </Button>
          <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            <Trash2 size={16} className="mr-2" />Удалить бота
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 shrink-0">
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
      <div className={`flex-1 overflow-y-auto pr-2 ${scrollStyles}`}>
        {activeTab === "overview" && <OverviewTab chat={chat} onUpdate={handleUpdateChat} />}
        {activeTab === "bot" && <BotSettingsTab chatId={chatId!} />}
        {activeTab === "moderation" && <ModerationTab chatId={chatId!} />}
        {activeTab === "filters" && <FiltersTab chatId={chatId!} />}
        {activeTab === "members" && <MembersTab chatId={chatId!} />}
        {activeTab === "logs" && <LogsTab chatId={chatId!} />}
        {activeTab === "brain" && <BrainTab chatId={chatId!} />}
        {activeTab === "plan" && <PlanTab />}
      </div>
    </DashboardLayout>
  );
}
