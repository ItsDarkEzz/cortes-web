/**
 * Owner Chat Details - Детальная информация о чате
 * Использует те же компоненты вкладок что и обычный ChatDetail + расширенная статистика для владельца
 */

import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { 
  ArrowLeft, Settings, Users, Bot, Shield, BarChart3, 
  Filter, History, Brain, CreditCard, Loader2, PowerOff, User, UsersRound,
  Activity, Calendar, Crown, MessageCircle, Cpu, DollarSign, Eye, Layers
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatDetails, useLeaveChat, useChatContextDebug } from "@/hooks/use-owner";
import { ownerApi, type ContextDebugResponse, type ContextClusterInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  TabBtn, scrollStyles,
  BotSettingsTab, ModerationTab, FiltersTab, 
  MembersTab, LogsTab, BrainTab, PlanTab 
} from "../chat-detail";

type TabType = "overview" | "context" | "bot" | "moderation" | "filters" | "members" | "logs" | "brain" | "plan";

export default function OwnerChatDetails() {
  const [, params] = useRoute("/dashboard/owner/chats/:chatId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const telegramChatId = params?.chatId || "";
  
  const { data: chatData, isLoading } = useChatDetails(Number(telegramChatId));
  const leaveChat = useLeaveChat();
  
  const [leaveDialog, setLeaveDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!chatData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Users className="w-16 h-16 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">Чат не найден</p>
          <Button onClick={() => setLocation('/dashboard/owner/chats')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к списку
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { chat, stats, settings, subscription } = chatData;

  const handleLeaveChat = async () => {
    try {
      await leaveChat.mutateAsync({ chatId: Number(telegramChatId), notify: true });
      toast({ title: "Успешно", description: "Бот покинул чат" });
      setLocation('/dashboard/owner/chats');
    } catch {
      toast({ title: "Ошибка", description: "Не удалось покинуть чат", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => num.toLocaleString('ru-RU');

  const isPrivateChat = chat.chat_type === 'private';

  // Для личных чатов показываем Обзор и Журнал (сообщения)
  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = isPrivateChat
    ? [
        { key: "overview", label: "Обзор", icon: BarChart3 },
        { key: "context", label: "Контекст", icon: Layers },
        { key: "logs", label: "Сообщения", icon: History },
      ]
    : [
        { key: "overview", label: "Обзор", icon: BarChart3 },
        { key: "context", label: "Контекст", icon: Layers },
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
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 shrink-0">
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setLocation('/dashboard/owner/chats')}>
            <ArrowLeft size={20} />
          </Button>
          
          <Avatar className="w-12 h-12">
            <AvatarImage src={ownerApi.getChatAvatarUrl(Number(telegramChatId))} />
            <AvatarFallback className={chat.chat_type === 'private' ? 'bg-blue-500/20' : 'bg-green-500/20'}>
              {chat.chat_type === 'private' ? <User className="w-5 h-5" /> : <UsersRound className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-bold">{chat.title}</h1>
              {settings.is_enabled ? (
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              ) : (
                <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Отключён</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {chat.members_count.toLocaleString()} участников
              {chat.username && ` • @${chat.username}`}
              {` • ID: ${chat.telegram_chat_id}`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white/10">
              <Settings size={16} className="mr-2" />Telegram
            </Button>
            <Button 
              variant="outline" 
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => setLeaveDialog(true)}
            >
              <PowerOff size={16} className="mr-2" />Покинуть чат
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
          {activeTab === "overview" && (
            <OwnerOverviewTab 
              chat={chat} 
              stats={stats} 
              settings={settings} 
              subscription={subscription}
              formatDate={formatDate}
              formatNumber={formatNumber}
              isPrivateChat={isPrivateChat}
            />
          )}
          {activeTab === "context" && <ContextDebugTab chatId={Number(telegramChatId)} />}
          {activeTab === "bot" && !isPrivateChat && <BotSettingsTab chatId={String(chat.telegram_chat_id)} />}
          {activeTab === "moderation" && !isPrivateChat && <ModerationTab chatId={String(chat.telegram_chat_id)} />}
          {activeTab === "filters" && !isPrivateChat && <FiltersTab chatId={String(chat.telegram_chat_id)} />}
          {activeTab === "members" && !isPrivateChat && <MembersTab chatId={String(chat.telegram_chat_id)} />}
          {activeTab === "logs" && <LogsTab chatId={String(chat.telegram_chat_id)} messagesOnly={isPrivateChat} />}
          {activeTab === "brain" && <BrainTab chatId={String(chat.telegram_chat_id)} />}
          {activeTab === "plan" && !isPrivateChat && <PlanTab />}
        </div>

        {/* Leave Dialog */}
        <Dialog open={leaveDialog} onOpenChange={setLeaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Покинуть чат</DialogTitle>
              <DialogDescription>
                Бот выйдет из чата "{chat.title}". Это действие нельзя отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeaveDialog(false)}>Отмена</Button>
              <Button 
                variant="destructive" 
                onClick={handleLeaveChat}
                disabled={leaveChat.isPending}
              >
                {leaveChat.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Покинуть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// ============== Owner Overview Tab с расширенной статистикой ==============

interface OwnerOverviewTabProps {
  chat: any;
  stats: any;
  settings: any;
  subscription?: any;
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  isPrivateChat: boolean;
}

function OwnerOverviewTab({ chat, stats, settings, subscription, formatDate, formatNumber, isPrivateChat }: OwnerOverviewTabProps) {
  return (
    <div className="space-y-4">
      {/* Основная статистика */}
      <div className={`grid gap-4 ${isPrivateChat ? 'grid-cols-2 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Всего сообщений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.messages_total)}</div>
            <p className="text-xs text-muted-foreground">+{formatNumber(stats.messages_24h)} за 24ч</p>
          </CardContent>
        </Card>
        
        {!isPrivateChat && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Участников
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(chat.members_count)}</div>
              <p className="text-xs text-muted-foreground">{stats.unique_users_24h} активных за 24ч</p>
            </CardContent>
          </Card>
        )}
        
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              LLM вызовов (Core)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.llm_calls_total)}</div>
            <p className="text-xs text-muted-foreground">+{stats.llm_calls_24h} за 24ч</p>
          </CardContent>
        </Card>
        
        {!isPrivateChat && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Observer вызовов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.observer_calls_total)}</div>
              <p className="text-xs text-muted-foreground">{stats.observer_activations} активаций</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* LLM статистика */}
      <div className={`grid gap-4 ${isPrivateChat ? 'grid-cols-2 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Токенов использовано</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.llm_tokens_total)}</div>
            <p className="text-xs text-muted-foreground">~{stats.avg_messages_per_day} сообщ/день</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Стоимость LLM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${stats.llm_cost_total?.toFixed(4) || '0.0000'}</div>
            <p className="text-xs text-muted-foreground">всего потрачено</p>
          </CardContent>
        </Card>
        
        {!isPrivateChat && (
          <>
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Конверсия Observer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.observer_calls_total > 0 
                    ? `${((stats.observer_activations / stats.observer_calls_total) * 100).toFixed(1)}%`
                    : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">активаций / вызовов</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Уникальных за 7д</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.unique_users_7d)}</div>
                <p className="text-xs text-muted-foreground">пользователей</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Активность */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Активность
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">За 24 часа</span>
              <span>{formatNumber(stats.messages_24h)} сообщений</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">За 7 дней</span>
              <span>{formatNumber(stats.messages_7d)} сообщений</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">За 30 дней</span>
              <span>{formatNumber(stats.messages_30d)} сообщений</span>
            </div>
            {!isPrivateChat && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Уникальных за 7д</span>
                <span>{stats.unique_users_7d} пользователей</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Подписка */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Подписка
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">План</span>
                  <span className="font-medium">{subscription.plan_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус</span>
                  <span className={subscription.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                    {subscription.status === 'active' ? 'Активна' : 'Неактивна'}
                  </span>
                </div>
                {subscription.expires_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Истекает</span>
                    <span>{formatDate(subscription.expires_at)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Нет активной подписки</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Информация о чате */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Информация
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-muted-foreground text-sm">Telegram ID</span>
            <p className="font-mono">{chat.telegram_chat_id}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Тип чата</span>
            <p>{chat.chat_type === 'private' ? 'Личный' : chat.chat_type === 'supergroup' ? 'Супергруппа' : 'Группа'}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Добавлен</span>
            <p>{formatDate(chat.joined_at)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Последняя активность</span>
            <p>{chat.last_activity ? formatDate(chat.last_activity) : 'Нет данных'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Текущие настройки - только для групп */}
      {!isPrivateChat && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Текущие настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings.is_enabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">{settings.is_enabled ? 'Бот включён' : 'Бот отключён'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Режим:</span>
              <span className="text-sm">
                {settings.bot_mode === 'passive' ? '😴 Пассивный' : 
                 settings.bot_mode === 'aggressive' ? '🔥 Активный' : '😊 Нормальный'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Язык:</span>
              <span className="text-sm">{settings.language === 'ru' ? '🇷🇺 Русский' : '🇺🇸 English'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings.nsfw_filter ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className="text-sm">NSFW фильтр</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings.auto_moderation ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className="text-sm">Автомодерация</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============== Context Debug Tab ==============

interface ContextDebugTabProps {
  chatId: number;
}

function ContextDebugTab({ chatId }: ContextDebugTabProps) {
  const { data: contextData, isLoading, error } = useChatContextDebug(chatId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contextData) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="py-6">
          <p className="text-red-400">Ошибка загрузки контекста</p>
        </CardContent>
      </Card>
    );
  }

  const qualityColor = {
    full: 'text-green-400',
    partial: 'text-yellow-400',
    minimal: 'text-red-400',
  }[contextData.dynamic_context_quality || 'minimal'] || 'text-gray-400';

  return (
    <div className="space-y-4">
      {/* Общая информация */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Всего сообщений</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contextData.total_messages}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Кластеризация</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-bold ${contextData.clustering_applied ? 'text-green-400' : 'text-gray-400'}`}>
              {contextData.clustering_applied ? 'Активна' : 'Отключена'}
            </div>
            <p className="text-xs text-muted-foreground truncate">{contextData.clustering_reason}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Кластеров</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contextData.all_clusters.length}</div>
            <p className="text-xs text-muted-foreground">+{contextData.unclustered_count} без кластера</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardDescription>Качество контекста</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-bold ${qualityColor}`}>
              {contextData.dynamic_context_quality === 'full' ? '🟢 Полный' :
               contextData.dynamic_context_quality === 'partial' ? '🟡 Частичный' : '🔴 Минимальный'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rolling Summary */}
      {contextData.rolling_summary && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Rolling Summary (активная нить разговора)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contextData.rolling_summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Кластеры */}
      {contextData.all_clusters.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Кластеры тем ({contextData.all_clusters.length})
            </CardTitle>
            <CardDescription>
              Сообщения группируются по темам. Активный кластер используется для контекста.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contextData.all_clusters.map((cluster) => (
              <ClusterCard key={cluster.cluster_id} cluster={cluster} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Текущий контекст */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Текущий контекст (последние сообщения)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-black/20 p-3 rounded-lg max-h-96 overflow-y-auto">
            {contextData.recent_context || '[Нет контекста]'}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

// Компонент для отображения кластера
function ClusterCard({ cluster }: { cluster: ContextClusterInfo }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className={`border rounded-lg p-3 ${
        cluster.is_active 
          ? 'border-green-500/50 bg-green-500/10' 
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${cluster.is_active ? 'bg-green-500' : 'bg-gray-500'}`} />
          <div>
            <span className="font-medium">
              Кластер #{cluster.cluster_id}
              {cluster.is_dominant && <span className="ml-2 text-xs text-yellow-400">👑 Доминирующий</span>}
              {cluster.is_active && <span className="ml-2 text-xs text-green-400">✓ Активный</span>}
            </span>
            <p className="text-xs text-muted-foreground">
              {cluster.size} сообщений • Уверенность: {(cluster.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          {expanded ? '▲' : '▼'}
        </Button>
      </div>
      
      {expanded && (
        <div className="mt-3 space-y-2 pl-6">
          {cluster.messages.map((msg, idx: number) => (
            <div key={idx} className="text-xs border-l-2 border-white/20 pl-2">
              <span className={msg.role === 'assistant' ? 'text-blue-400' : 'text-gray-400'}>
                {msg.user}:
              </span>
              <span className="text-muted-foreground ml-1">
                {msg.content.length > 100 ? msg.content.slice(0, 100) + '...' : msg.content}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
