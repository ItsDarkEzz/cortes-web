import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus, Settings, MoreVertical, MessageCircle, Loader2, Crown, Shield, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useChats } from "@/hooks/use-chats";

const API_BASE = import.meta.env.VITE_API_URL || '';

const roleLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  owner: { label: 'Владелец', icon: <Crown size={12} />, color: 'text-yellow-400' },
  admin: { label: 'Админ', icon: <Shield size={12} />, color: 'text-blue-400' },
  moderator: { label: 'Модератор', icon: <ShieldCheck size={12} />, color: 'text-green-400' },
};

export default function Chats() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: chatsData, isLoading } = useChats();

  useSEO({
    title: "Чаты | Cortes AI",
    description: "Управление чатами с ботом Cortes",
    canonical: "/dashboard/chats",
  });

  const chats = chatsData?.chats ?? [];
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Ваши чаты
          </h1>
          <p className="text-sm text-muted-foreground">Управляйте чатами где активен Cortes</p>
        </div>
        <a href="https://t.me/CortesAiBot" target="_blank" rel="noopener noreferrer">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Добавить чат
          </Button>
        </a>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск чатов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Chats grid */}
      <div className="flex-1 grid md:grid-cols-2 gap-3 content-start overflow-auto">
        {filteredChats.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "Чаты не найдены" : "Нет подключённых чатов"}
            </p>
            {!searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Добавьте бота @CortesAiBot в группу Telegram
              </p>
            )}
          </div>
        ) : (
          filteredChats.map((chat, idx) => {
          const roleInfo = chat.role ? roleLabels[chat.role] : null;
          return (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl overflow-hidden">
                    <img 
                      src={`${API_BASE}/chats/${chat.id}/avatar`}
                      alt={chat.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <span className="fallback-emoji hidden">💬</span>
                  </div>
                  {chat.bot_active && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{chat.name}</h3>
                  <p className="text-xs text-muted-foreground">{chat.members_count.toLocaleString()} участников</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {chat.messages_today} сообщ. сегодня
              </span>
              {roleInfo && (
                <span className={`flex items-center gap-1 ${roleInfo.color}`}>
                  {roleInfo.icon}
                  {roleInfo.label}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-white/10">{chat.plan}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${chat.bot_active ? "bg-green-400" : "bg-white/20"}`} />
                <span className="text-xs text-muted-foreground">
                  Бот {chat.bot_active ? "активен" : "отключен"}
                </span>
              </div>
              <Link href={`/dashboard/chats/${chat.id}`}>
                <Button variant="outline" size="sm" className="h-7 text-xs border-white/10">
                  <Settings size={12} className="mr-1" />
                  Настроить
                </Button>
              </Link>
            </div>
          </motion.div>
        )}))}
      </div>
    </DashboardLayout>
  );
}
