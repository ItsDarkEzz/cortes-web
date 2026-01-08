/**
 * Owner Chats - Управление чатами бота
 */

import { useState } from "react";
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

export default function OwnerChats() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [chatType, setChatType] = useState<'all' | 'private' | 'group'>('all');
  const [page, setPage] = useState(1);
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

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard/owner')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Server className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold">Чаты бота</h1>
            <span className="text-sm text-muted-foreground">
              ({chatsData?.total_chats || 0} всего, {chatsData?.active_chats || 0} активных)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Только активные</span>
            <Switch checked={activeOnly} onCheckedChange={setActiveOnly} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={chatType} onValueChange={(v) => { setChatType(v as 'all' | 'private' | 'group'); setPage(1); }}>
          <TabsList className="bg-white/5">
            <TabsTrigger value="all" className="gap-2">
              <Server className="w-4 h-4" />
              Все ({chatsData?.total_chats || 0})
            </TabsTrigger>
            <TabsTrigger value="private" className="gap-2">
              <User className="w-4 h-4" />
              Личные ({chatsData?.private_chats || 0})
            </TabsTrigger>
            <TabsTrigger value="group" className="gap-2">
              <UsersRound className="w-4 h-4" />
              Группы ({chatsData?.group_chats || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию чата..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : chatsData?.chats && chatsData.chats.length > 0 ? (
            chatsData.chats.map((chat, idx) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setLocation(`/dashboard/owner/chats/${chat.telegram_chat_id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={ownerApi.getChatAvatarUrl(chat.telegram_chat_id)} />
                        <AvatarFallback className={`${
                          chat.chat_type === 'private' 
                            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                            : 'bg-gradient-to-br from-green-500/20 to-teal-500/20'
                        }`}>
                          {chat.chat_type === 'private' ? (
                            <User className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <UsersRound className="w-5 h-5 text-muted-foreground" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        chat.is_active ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{chat.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          chat.chat_type === 'private' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {chat.chat_type === 'private' ? 'Личный' : chat.chat_type === 'supergroup' ? 'Супергруппа' : 'Группа'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {chat.username ? `@${chat.username} • ` : ''}ID: {chat.telegram_chat_id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {chat.members_count.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        {chat.messages_count.toLocaleString()}
                      </div>
                      {chat.messages_today > 0 && (
                        <div className="flex items-center gap-1 text-green-400">
                          <Activity className="w-4 h-4" />
                          +{chat.messages_today} сегодня
                        </div>
                      )}
                    </div>
                    
                    {/* Status & Dates */}
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1">
                        {chat.is_active ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={chat.is_active ? "text-green-400" : "text-gray-400"}>
                          {chat.is_active ? "Активен" : "Неактивен"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Activity className="w-3 h-3" />
                        {formatLastActivity(chat.last_activity)}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/dashboard/owner/chats/${chat.telegram_chat_id}`);
                        }}
                        className="text-muted-foreground hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeaveDialog({ 
                            open: true, 
                            chatId: chat.telegram_chat_id, 
                            title: chat.title 
                          });
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground pl-16">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Добавлен: {formatDate(chat.joined_at)}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Server className="w-12 h-12 mb-4 opacity-20" />
              <p>Нет чатов</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {chatsData && chatsData.pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Назад
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {chatsData.pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(chatsData.pagination.pages, p + 1))}
              disabled={page === chatsData.pagination.pages}
            >
              Вперёд
            </Button>
          </div>
        )}

        {/* Leave Dialog */}
        <Dialog open={leaveDialog.open} onOpenChange={(open) => setLeaveDialog({ ...leaveDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Покинуть чат</DialogTitle>
              <DialogDescription>
                Бот выйдет из чата "{leaveDialog.title}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Отправить сообщение перед выходом</span>
                <Switch checked={notifyOnLeave} onCheckedChange={setNotifyOnLeave} />
              </div>
              
              {notifyOnLeave && (
                <div>
                  <label className="text-sm font-medium">Сообщение (опционально)</label>
                  <Input
                    placeholder="Бот покидает этот чат. До свидания!"
                    value={leaveMessage}
                    onChange={(e) => setLeaveMessage(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeaveDialog({ open: false, chatId: 0, title: "" })}>
                Отмена
              </Button>
              <Button 
                onClick={handleLeaveChat} 
                disabled={leaveChat.isPending}
                className="bg-red-500 hover:bg-red-600"
              >
                {leaveChat.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Покинуть чат
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
