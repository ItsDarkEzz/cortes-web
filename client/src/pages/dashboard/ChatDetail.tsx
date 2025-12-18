import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Settings, Users, MessageCircle, Bot, Shield,
  BarChart3, Clock, Trash2, Crown, AlertTriangle, Zap,
  UserPlus, Ban, VolumeX, AlertCircle, FileText,
  Bell, Filter, Mic, Image, Sticker, Link2, UserCheck,
  Lock, Unlock, Flag, BookOpen, ChevronRight, Plus, X, Edit2,
  History, Brain, Eye, EyeOff, UserMinus, Volume2, CreditCard, Check, Star
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

type TabType = "overview" | "bot" | "moderation" | "filters" | "members" | "logs" | "brain" | "plan";
type UserRole = "owner" | "admin" | "moderator" | "member";

interface ChatMember {
  id: number; name: string; username: string; avatar: string; role: UserRole;
  level: number; sympathy: number; warnings: number; joinedAt: string;
}

interface LogEntry {
  id: number; type: "ban" | "mute" | "warn" | "kick" | "delete" | "role" | "filter";
  action: string; target?: string; by: string; reason?: string; time: string;
}

interface MessageLog {
  id: number; user: string; text: string; time: string; deleted: boolean; deletedReason?: string;
}

const mockChat = { id: 1, name: "Dev Community", description: "Сообщество разработчиков для обсуждения технологий", members: 1250, botName: "Cortes", botPersonality: "friendly", rules: "1. Уважайте друг друга\n2. Без спама\n3. Только по теме" };

const mockMembers: ChatMember[] = [
  { id: 1, name: "Шахриёр", username: "@shahriyor_dev", avatar: "🧑‍💻", role: "owner", level: 42, sympathy: 95, warnings: 0, joinedAt: "15 мар" },
  { id: 2, name: "Алексей", username: "@alexey", avatar: "👨‍💻", role: "admin", level: 38, sympathy: 88, warnings: 0, joinedAt: "16 мар" },
  { id: 3, name: "Мария", username: "@maria", avatar: "👩‍🎨", role: "moderator", level: 25, sympathy: 72, warnings: 0, joinedAt: "20 мар" },
  { id: 4, name: "Дмитрий", username: "@dmitry", avatar: "🧔", role: "member", level: 15, sympathy: 45, warnings: 1, joinedAt: "1 апр" },
  { id: 5, name: "Анна", username: "@anna", avatar: "👩‍🔬", role: "member", level: 8, sympathy: 30, warnings: 2, joinedAt: "10 апр" },
];

const mockLogs: LogEntry[] = [
  { id: 1, type: "warn", action: "Предупреждение", target: "@dmitry", by: "@maria", reason: "Оффтоп", time: "14:32" },
  { id: 2, type: "delete", action: "Удалено сообщение", target: "@anna", by: "Авто", reason: "Стоп-слово", time: "14:28" },
  { id: 3, type: "mute", action: "Мут на 1ч", target: "@user123", by: "@alexey", reason: "Спам", time: "13:15" },
  { id: 4, type: "role", action: "Назначен модератором", target: "@maria", by: "@shahriyor_dev", time: "12:00" },
];

const mockMessages: MessageLog[] = [
  { id: 1, user: "@alexey", text: "Привет всем! Как дела с проектом?", time: "14:35", deleted: false },
  { id: 2, user: "@dmitry", text: "Работаем, скоро релиз", time: "14:36", deleted: false },
  { id: 3, user: "@anna", text: "[удалено]", time: "14:28", deleted: true, deletedReason: "Стоп-слово: реклама" },
  { id: 4, user: "@maria", text: "Отличные новости!", time: "14:37", deleted: false },
];

