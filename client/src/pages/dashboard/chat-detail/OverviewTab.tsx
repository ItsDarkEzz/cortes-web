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
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden">
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
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Название чата</label>
              {editing ? (
                <input 
                  value={formData.name} 
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} 
                  className="w-full h-10 px-3 mt-1 rounded-xl bg-white/5 border border-white/10" 
                />
              ) : (
                <p className="font-medium mt-1">{chat.name}</p>
              )}
            </div>
          </div>
          <div>
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
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, label: "Участников", value: chat.members_count.toLocaleString(), color: "text-blue-400" },
            { icon: MessageCircle, label: "Сообщений", value: stats.messages_total.toLocaleString(), color: "text-green-400" },
            { icon: Bot, label: "Ответов бота", value: stats.bot_responses_total.toLocaleString(), color: "text-primary" },
            { icon: Clock, label: "Дней активности", value: stats.days_active.toString(), color: "text-yellow-400" }
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 text-center">
              <s.icon size={20} className={`mx-auto mb-2 ${s.color}`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
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
