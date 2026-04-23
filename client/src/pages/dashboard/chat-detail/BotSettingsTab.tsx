/**
 * Вкладка "Бот" - настройки бота
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, Bell, Clock, Plus, X, Check, Loader2 } from "lucide-react";
import { Section, SectionTitle, Toggle } from "./components";
import { useChatSettings, useUpdateChatSettings } from "@/hooks/use-chats";

interface BotSettingsTabProps {
  chatId: string;
}

export function BotSettingsTab({ chatId }: BotSettingsTabProps) {
  const { data: settings, isLoading } = useChatSettings(chatId);
  const updateSettings = useUpdateChatSettings(chatId);

  const [botName, setBotName] = useState("");
  const [botMode, setBotMode] = useState<'normal' | 'passive' | 'muted' | 'admins'>('normal');
  const [personality, setPersonality] = useState("friendly");
  const [welcomeEnabled, setWelcomeEnabled] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [inactivityEnabled, setInactivityEnabled] = useState(false);
  const [inactivityHours, setInactivityHours] = useState(24);
  const [inactivityMessages, setInactivityMessages] = useState<string[]>([]);
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.bot) {
      setBotName(settings.bot.name || "Cortes");
      setBotMode(settings.bot.mode || 'normal');
      setPersonality(settings.bot.personality || "friendly");
      setWelcomeEnabled(settings.bot.welcome_enabled ?? false);
      setWelcomeMessage(settings.bot.welcome_message || "Добро пожаловать в {chat_name}, {user}!");
      setInactivityEnabled(settings.bot.inactivity_enabled ?? false);
      setInactivityHours(settings.bot.inactivity_hours || 24);
      setInactivityMessages(settings.bot.inactivity_messages || []);
      setHasChanges(false);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync({
        bot: {
          name: botName,
          mode: botMode,
          personality,
          welcome_enabled: welcomeEnabled,
          welcome_message: welcomeMessage,
          inactivity_enabled: inactivityEnabled,
          inactivity_hours: inactivityHours,
          inactivity_messages: inactivityMessages,
        }
      });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const markChanged = () => setHasChanges(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-5">
        <Section>
          <SectionTitle icon={Bot} title="Персонализация бота" />
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Имя бота в чате</label>
              <input
                value={botName}
                onChange={(e) => { setBotName(e.target.value); markChanged(); }}
                className="w-full h-10 px-3 mt-2 rounded-xl bg-white/5 border border-white/10"
              />
            </div>

            <div>
              <label className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 block">Характер бота</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "friendly", label: "😊 Дружелюбный" },
                  { key: "business", label: "💼 Деловой" },
                  { key: "funny", label: "😄 Весёлый" },
                  { key: "strict", label: "😤 Строгий" }
                ].map((p) => (
                  <button
                    key={p.key}
                    className={`px-4 py-3 rounded-2xl font-cortes-mono text-[10px] uppercase tracking-[0.1em] transition-all min-w-0 flex items-center justify-center border ${personality === p.key ? "bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "bg-white/[0.02] text-white border-white/5 hover:border-white/10 hover:bg-white/[0.04]"}`}
                    onClick={() => { setPersonality(p.key); markChanged(); }}
                  >
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <div className="space-y-5">
          <Section>
            <SectionTitle icon={Bot} title="Режим бота" color="text-blue-400" />
            <p className="text-sm text-muted-foreground mb-3">Как активно бот будет участвовать в разговоре</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { key: 'normal', label: '🟢 Обычный', desc: 'Cortes сам вступает в разговор' },
                { key: 'passive', label: '🟡 Пассивный', desc: 'Только на упоминания (режим обучения)' },
                { key: 'muted', label: '🔴 Отключён', desc: 'Полностью отключён в этом чате' },
                { key: 'admins', label: '🛡 Только админы', desc: 'Отвечает только администраторам' },
              ].map((m) => (
                <button
                  key={m.key}
                  className={`px-4 py-3 rounded-xl text-left transition-colors ${
                    botMode === m.key
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => { setBotMode(m.key as typeof botMode); markChanged(); }}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className={`text-xs mt-0.5 ${botMode === m.key ? 'text-white/70' : 'text-muted-foreground'}`}>{m.desc}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={Bell} title="Приветствие" color="text-green-400" />
              <Toggle enabled={welcomeEnabled} onToggle={() => { setWelcomeEnabled(!welcomeEnabled); markChanged(); }} />
            </div>
            {welcomeEnabled && (
              <textarea
                value={welcomeMessage}
                onChange={(e) => { setWelcomeMessage(e.target.value); markChanged(); }}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 resize-none"
                placeholder="Добро пожаловать в {chat_name}, {user}!"
              />
            )}
          </Section>
        </div>

        <Section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle icon={Clock} title="Сообщения при неактивности" color="text-yellow-400" />
            <Toggle enabled={inactivityEnabled} onToggle={() => { setInactivityEnabled(!inactivityEnabled); markChanged(); }} />
          </div>
          {inactivityEnabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Через</span>
                <input
                  type="number"
                  value={inactivityHours}
                  onChange={(e) => { setInactivityHours(parseInt(e.target.value) || 24); markChanged(); }}
                  className="w-20 h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-center"
                  min={1}
                  max={168}
                />
                <span className="text-muted-foreground">часов без активности</span>
              </div>
              {inactivityMessages.map((msg, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={msg}
                    onChange={(e) => {
                      const m = [...inactivityMessages];
                      m[i] = e.target.value;
                      setInactivityMessages(m);
                      markChanged();
                    }}
                    className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10"
                    placeholder="Сообщение при неактивности..."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-red-400 hover:text-red-300"
                    onClick={() => {
                      setInactivityMessages(inactivityMessages.filter((_, idx) => idx !== i));
                      markChanged();
                    }}
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-dashed border-white/20"
                onClick={() => { setInactivityMessages([...inactivityMessages, ""]); markChanged(); }}
              >
                <Plus size={16} className="mr-2" />Добавить сообщение
              </Button>
            </div>
          )}
        </Section>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-28 md:bottom-6 right-4 md:right-6 z-50"
        >
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-cortes-mono text-[10px] uppercase tracking-[0.1em] rounded-2xl h-12 px-6">
            {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Check size={16} className="mr-2" />}
            Сохранить изменения
          </Button>
        </motion.div>
      )}
    </div>
  );
}