const mockBrainData = {
  chatTone: "Дружелюбный, технический", mainTopics: ["Программирование", "AI/ML", "Стартапы", "Карьера"],
  activeHours: "10:00 - 22:00", avgResponseTime: "2-5 сек", memoryItems: 156,
  learnedPatterns: ["Приветствия по утрам", "Технические дискуссии", "Юмор в пятницу"],
  userRelations: "Знает 45 активных участников, их интересы и стиль общения",
  recentLearning: ["Новый мем про JavaScript", "Тренд на Rust", "Обсуждение GPT-5"],
};

const mockSettings = {
  autoReplyEnabled: true, welcomeEnabled: true, welcomeMessage: "Добро пожаловать в Dev Community! 🎉",
  inactivityEnabled: true, inactivityHours: 6, inactivityMessages: ["Что-то тихо стало...", "Эй, есть кто живой?"],
  warningsForBan: 3, banDurationDays: 30, warningExpireDays: 14,
  autoBanMessage: "🚫 Пользователь {user} заблокирован на {days} дней.\nПричина: превышен лимит предупреждений ({warnings}/{max}).\nПоследнее нарушение: {reason}",
  stopWordsEnabled: true, stopWords: ["спам", "реклама", "казино"], stopWordMessage: "⚠️ Сообщение удалено. Причина: запрещённое слово.",
  blockChannelPosts: true, blockedChannels: ["@spam_channel", "@ads_channel"], channelBlockMessage: "⚠️ Репост из этого канала не приемлем в чате.",
  blockVoice: false, blockVideo: false, blockStickers: false,
  faceControlEnabled: true, requireAvatar: true, requireUsername: true, minNameLength: 2,
  nsfwFilterEnabled: true, nsfwAvatarCheck: true, questionnaireEnabled: true,
  questionnaireQuestions: ["Откуда узнали о чате?", "Чем занимаетесь?"], readOnlyMode: false,
};

const roleLabels: Record<UserRole, string> = { owner: "Владелец", admin: "Админ", moderator: "Модератор", member: "Участник" };
const roleColors: Record<UserRole, string> = { owner: "text-yellow-400 bg-yellow-400/10", admin: "text-red-400 bg-red-400/10", moderator: "text-blue-400 bg-blue-400/10", member: "text-muted-foreground bg-white/5" };

const mockPlan = {
  current: "pro",
  name: "Pro",
  expiresAt: "15 января 2025",
  daysLeft: 28,
  features: ["Безлимитные сообщения", "Все функции модерации", "Приоритетная поддержка", "API доступ"],
};

const plans = [
  { id: "free", name: "Free", price: "0", period: "", features: ["100 сообщений/день", "Базовая модерация", "RPG система"], color: "text-muted-foreground", popular: false },
  { id: "pro", name: "Pro", price: "990", period: "/мес", features: ["Безлимит сообщений", "Все функции модерации", "Приоритетная поддержка", "API доступ"], color: "text-primary", popular: true },
  { id: "business", name: "Business", price: "2990", period: "/мес", features: ["Всё из Pro", "Несколько чатов", "Выделенный сервер", "SLA 99.9%"], color: "text-yellow-400", popular: false },
];

// Стили для скроллбара
const scrollStyles = "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${enabled ? "bg-primary" : "bg-white/20"}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SettingRow({ icon: Icon, title, desc, enabled, onToggle, color = "text-primary" }: {
  icon: React.ElementType; title: string; desc: string; enabled: boolean; onToggle: () => void; color?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}><Icon size={18} /></div>
        <div><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${active ? "bg-primary text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
      <Icon size={16} />{label}
    </button>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon, title, color = "text-primary" }: { icon: React.ElementType; title: string; color?: string }) {
  return <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Icon size={18} className={color} />{title}</h3>;
}

