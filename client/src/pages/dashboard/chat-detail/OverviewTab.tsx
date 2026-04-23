/**
 * Вкладка "Обзор" - информация о чате и статистика
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, BarChart3, Users, MessageCircle, Bot, Clock, BookOpen, X, Check, Edit2 } from "lucide-react";
import { Section, SectionTitle } from "./components";
import { API_BASE } from "./constants";
import type { ChatDetails } from "@/lib/api/types";

interface OverviewTabProps {
  chat: ChatDetails;
  onUpdate: (data: Partial<ChatDetails>) => void;
}

export function OverviewTab({ chat, onUpdate }: OverviewTabProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: chat.name,
    description: chat.description || "",
    rules: chat.rules || "",
  });

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const stats = chat.stats;

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Section>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Settings} title="Информация о чате" />
          {editing ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}><X size={14} className="mr-2" />Отмена</Button>
              <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600"><Check size={14} className="mr-2" />Сохранить</Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Edit2 size={14} className="mr-2" />Изменить</Button>
          )}
        </div>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-[16px] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-lg border border-white/10">
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
              <span className="fallback-emoji hidden text-2xl">💬</span>
            </div>
            <div className="flex-1 w-full min-w-0 text-center sm:text-left">
              <label className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">Название чата</label>
              {editing ? (
                <input 
                  value={formData.name} 
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} 
                  className="w-full h-12 px-4 rounded-[16px] bg-black border border-white/20 font-cortes-display text-xl text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] min-w-0" 
                />
              ) : (
                <p className="font-cortes-display text-2xl tracking-[-0.02em] text-white truncate w-full">{chat.name}</p>
              )}
            </div>
          </div>
          <div className="w-full min-w-0">
            <label className="text-sm text-muted-foreground">Описание</label>
            {editing ? (
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} 
                rows={3} 
                className="w-full px-3 py-2 mt-2 rounded-xl bg-white/5 border border-white/10 resize-none" 
                placeholder="Описание чата..."
              />
            ) : (
              <p className="text-muted-foreground mt-1">{chat.description || "Нет описания"}</p>
            )}
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle icon={BarChart3} title="Статистика" color="text-green-400" />
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          {[
            { icon: Users, label: "Участников", value: chat.members_count.toLocaleString(), color: "text-blue-400" },
            { icon: MessageCircle, label: "Сообщений", value: stats.messages_total.toLocaleString(), color: "text-green-400" },
            { icon: Bot, label: "Ответов бота", value: stats.bot_responses_total.toLocaleString(), color: "text-primary" },
            { icon: Clock, label: "Дней активности", value: stats.days_active.toString(), color: "text-yellow-400" }
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center min-w-0 overflow-hidden">
              <s.icon size={20} className={`mx-auto mb-3 ${s.color}`} />
              <p className="font-cortes-display text-2xl text-white truncate">{s.value}</p>
              <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/40 truncate">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="lg:col-span-2">
        <SectionTitle icon={BookOpen} title="Правила чата (/rules)" />
        <textarea 
          value={editing ? formData.rules : (chat.rules || "")} 
          onChange={(e) => setFormData(p => ({ ...p, rules: e.target.value }))} 
          rows={4} 
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 resize-none" 
          placeholder="Введите правила чата..."
          disabled={!editing}
        />
      </Section>
    </div>
  );
}
