import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus, Settings, MoreVertical, MessageCircle } from "lucide-react";
import { Link } from "wouter";

const mockChats = [
  { id: 1, name: "Dev Community", members: 1250, role: "Админ", active: true, unread: 5, messages: 12500, botEnabled: true },
  { id: 2, name: "Crypto Talk", members: 890, role: "Участник", active: true, unread: 0, messages: 8900, botEnabled: true },
  { id: 3, name: "Мемы и котики", members: 2100, role: "Модератор", active: false, unread: 12, messages: 45000, botEnabled: false },
  { id: 4, name: "Startup Hub", members: 560, role: "Админ", active: true, unread: 3, messages: 3200, botEnabled: true },
];

export default function Chats() {
  useSEO({
    title: "Чаты | Cortes AI",
    description: "Управление чатами с ботом Cortes",
    canonical: "/dashboard/chats",
  });

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
        <Button className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          Добавить чат
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск чатов..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Chats grid */}
      <div className="flex-1 grid md:grid-cols-2 gap-3 content-start overflow-auto">
        {mockChats.map((chat, idx) => (
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl">
                    💬
                  </div>
                  {chat.active && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{chat.name}</h3>
                  <p className="text-xs text-muted-foreground">{chat.members.toLocaleString()} участников</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {chat.messages.toLocaleString()} сообщений
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10">{chat.role}</span>
              {chat.unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px]">
                  +{chat.unread}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${chat.botEnabled ? "bg-green-400" : "bg-white/20"}`} />
                <span className="text-xs text-muted-foreground">
                  Бот {chat.botEnabled ? "активен" : "отключен"}
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
        ))}
      </div>
    </DashboardLayout>
  );
}
