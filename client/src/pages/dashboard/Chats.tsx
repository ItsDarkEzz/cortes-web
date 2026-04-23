import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Users, Search, Plus, Settings, MessageCircle, Loader2, Crown, Shield, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useChats } from "@/hooks/use-chats";

const API_BASE = import.meta.env.VITE_API_URL || '';

const roleLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  owner: { label: 'Владелец', icon: <Crown size={12} />, color: 'text-yellow-400' },
  admin: { label: 'Админ', icon: <Shield size={12} />, color: 'text-[#3B82F6]' },
  moderator: { label: 'Модер', icon: <ShieldCheck size={12} />, color: 'text-[#8B5CF6]' },
};

export default function Chats() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: chatsData, isLoading } = useChats();

  useSEO({
    title: "Узлы | Cortes AI",
    description: "Управление подключенными чатами",
    canonical: "/dashboard/chats",
  });

  const chats = chatsData?.chats ?? [];
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header & Search Area */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
              Точки входа.
            </h1>
            <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-3">
              Управление активными нейронными узлами
            </p>
          </div>
          <a href="https://t.me/CortesAiBot" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto shrink-0">
            <span className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-8 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Plus size={14} className="mr-2" />
              Добавить узел
            </span>
          </a>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#3B82F6] transition-colors" />
          <input
            type="text"
            placeholder="ФИЛЬТР ПО НАЗВАНИЮ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 rounded-[24px] bg-[#09090b]/80 border border-white/10 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white placeholder:text-white/20 focus:outline-none focus:border-[#3B82F6]/50 focus:bg-black transition-all shadow-inner backdrop-blur-md"
          />
        </div>
      </div>

      {/* Chats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 content-start pb-36 md:pb-10 overflow-x-hidden overflow-y-auto w-full min-w-0 max-w-full">
        {filteredChats.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center rounded-[40px] border border-dashed border-white/10 bg-[#09090b]/30">
            <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-6">
               <span className="font-cortes-display text-4xl text-white/20">0</span>
            </div>
            <h3 className="font-cortes-display text-2xl text-white mb-2 tracking-[-0.02em]">
              {searchQuery ? "Совпадений нет" : "Сеть пуста"}
            </h3>
            <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 max-w-sm">
              {searchQuery ? "Попробуйте изменить запрос" : "Добавьте бота @CortesAiBot в группу, чтобы создать новый узел"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat, idx) => {
            const roleInfo = chat.role ? roleLabels[chat.role] : null;
            return (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/dashboard/chats/${chat.id}`}>
                  <div className="group relative flex flex-col justify-between h-[280px] rounded-[32px] border border-white/10 bg-[#09090b]/80 p-8 transition-all hover:border-white/20 hover:bg-[#0a0a0c] overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    
                    {/* Background glow when hovered */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Top Section */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-xl overflow-hidden ring-1 ring-white/5 group-hover:ring-white/20 transition-all">
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
                          <span className="fallback-emoji hidden font-cortes-display text-white">ID</span>
                        </div>
                        {chat.bot_active && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#3B82F6] rounded-full border-[3px] border-[#09090b] shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                        )}
                      </div>

                      <div className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white transition-colors group-hover:rotate-90 duration-300">
                        <Settings size={16} />
                      </div>
                    </div>

                    {/* Middle Section: Title */}
                    <div className="relative z-10 my-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-cortes-display text-2xl tracking-[-0.02em] text-white truncate pr-2">
                          {chat.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-cortes-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                          {chat.members_count.toLocaleString()} Users
                        </p>
                        {roleInfo && (
                          <span className={`inline-flex items-center gap-1 font-cortes-mono text-[9px] uppercase tracking-[0.2em] ${roleInfo.color}`}>
                            {roleInfo.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Stats & Status */}
                    <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-4 mt-auto">
                      <div>
                        {chat.messages_today > 0 ? (
                           <>
                             <div className="flex items-center gap-2 mb-1">
                               <MessageCircle size={10} className="text-[#3B82F6]" />
                               <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-white/30">Активность</span>
                             </div>
                             <p className="font-cortes-display text-3xl text-white leading-none">
                               {chat.messages_today}
                             </p>
                           </>
                        ) : (
                           <>
                             <p className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Активность</p>
                             <p className="font-cortes-display text-2xl text-white/20">—</p>
                           </>
                        )}
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="font-cortes-mono text-[8px] uppercase tracking-[0.2em] text-white/30 mb-2">Статус ядра</span>
                        {chat.bot_active ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse mr-2" />
                            <span className="font-cortes-mono text-[9px] uppercase tracking-[0.2em] text-[#3B82F6]">Active</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 mr-2" />
                            <span className="font-cortes-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Muted</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