function OverviewTab() {
  const [chat, setChat] = useState(mockChat);
  const [editing, setEditing] = useState(false);

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Section>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Settings} title="Информация о чате" />
          <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}><Edit2 size={14} className="mr-2" />{editing ? "Готово" : "Изменить"}</Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Название чата</label>
            {editing ? <input value={chat.name} onChange={(e) => setChat(p => ({ ...p, name: e.target.value }))} className="w-full h-10 px-3 mt-2 rounded-xl bg-white/5 border border-white/10" /> : <p className="font-medium mt-1">{chat.name}</p>}
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Описание</label>
            {editing ? <textarea value={chat.description} onChange={(e) => setChat(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 mt-2 rounded-xl bg-white/5 border border-white/10 resize-none" /> : <p className="text-muted-foreground mt-1">{chat.description}</p>}
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle icon={BarChart3} title="Статистика" color="text-green-400" />
        <div className="grid grid-cols-2 gap-4">
          {[{ icon: Users, label: "Участников", value: "1,250", color: "text-blue-400" }, { icon: MessageCircle, label: "Сообщений", value: "12.5K", color: "text-green-400" }, { icon: Bot, label: "Ответов бота", value: "890", color: "text-primary" }, { icon: Clock, label: "Дней активности", value: "89", color: "text-yellow-400" }].map((s, i) => (
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
        <textarea value={chat.rules} onChange={(e) => setChat(p => ({ ...p, rules: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 resize-none" placeholder="Введите правила чата..." />
      </Section>
    </div>
  );
}

function BotSettingsTab() {
  const [s, setS] = useState(mockSettings);
  const [botName, setBotName] = useState(mockChat.botName);
  const [personality, setPersonality] = useState(mockChat.botPersonality);
  const toggle = (k: keyof typeof s) => setS(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Section>
        <SectionTitle icon={Bot} title="Персонализация бота" />
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Имя бота в чате</label>
            <input value={botName} onChange={(e) => setBotName(e.target.value)} className="w-full h-10 px-3 mt-2 rounded-xl bg-white/5 border border-white/10" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">Характер бота</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ key: "friendly", label: "😊 Дружелюбный" }, { key: "professional", label: "💼 Деловой" }, { key: "funny", label: "😄 Весёлый" }, { key: "strict", label: "😤 Строгий" }].map((p) => (
                <button key={p.key} className={`px-4 py-3 rounded-xl font-medium transition-colors ${personality === p.key ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"}`} onClick={() => setPersonality(p.key)}>{p.label}</button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="space-y-5">
        <Section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400"><Volume2 size={18} /></div>
              <div><p className="font-medium">Авто-ответы</p><p className="text-sm text-muted-foreground">Бот самостоятельно включается в разговор</p></div>
            </div>
            <Toggle enabled={s.autoReplyEnabled} onToggle={() => toggle('autoReplyEnabled')} />
          </div>
        </Section>

        <Section>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle icon={Bell} title="Приветствие" color="text-green-400" />
            <Toggle enabled={s.welcomeEnabled} onToggle={() => toggle('welcomeEnabled')} />
          </div>
          {s.welcomeEnabled && <textarea value={s.welcomeMessage} onChange={(e) => setS(p => ({ ...p, welcomeMessage: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 resize-none" />}
        </Section>
      </div>

      <Section className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Clock} title="Сообщения при неактивности" color="text-yellow-400" />
          <Toggle enabled={s.inactivityEnabled} onToggle={() => toggle('inactivityEnabled')} />
        </div>
        {s.inactivityEnabled && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Через</span>
              <input type="number" value={s.inactivityHours} onChange={(e) => setS(p => ({ ...p, inactivityHours: parseInt(e.target.value) }))} className="w-20 h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-center" />
              <span className="text-muted-foreground">часов без активности</span>
            </div>
            {s.inactivityMessages.map((msg, i) => (
              <div key={i} className="flex gap-2">
                <input value={msg} onChange={(e) => { const m = [...s.inactivityMessages]; m[i] = e.target.value; setS(p => ({ ...p, inactivityMessages: m })); }} className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10" />
                <Button variant="ghost" size="icon" className="h-10 w-10 text-red-400 hover:text-red-300" onClick={() => setS(p => ({ ...p, inactivityMessages: p.inactivityMessages.filter((_, idx) => idx !== i) }))}><X size={18} /></Button>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed border-white/20" onClick={() => setS(p => ({ ...p, inactivityMessages: [...p.inactivityMessages, ""] }))}><Plus size={16} className="mr-2" />Добавить сообщение</Button>
          </div>
        )}
      </Section>
    </div>
  );
}

function ModerationTab() {
  const [s, setS] = useState(mockSettings);
  const toggle = (k: keyof typeof s) => { if (typeof s[k] === 'boolean') setS(p => ({ ...p, [k]: !p[k] })); };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Section>
        <SectionTitle icon={Shield} title="Команды модерации" color="text-red-400" />
        <p className="text-sm text-muted-foreground mb-4">/ban, /mute, /kick, /warn — в ответ на сообщение или с @username и причиной</p>
        <div className="space-y-2">
          <SettingRow icon={Ban} title="/ban, /unban" desc="Блокировка пользователей" enabled={true} onToggle={() => {}} color="text-red-400" />
          <SettingRow icon={VolumeX} title="/mute, /unmute" desc="Заглушение пользователей" enabled={true} onToggle={() => {}} color="text-orange-400" />
          <SettingRow icon={UserMinus} title="/kick" desc="Удаление из чата" enabled={true} onToggle={() => {}} color="text-yellow-400" />
          <SettingRow icon={AlertCircle} title="/warn, /unwarn" desc="Предупреждения" enabled={true} onToggle={() => {}} color="text-purple-400" />
        </div>
      </Section>

      <Section>
        <SectionTitle icon={AlertTriangle} title="Система предупреждений" color="text-yellow-400" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div><label className="text-sm text-muted-foreground">Предов до бана</label><input type="number" value={s.warningsForBan} onChange={(e) => setS(p => ({ ...p, warningsForBan: parseInt(e.target.value) }))} className="w-full h-10 px-3 mt-2 rounded-xl bg-white/5 border border-white/10 text-center" /></div>
          <div><label className="text-sm text-muted-foreground">Бан на (дней)</label><input type="number" value={s.banDurationDays} onChange={(e) => setS(p => ({ ...p, banDurationDays: parseInt(e.target.value) }))} className="w-full h-10 px-3 mt-2 rounded-xl bg-white/5 border border-white/10 text-center" /></div>
          <div><label className="text-sm text-muted-foreground">Сгорание (дней)</label><input type="number" value={s.warningExpireDays} onChange={(e) => setS(p => ({ ...p, warningExpireDays: parseInt(e.target.value) }))} className="w-full h-10 px-3 mt-2 rounded-xl bg-white/5 border border-white/10 text-center" /></div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Бот помнит за какое сообщение выдан пред</p>
      </Section>

      <Section className="lg:col-span-2">
        <SectionTitle icon={MessageCircle} title="Сообщение при автобане" color="text-red-400" />
        <textarea value={s.autoBanMessage} onChange={(e) => setS(p => ({ ...p, autoBanMessage: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 resize-none font-mono text-sm" />
        <p className="text-xs text-muted-foreground mt-2">Переменные: {"{user}"}, {"{days}"}, {"{warnings}"}, {"{max}"}, {"{reason}"}</p>
      </Section>

      <Section>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.readOnlyMode ? "bg-red-400/10 text-red-400" : "bg-green-400/10 text-green-400"}`}>{s.readOnlyMode ? <Lock size={18} /> : <Unlock size={18} />}</div>
            <div><p className="font-medium">Тихий режим</p><p className="text-sm text-muted-foreground">/ro включить, /roof выключить</p></div>
          </div>
          <Toggle enabled={s.readOnlyMode} onToggle={() => toggle('readOnlyMode')} />
        </div>
      </Section>

      <Section>
        <SectionTitle icon={Flag} title="Система жалоб" color="text-orange-400" />
        <p className="text-muted-foreground">Команда /report отправляет жалобу модераторам чата</p>
      </Section>
    </div>
  );
}

function FiltersTab() {
  const [s, setS] = useState(mockSettings);
  const [newWord, setNewWord] = useState("");
  const [newChannel, setNewChannel] = useState("");
  const toggle = (k: keyof typeof s) => { if (typeof s[k] === 'boolean') setS(p => ({ ...p, [k]: !p[k] })); };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Section>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Filter} title="Стоп-слова" color="text-red-400" />
          <Toggle enabled={s.stopWordsEnabled} onToggle={() => toggle('stopWordsEnabled')} />
        </div>
        {s.stopWordsEnabled && (<>
          <div className="flex flex-wrap gap-2 mb-4">
            {s.stopWords.map((w, i) => (<span key={i} className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 flex items-center gap-2">{w}<button onClick={() => setS(p => ({ ...p, stopWords: p.stopWords.filter((_, idx) => idx !== i) }))} className="hover:text-red-300"><X size={14} /></button></span>))}
          </div>
          <div className="flex gap-2 mb-4">
            <input value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="Добавить слово..." className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10" />
            <Button onClick={() => { if (newWord) { setS(p => ({ ...p, stopWords: [...p.stopWords, newWord] })); setNewWord(""); } }}><Plus size={16} /></Button>
          </div>
          <div><label className="text-sm text-muted-foreground">Сообщение при удалении</label><input value={s.stopWordMessage} onChange={(e) => setS(p => ({ ...p, stopWordMessage: e.target.value }))} className="w-full h-10 px-4 mt-2 rounded-xl bg-white/5 border border-white/10" /></div>
        </>)}
      </Section>

      <Section>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Link2} title="Фильтр каналов" color="text-orange-400" />
          <Toggle enabled={s.blockChannelPosts} onToggle={() => toggle('blockChannelPosts')} />
        </div>
        {s.blockChannelPosts && (<>
          <div className="flex flex-wrap gap-2 mb-4">
            {s.blockedChannels.map((c, i) => (<span key={i} className="px-3 py-1.5 rounded-lg bg-orange-400/10 text-orange-400 flex items-center gap-2">{c}<button onClick={() => setS(p => ({ ...p, blockedChannels: p.blockedChannels.filter((_, idx) => idx !== i) }))} className="hover:text-orange-300"><X size={14} /></button></span>))}
          </div>
          <div className="flex gap-2 mb-4">
            <input value={newChannel} onChange={(e) => setNewChannel(e.target.value)} placeholder="@channel_name" className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10" />
            <Button onClick={() => { if (newChannel) { setS(p => ({ ...p, blockedChannels: [...p.blockedChannels, newChannel] })); setNewChannel(""); } }}><Plus size={16} /></Button>
          </div>
          <div><label className="text-sm text-muted-foreground">Сообщение при блокировке</label><input value={s.channelBlockMessage} onChange={(e) => setS(p => ({ ...p, channelBlockMessage: e.target.value }))} className="w-full h-10 px-4 mt-2 rounded-xl bg-white/5 border border-white/10" /></div>
        </>)}
      </Section>

      <Section>
        <SectionTitle icon={Image} title="Фильтр медиа" color="text-blue-400" />
        <div className="space-y-2">
          <SettingRow icon={Mic} title="Голосовые сообщения" desc="Блокировать голосовые" enabled={s.blockVoice} onToggle={() => toggle('blockVoice')} color="text-blue-400" />
          <SettingRow icon={Image} title="Видео-кружки" desc="Блокировать кружки" enabled={s.blockVideo} onToggle={() => toggle('blockVideo')} color="text-purple-400" />
          <SettingRow icon={Sticker} title="Стикеры" desc="Блокировать стикеры" enabled={s.blockStickers} onToggle={() => toggle('blockStickers')} color="text-yellow-400" />
        </div>
      </Section>

      <Section>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={EyeOff} title="NSFW фильтр" color="text-pink-400" />
          <Toggle enabled={s.nsfwFilterEnabled} onToggle={() => toggle('nsfwFilterEnabled')} />
        </div>
        <p className="text-muted-foreground">Автоматическое удаление откровенного контента в сообщениях</p>
      </Section>

      <Section className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={UserCheck} title="Face-контроль" color="text-green-400" />
          <Toggle enabled={s.faceControlEnabled} onToggle={() => toggle('faceControlEnabled')} />
        </div>
        {s.faceControlEnabled && (
          <div className="grid lg:grid-cols-2 gap-2">
            <SettingRow icon={Image} title="Требовать аватар" desc="У пользователя должен быть аватар" enabled={s.requireAvatar} onToggle={() => toggle('requireAvatar')} color="text-green-400" />
            <SettingRow icon={EyeOff} title="Проверка NSFW аватара" desc="Блокировать откровенные аватары" enabled={s.nsfwAvatarCheck} onToggle={() => toggle('nsfwAvatarCheck')} color="text-pink-400" />
            <SettingRow icon={Users} title="Требовать username" desc="У пользователя должен быть @username" enabled={s.requireUsername} onToggle={() => toggle('requireUsername')} color="text-green-400" />
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-green-400"><FileText size={18} /></div><div><p className="font-medium">Мин. длина имени</p><p className="text-sm text-muted-foreground">Минимум символов в имени</p></div></div>
              <input type="number" value={s.minNameLength} onChange={(e) => setS(p => ({ ...p, minNameLength: parseInt(e.target.value) }))} className="w-16 h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-center" />
            </div>
            <SettingRow icon={FileText} title="Анкета при вступлении" desc="Задать вопросы новым участникам" enabled={s.questionnaireEnabled} onToggle={() => toggle('questionnaireEnabled')} color="text-blue-400" />
          </div>
        )}
      </Section>
    </div>
  );
}

function MembersTab() {
  const [members, setMembers] = useState(mockMembers);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.username.toLowerCase().includes(search.toLowerCase()));
  const changeRole = (id: number, role: UserRole) => { setMembers(p => p.map(m => m.id === id ? { ...m, role } : m)); setSelectedId(null); };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск участников..." className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10" />
      </div>

      <div className="space-y-3">
        {filtered.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl">{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-medium truncate">{m.name}</p><span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${roleColors[m.role]}`}>{roleLabels[m.role]}</span></div>
                <p className="text-sm text-muted-foreground">{m.username}</p>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center"><p className="font-bold">Lvl {m.level}</p><p className="text-xs text-muted-foreground">Уровень</p></div>
                <div className="text-center"><p className={`font-bold ${m.sympathy >= 70 ? "text-green-400" : m.sympathy >= 40 ? "text-yellow-400" : "text-red-400"}`}>{m.sympathy}%</p><p className="text-xs text-muted-foreground">Симпатия</p></div>
                <div className="text-center"><p className={`font-bold ${m.warnings > 0 ? "text-red-400" : "text-green-400"}`}>{m.warnings}/3</p><p className="text-xs text-muted-foreground">Преды</p></div>
              </div>
              {m.role !== "owner" && <Button variant="outline" size="sm" className="border-white/10" onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}><Crown size={14} className="mr-2" />Роль<ChevronRight size={14} className={`ml-1 transition-transform ${selectedId === m.id ? "rotate-90" : ""}`} /></Button>}
            </div>
            {selectedId === m.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground mb-3">Изменить роль:</p>
                <div className="flex gap-2">{(["admin", "moderator", "member"] as UserRole[]).map((r) => (<button key={r} onClick={() => changeRole(m.id, r)} className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${m.role === r ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"}`}>{roleLabels[r]}</button>))}</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-dashed border-white/20 text-center">
        <Button variant="ghost" className="text-primary"><UserPlus size={18} className="mr-2" />Пригласить участника</Button>
      </div>
    </div>
  );
}

function LogsTab() {
  const [tab, setTab] = useState<"actions" | "messages">("actions");
  const logColors: Record<string, string> = { ban: "text-red-400 bg-red-400/10", mute: "text-orange-400 bg-orange-400/10", warn: "text-yellow-400 bg-yellow-400/10", kick: "text-purple-400 bg-purple-400/10", delete: "text-blue-400 bg-blue-400/10", role: "text-green-400 bg-green-400/10", filter: "text-pink-400 bg-pink-400/10" };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-white/5">
        <button onClick={() => setTab("actions")} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${tab === "actions" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>Действия модераторов</button>
        <button onClick={() => setTab("messages")} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${tab === "messages" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>История сообщений</button>
      </div>

      {tab === "actions" ? (
        <div className="space-y-3">
          {mockLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${logColors[log.type]}`}>
                {log.type === "ban" && <Ban size={18} />}{log.type === "mute" && <VolumeX size={18} />}{log.type === "warn" && <AlertCircle size={18} />}{log.type === "kick" && <UserMinus size={18} />}{log.type === "delete" && <Trash2 size={18} />}{log.type === "role" && <Crown size={18} />}{log.type === "filter" && <Filter size={18} />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{log.action} {log.target && <span className="text-primary">{log.target}</span>}</p>
                <p className="text-sm text-muted-foreground">{log.by} {log.reason && `• ${log.reason}`}</p>
              </div>
              <span className="text-sm text-muted-foreground">{log.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`p-4 rounded-xl ${msg.deleted ? "bg-red-500/5 border border-red-500/20" : "bg-white/5 border border-white/10"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-primary">{msg.user}</span>
                <span className="text-sm text-muted-foreground">{msg.time}</span>
              </div>
              <p className={msg.deleted ? "text-red-400 italic" : ""}>{msg.text}</p>
              {msg.deleted && <p className="text-sm text-red-400/70 mt-2 flex items-center gap-2"><Trash2 size={14} />{msg.deletedReason}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanTab() {
  const currentPlan = plans.find(p => p.id === mockPlan.current);
  
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {/* Current Plan Card */}
      <Section className="lg:col-span-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">{mockPlan.name}</h3>
                <span className="px-2 py-0.5 rounded-lg bg-green-400/10 text-green-400 text-xs font-medium">Активен</span>
              </div>
              <p className="text-muted-foreground">до {mockPlan.expiresAt} • осталось {mockPlan.daysLeft} дней</p>
            </div>
          </div>
          <Button variant="outline" className="border-white/10">
            <History size={16} className="mr-2" />История платежей
          </Button>
        </div>
      </Section>

      {/* Plan Cards */}
      {plans.map((plan) => {
        const isCurrent = plan.id === mockPlan.current;
        const isUpgrade = plan.id === "business" || (plan.id === "pro" && mockPlan.current === "free");
        
        return (
          <Section 
            key={plan.id} 
            className={`relative ${isCurrent ? "ring-2 ring-primary/50" : ""} ${plan.popular ? "lg:-mt-2 lg:mb-2" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold">
                Рекомендуем
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                plan.id === "free" ? "bg-white/10 text-muted-foreground" :
                plan.id === "pro" ? "bg-primary/10 text-primary" :
                "bg-yellow-400/10 text-yellow-400"
              }`}>
                {plan.id === "free" ? <Users size={18} /> : plan.id === "pro" ? <Zap size={18} /> : <Crown size={18} />}
              </div>
              <div>
                <h4 className="font-semibold">{plan.name}</h4>
                <p className={`text-lg font-bold ${plan.color}`}>
                  {plan.price === "0" ? "Бесплатно" : `${plan.price}₽`}
                  <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check size={14} className="text-green-400 shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>

            {isCurrent ? (
              <div className="text-center py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                Текущий тариф
              </div>
            ) : isUpgrade ? (
              <Button className="w-full">
                Улучшить до {plan.name}
              </Button>
            ) : (
              <Button variant="outline" className="w-full border-white/10">
                Понизить
              </Button>
            )}
          </Section>
        );
      })}

      {/* Quick Actions */}
      <Section className="lg:col-span-3">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-white/10">
            <CreditCard size={16} className="mr-2" />Привязать карту
          </Button>
          <Button variant="outline" className="border-white/10">
            <FileText size={16} className="mr-2" />Скачать счёт
          </Button>
          <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-auto">
            Отменить подписку
          </Button>
        </div>
      </Section>
    </div>
  );
}

function BrainTab() {
  const data = mockBrainData;

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Section className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10">
        <SectionTitle icon={Brain} title="Как Cortes видит этот чат" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-sm text-muted-foreground">Тон общения</p><p className="font-medium mt-1">{data.chatTone}</p></div>
          <div><p className="text-sm text-muted-foreground">Активные часы</p><p className="font-medium mt-1">{data.activeHours}</p></div>
          <div><p className="text-sm text-muted-foreground">Время ответа</p><p className="font-medium mt-1">{data.avgResponseTime}</p></div>
          <div><p className="text-sm text-muted-foreground">Элементов памяти</p><p className="font-medium mt-1">{data.memoryItems}</p></div>
        </div>
      </Section>

      <Section>
        <SectionTitle icon={MessageCircle} title="Основные темы" color="text-blue-400" />
        <div className="flex flex-wrap gap-2">{data.mainTopics.map((t, i) => (<span key={i} className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium">{t}</span>))}</div>
      </Section>

      <Section>
        <SectionTitle icon={Eye} title="Выученные паттерны" color="text-green-400" />
        <div className="space-y-2">{data.learnedPatterns.map((p, i) => (<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><Eye size={16} className="text-green-400" /><span>{p}</span></div>))}</div>
      </Section>

      <Section>
        <SectionTitle icon={Users} title="Знание участников" color="text-purple-400" />
        <p className="text-muted-foreground">{data.userRelations}</p>
      </Section>

      <Section>
        <SectionTitle icon={Zap} title="Недавно изучено" color="text-yellow-400" />
        <div className="space-y-2">{data.recentLearning.map((l, i) => (<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><Zap size={16} className="text-yellow-400" /><span className="text-muted-foreground">{l}</span></div>))}</div>
      </Section>

      <Section className="lg:col-span-2 bg-yellow-500/5 border-yellow-500/20">
        <SectionTitle icon={Edit2} title="Корректировка поведения" color="text-yellow-400" />
        <p className="text-muted-foreground mb-4">Напишите инструкцию для Cortes, как ему вести себя в этом чате. Это повлияет на его ответы и поведение.</p>
        <textarea placeholder="Например: Будь более формальным, избегай шуток, фокусируйся на технических темах..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 resize-none" />
        <Button className="mt-4">Применить изменения</Button>
      </Section>
    </div>
  );
}

export default function ChatDetail() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useSEO({ title: `${mockChat.name} | Cortes AI`, description: `Настройки чата ${mockChat.name}`, canonical: `/dashboard/chats/${mockChat.id}` });

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
        <Link href="/dashboard/chats"><Button variant="ghost" size="icon" className="h-10 w-10"><ArrowLeft size={20} /></Button></Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold">{mockChat.name}</h1>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <p className="text-sm text-muted-foreground">{mockChat.members.toLocaleString()} участников</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/10"><Settings size={16} className="mr-2" />Telegram</Button>
          <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10"><Trash2 size={16} className="mr-2" />Удалить бота</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 shrink-0">
        {tabs.map((tab) => (<TabBtn key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} icon={tab.icon} label={tab.label} />))}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto pr-2 ${scrollStyles}`}>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "bot" && <BotSettingsTab />}
        {activeTab === "moderation" && <ModerationTab />}
        {activeTab === "filters" && <FiltersTab />}
        {activeTab === "members" && <MembersTab />}
        {activeTab === "logs" && <LogsTab />}
        {activeTab === "brain" && <BrainTab />}
        {activeTab === "plan" && <PlanTab />}
      </div>

    </DashboardLayout>
  );
}
