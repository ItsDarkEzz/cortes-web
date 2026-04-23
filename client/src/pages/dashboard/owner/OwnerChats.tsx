/**
 * Owner Chats - Управление чатами бота
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Server, Search, LogOut, Users, MessageCircle, 
  Calendar, Activity, CheckCircle, XCircle, User, UsersRound, ArrowLeft, ExternalLink
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBotChats, useLeaveChat } from "@/hooks/use-owner";
import { ownerApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const scrollStyles = "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20";

export default function OwnerChats() {
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasRestoredScroll = useRef(false);

  const [search, setSearch] = useState(() => sessionStorage.getItem("ownerChatsSearch") || "");
  const [activeOnly, setActiveOnly] = useState(() => sessionStorage.getItem("ownerChatsActiveOnly") === "true");
  const [chatType, setChatType] = useState<'all' | 'private' | 'group'>(
    () => (sessionStorage.getItem("ownerChatsType") as any) || 'all'
  );
  const [page, setPage] = useState(() => {
    const p = sessionStorage.getItem("ownerChatsPage");
    return p ? parseInt(p, 10) : 1;
  });

  useEffect(() => {
    sessionStorage.setItem("ownerChatsSearch", search);
    sessionStorage.setItem("ownerChatsActiveOnly", activeOnly.toString());
    sessionStorage.setItem("ownerChatsType", chatType);
    sessionStorage.setItem("ownerChatsPage", page.toString());
  }, [search, activeOnly, chatType, page]);

  const [leaveDialog, setLeaveDialog] = useState<{ open: boolean; chatId: number; title: string }>({
    open: false,
    chatId: 0,
    title: "",
  });
  const [leaveMessage, setLeaveMessage] = useState("");
  const [notifyOnLeave, setNotifyOnLeave] = useState(true);

  const { data: chatsData, isLoading } = useBotChats({ 
    page, 
    search, 
    active_only: activeOnly,
    chat_type: chatType,
  });
  const leaveChat = useLeaveChat();
  const { toast } = useToast();

  useEffect(() => {
    if (chatsData?.chats && scrollRef.current && !hasRestoredScroll.current) {
      const savedScroll = sessionStorage.getItem("ownerChatsScroll");
      if (savedScroll) {
        scrollRef.current.scrollTop = parseInt(savedScroll, 10);
      }
      hasRestoredScroll.current = true;
    }
  }, [chatsData?.chats]);

  const handleNavigate = (url: string) => {
    if (scrollRef.current) {
      sessionStorage.setItem("ownerChatsScroll", scrollRef.current.scrollTop.toString());
    }
    setLocation(url);
  };

  const handleLeaveChat = async () => {
    try {
      await leaveChat.mutateAsync({
        chatId: leaveDialog.chatId,
        notify: notifyOnLeave,
        message: leaveMessage || undefined,
      });
      toast({ title: "Успешно", description: "Бот покинул чат" });
      setLeaveDialog({ open: false, chatId: 0, title: "" });
      setLeaveMessage("");
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось покинуть чат", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatLastActivity = (dateStr?: string) => {
    if (!dateStr) return "Нет активности";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}д назад`;
    if (hours > 0) return `${hours}ч назад`;
    return "Недавно";
  };
  const formatNumber = (num: number) => num.toLocaleString('ru-RU');


  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-6 w-full min-w-0 max-w-full overflow-x-hidden pb-36 md:pb-10 pt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shrink-0 w-full min-w-0">
          <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
            <Button variant="outline" size="icon" onClick={() => setLocation('/dashboard/owner')} className="w-12 h-12 rounded-[16px] border-white/10 hover:bg-white/5 shrink-0 hidden sm:flex">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-cortes-display text-[clamp(2rem,3vw,2.5rem)] leading-none tracking-[-0.03em] flex items-center gap-3 text-white truncate w-full">
                <Server className="w-8 h-8 text-[#3B82F6] shrink-0" />
                Реестр узлов
              </h1>
              <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2 truncate w-full">
                Всего ({chatsData?.total_chats || 0}) • Активны ({chatsData?.active_chats || 0})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-[16px] shrink-0 w-full sm:w-auto overflow-hidden">
            <span className="font-cortes-mono text-[10px] uppercase tracking-[0.1em] text-white/60 truncate">Только активные</span>
            <Switch 
              checked={activeOnly} 
              onCheckedChange={(checked) => {
                setActiveOnly(checked);
                setPage(1);
              }} 
              className="data-[state=checked]:bg-[#3B82F6]" 
            />
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 shrink-0 w-full min-w-0">
          <div className="flex bg-[#09090b] border border-white/10 p-1 rounded-[16px] w-full lg:w-fit shrink-0 overflow-x-auto scrollbar-none">
            {([
              { value: 'all', icon: Server, label: `Все (${chatsData?.total_chats || 0})` },
              { value: 'private', icon: User, label: `Личные (${chatsData?.private_chats || 0})` },
              { value: 'group', icon: UsersRound, label: `Группы (${chatsData?.group_chats || 0})` }
            ] as const).map(tab => (
              <button
                key={tab.value}
                onClick={() => { setChatType(tab.value); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] font-cortes-mono text-[10px] uppercase tracking-[0.1em] transition-all shrink-0 ${
                  chatType === tab.value 
                    ? "bg-white text-black shadow-sm" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="ФИЛЬТР ПО НАЗВАНИЮ ИЛИ ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-11 h-[46px] rounded-[16px] bg-[#09090b] border-white/10 font-cortes-mono text-[10px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 focus:border-[#3B82F6]/50 shadow-inner w-full min-w-0"
            />
          </div>
        </div>

        {/* Chats List */}
        <div 
          ref={scrollRef}
          className={`flex-1 overflow-x-hidden overflow-y-auto space-y-3 pr-1 w-full min-w-0 max-w-full ${scrollStyles}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20 w-full min-w-0">
              <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
            </div>
          ) : chatsData?.chats && chatsData.chats.length > 0 ? (
            chatsData.chats.map((chat, idx) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group p-4 md:p-5 rounded-[24px] bg-[#09090b] border border-white/5 hover:border-white/10 shadow-sm transition-all cursor-pointer flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full min-w-0 overflow-hidden"
                onClick={() => handleNavigate(`/dashboard/owner/chats/${chat.telegram_chat_id}`)}
              >
                <div className="flex items-center gap-4 min-w-0 w-full xl:w-auto">
                  <div className="relative shrink-0">
                    <Avatar className="w-14 h-14 rounded-[16px] border border-white/10 shadow-inner">
                      <AvatarImage src={ownerApi.getChatAvatarUrl(chat.telegram_chat_id)} />
                      <AvatarFallback className={`rounded-[16px] ${
                        chat.chat_type === 'private' 
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6]' 
                          : 'bg-[#10B981]/10 text-[#10B981]'
                      }`}>
                        {chat.chat_type === 'private' ? (
                          <User className="w-6 h-6" />
                        ) : (
                          <UsersRound className="w-6 h-6" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] border-[#09090b] ${
                      chat.is_active ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1 w-full min-w-0">
                      <h3 className="font-cortes-display text-xl leading-none text-white tracking-tight truncate max-w-[200px] md:max-w-[400px]">
                        {chat.title}
                      </h3>
                      <span className={`font-cortes-mono text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border shrink-0 ${
                        chat.chat_type === 'private' 
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' 
                          : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                      }`}>
                        {chat.chat_type === 'private' ? 'Личный' : chat.chat_type === 'supergroup' ? 'Супергруппа' : 'Группа'}
                      </span>
                    </div>
                    <p className="font-cortes-mono text-[10px] text-white/40 tracking-[0.1em] truncate w-full">
                      {chat.username ? `@${chat.username} • ` : ''}ID: {chat.telegram_chat_id}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between xl:justify-end gap-6 w-full xl:w-auto shrink-0 mt-2 xl:mt-0 pt-4 xl:pt-0 border-t border-white/5 xl:border-0 pl-18 xl:pl-0">
                  {/* Stats */}
                  <div className="flex items-center gap-5 text-sm shrink-0">
                    <div className="flex flex-col items-start xl:items-end">
                      <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Users</span>
                      <div className="flex items-center gap-1.5 font-cortes-display text-lg tracking-tight text-white leading-none">
                        <Users className="w-3.5 h-3.5 text-white/20" />
                        {formatNumber(chat.members_count)}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-white/5" />
                    <div className="flex flex-col items-start xl:items-end">
                      <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Messages</span>
                      <div className="flex items-center gap-1.5 font-cortes-display text-lg tracking-tight text-white leading-none">
                        <MessageCircle className="w-3.5 h-3.5 text-white/20" />
                        {formatNumber(chat.messages_count)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status & Dates */}
                  <div className="hidden md:flex flex-col items-end w-32 shrink-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {chat.is_active ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-gray-500" />
                      )}
                      <span className={`font-cortes-mono text-[9px] uppercase tracking-[0.1em] ${chat.is_active ? "text-green-400" : "text-gray-500"}`}>
                        {chat.is_active ? "Ядро онлайн" : "Офлайн"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/40">
                      <Activity className="w-3 h-3" />
                      {formatLastActivity(chat.last_activity)}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 ml-auto xl:ml-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(`/dashboard/owner/chats/${chat.telegram_chat_id}`);
                      }}
                      className="w-10 h-10 rounded-[12px] bg-white/[0.02] border-white/10 hover:bg-white/10 hover:text-white text-white/60 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLeaveDialog({ 
                          open: true, 
                          chatId: chat.telegram_chat_id, 
                          title: chat.title 
                        });
                      }}
                      className="w-10 h-10 rounded-[12px] bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-[24px] bg-white/[0.01] w-full min-w-0">
              <Server className="w-16 h-16 mb-4 text-[#3B82F6]/20" />
              <p className="font-cortes-display text-2xl text-white mb-2">Пустой реестр</p>
              <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Узлы связи не найдены</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {chatsData && chatsData.pagination.pages > 1 && (
          <div className="flex items-center justify-center w-full min-w-0 gap-3 pt-4 border-t border-white/5 shrink-0">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 rounded-[12px] border-white/10 font-cortes-mono text-[10px] uppercase tracking-[0.1em] px-6"
            >
              Пред.
            </Button>
            <div className="flex items-center justify-center min-w-[100px] h-10 rounded-[12px] bg-[#09090b] border border-white/10 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white">
              {page} ИЗ {chatsData.pagination.pages}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(chatsData.pagination.pages, p + 1))}
              disabled={page === chatsData.pagination.pages}
              className="h-10 rounded-[12px] border-white/10 font-cortes-mono text-[10px] uppercase tracking-[0.1em] px-6"
            >
              След.
            </Button>
          </div>
        )}

        {/* Leave Dialog */}
        <Dialog open={leaveDialog.open} onOpenChange={(open) => setLeaveDialog({ ...leaveDialog, open })}>
          <DialogContent className="bg-[#09090b] border-red-500/20 shadow-[0_20px_40px_rgba(239,68,68,0.1)] rounded-[24px] sm:max-w-[400px]">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-cortes-display text-2xl text-red-500 w-full truncate border-b border-white/10 pb-4">Покинуть узел</DialogTitle>
              <DialogDescription className="font-cortes-mono text-[11px] leading-relaxed text-white/60 pt-4">
                Вы собираетесь отозвать бота из чата <span className="text-white">"{leaveDialog.title}"</span>. Это действие мгновенно прекратит работу ядра в данном чате.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-[16px] border border-white/5">
                <span className="font-cortes-mono text-[10px] uppercase tracking-[0.1em] text-white">Уведомить чат</span>
                <Switch checked={notifyOnLeave} onCheckedChange={setNotifyOnLeave} className="data-[state=checked]:bg-red-500" />
              </div>
              
              {notifyOnLeave && (
                <div>
                  <label className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block pl-2">Трансляция (Опционально)</label>
                  <Input
                    placeholder="Ядро отключается по инициативе администратора..."
                    value={leaveMessage}
                    onChange={(e) => setLeaveMessage(e.target.value)}
                    className="h-12 bg-[#000000] border-white/10 font-cortes-mono text-[10px] text-white placeholder:text-white/20 rounded-[16px] shadow-inner focus:border-red-500/50"
                  />
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6 border-t border-white/10 pt-6">
              <Button variant="outline" onClick={() => setLeaveDialog({ open: false, chatId: 0, title: "" })} className="w-full sm:w-auto h-12 rounded-[16px] font-cortes-mono text-[10px] uppercase tracking-[0.1em] border-white/10 hover:bg-white/5 mb-3 sm:mb-0">
                Отмена
              </Button>
              <Button 
                onClick={handleLeaveChat} 
                disabled={leaveChat.isPending}
                className="w-full sm:w-auto h-12 rounded-[16px] font-cortes-mono text-[10px] uppercase tracking-[0.1em] bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
              >
                {leaveChat.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                Отозвать
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
