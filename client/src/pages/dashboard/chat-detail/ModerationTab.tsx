/**
 * Вкладка "Модерация" - команды модерации и система предупреждений
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Ban, VolumeX, UserMinus, AlertCircle, Flag, Lock, 
  AlertTriangle, MessageSquare, Check, Loader2 
} from "lucide-react";
import { Section, SectionTitle, CommandCard } from "./components";
import { useChatSettings, useUpdateChatSettings } from "@/hooks/use-chats";

interface ModerationTabProps {
  chatId: string;
}

export function ModerationTab({ chatId }: ModerationTabProps) {
  const { data: settings, isLoading } = useChatSettings(chatId);
  const updateSettings = useUpdateChatSettings(chatId);

  const [banEnabled, setBanEnabled] = useState(true);
  const [banMessage, setBanMessage] = useState("");
  const [unbanMessage, setUnbanMessage] = useState("");
  const [muteEnabled, setMuteEnabled] = useState(true);
  const [muteMessage, setMuteMessage] = useState("");
  const [unmuteMessage, setUnmuteMessage] = useState("");
  const [kickEnabled, setKickEnabled] = useState(true);
  const [kickMessage, setKickMessage] = useState("");
  const [warnEnabled, setWarnEnabled] = useState(true);
  const [warnMessage, setWarnMessage] = useState("");
  const [unwarnMessage, setUnwarnMessage] = useState("");
  const [warningsForBan, setWarningsForBan] = useState(3);
  const [banDurationDays, setBanDurationDays] = useState(30);
  const [warningExpireDays, setWarningExpireDays] = useState(14);
  const [autoBanMessage, setAutoBanMessage] = useState("");
  const [reportEnabled, setReportEnabled] = useState(true);
  const [reportMessage, setReportMessage] = useState("");
  const [readOnlyEnabled, setReadOnlyEnabled] = useState(true);
  const [readOnlyMessage, setReadOnlyMessage] = useState("");
  const [readOnlyOffMessage, setReadOnlyOffMessage] = useState("");
  const [showDisabledMessage, setShowDisabledMessage] = useState(true);
  const [disabledCommandMessage, setDisabledCommandMessage] = useState("");
  const [noPermissionMessage, setNoPermissionMessage] = useState("");
  const [banUsageMessage, setBanUsageMessage] = useState("");
  const [muteUsageMessage, setMuteUsageMessage] = useState("");
  const [kickUsageMessage, setKickUsageMessage] = useState("");
  const [warnUsageMessage, setWarnUsageMessage] = useState("");
  const [reportUsageMessage, setReportUsageMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.moderation) {
      const m = settings.moderation;
      setBanEnabled(m.ban_enabled ?? true);
      setBanMessage(m.ban_message || "🚫 Пользователь {user} заблокирован на {duration}.\nПричина: {reason}");
      setUnbanMessage(m.unban_message || "✅ {user} разбанен.");
      setMuteEnabled(m.mute_enabled ?? true);
      setMuteMessage(m.mute_message || "🔇 Пользователь {user} заглушен на {duration}.\nПричина: {reason}");
      setUnmuteMessage(m.unmute_message || "✅ {user} размучен.");
      setKickEnabled(m.kick_enabled ?? true);
      setKickMessage(m.kick_message || "👢 Пользователь {user} удалён из чата.\nПричина: {reason}");
      setWarnEnabled(m.warn_enabled ?? true);
      setWarnMessage(m.warn_message || "⚠️ Пользователь {user} получил предупреждение ({warnings}/{max}).\nПричина: {reason}");
      setUnwarnMessage(m.unwarn_message || "✅ Предупреждение снято с {user}. Осталось: {warnings}/{max}");
      setWarningsForBan(m.warnings_for_ban || 3);
      setBanDurationDays(m.ban_duration_days || 30);
      setWarningExpireDays(m.warning_expire_days || 14);
      setAutoBanMessage(m.auto_ban_message || "🚫 Пользователь {user} заблокирован на {days} дней.\nПричина: превышен лимит предупреждений ({warnings}/{max}).");
      setReportEnabled(m.report_enabled ?? true);
      setReportMessage(m.report_message || "🚨 Жалоба от {user} на {target}.\nСообщение: {message}");
      setReadOnlyEnabled(m.read_only_enabled ?? true);
      setReadOnlyMessage(m.read_only_message || "🔒 Чат переведён в режим только для чтения.");
      setReadOnlyOffMessage(m.read_only_off_message || "🔓 Тихий режим выключен. Все могут писать.");
      setShowDisabledMessage(m.show_disabled_message ?? true);
      setDisabledCommandMessage(m.disabled_command_message || "❌ Эта команда отключена в настройках чата.");
      setNoPermissionMessage(m.no_permission_message || "❌ У вас недостаточно прав для выполнения этой команды.");
      setBanUsageMessage(m.ban_usage_message || "❌ Укажите пользователя: /ban @username [время] [причина]");
      setMuteUsageMessage(m.mute_usage_message || "❌ Укажите пользователя: /mute @username [время] [причина]");
      setKickUsageMessage(m.kick_usage_message || "❌ Укажите пользователя: /kick @username [причина]");
      setWarnUsageMessage(m.warn_usage_message || "❌ Укажите пользователя: /warn @username [причина]");
      setReportUsageMessage(m.report_usage_message || "❌ Ответьте на сообщение нарушителя командой /report [причина]");
      setHasChanges(false);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync({
        moderation: {
          ban_enabled: banEnabled,
          ban_message: banMessage,
          unban_message: unbanMessage,
          mute_enabled: muteEnabled,
          mute_message: muteMessage,
          unmute_message: unmuteMessage,
          kick_enabled: kickEnabled,
          kick_message: kickMessage,
          warn_enabled: warnEnabled,
          warn_message: warnMessage,
          unwarn_message: unwarnMessage,
          warnings_for_ban: warningsForBan,
          ban_duration_days: banDurationDays,
          warning_expire_days: warningExpireDays,
          auto_ban_message: autoBanMessage,
          report_enabled: reportEnabled,
          report_message: reportMessage,
          read_only_enabled: readOnlyEnabled,
          read_only_message: readOnlyMessage,
          read_only_off_message: readOnlyOffMessage,
          show_disabled_message: showDisabledMessage,
          disabled_command_message: disabledCommandMessage,
          no_permission_message: noPermissionMessage,
          ban_usage_message: banUsageMessage,
          mute_usage_message: muteUsageMessage,
          kick_usage_message: kickUsageMessage,
          warn_usage_message: warnUsageMessage,
          report_usage_message: reportUsageMessage,
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
          <SectionTitle icon={Ban} title="Команды модерации" color="text-red-400" />
          <div className="space-y-2">
            <CommandCard icon={Ban} title="/ban" desc="Блокировка пользователей" enabled={banEnabled} onToggle={() => { setBanEnabled(!banEnabled); markChanged(); }} color="text-red-400" message={banMessage} onMessageChange={(v) => { setBanMessage(v); markChanged(); }} vars="{user}, {duration}, {reason}" />
            <CommandCard icon={Ban} title="/unban" desc="Разблокировка пользователей" enabled={banEnabled} onToggle={() => { setBanEnabled(!banEnabled); markChanged(); }} color="text-green-400" message={unbanMessage} onMessageChange={(v) => { setUnbanMessage(v); markChanged(); }} vars="{user}" />
            <CommandCard icon={VolumeX} title="/mute" desc="Заглушение пользователей" enabled={muteEnabled} onToggle={() => { setMuteEnabled(!muteEnabled); markChanged(); }} color="text-orange-400" message={muteMessage} onMessageChange={(v) => { setMuteMessage(v); markChanged(); }} vars="{user}, {duration}, {reason}" />
            <CommandCard icon={VolumeX} title="/unmute" desc="Снятие заглушения" enabled={muteEnabled} onToggle={() => { setMuteEnabled(!muteEnabled); markChanged(); }} color="text-green-400" message={unmuteMessage} onMessageChange={(v) => { setUnmuteMessage(v); markChanged(); }} vars="{user}" />
            <CommandCard icon={UserMinus} title="/kick" desc="Удаление из чата" enabled={kickEnabled} onToggle={() => { setKickEnabled(!kickEnabled); markChanged(); }} color="text-purple-400" message={kickMessage} onMessageChange={(v) => { setKickMessage(v); markChanged(); }} vars="{user}, {reason}" />
            <CommandCard icon={AlertCircle} title="/warn" desc="Выдача предупреждения" enabled={warnEnabled} onToggle={() => { setWarnEnabled(!warnEnabled); markChanged(); }} color="text-yellow-400" message={warnMessage} onMessageChange={(v) => { setWarnMessage(v); markChanged(); }} vars="{user}, {warnings}, {max}, {reason}" />
            <CommandCard icon={AlertCircle} title="/unwarn" desc="Снятие предупреждения" enabled={warnEnabled} onToggle={() => { setWarnEnabled(!warnEnabled); markChanged(); }} color="text-green-400" message={unwarnMessage} onMessageChange={(v) => { setUnwarnMessage(v); markChanged(); }} vars="{user}, {warnings}, {max}" />
            <CommandCard icon={Flag} title="/report" desc="Жалобы на пользователей" enabled={reportEnabled} onToggle={() => { setReportEnabled(!reportEnabled); markChanged(); }} color="text-blue-400" message={reportMessage} onMessageChange={(v) => { setReportMessage(v); markChanged(); }} vars="{user}, {target}, {message}" />
          </div>
          
          {/* Тихий режим - отдельная секция */}
          <div className="mt-4 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="font-medium">Тихий режим</div>
                  <div className="text-xs text-muted-foreground">Только админы могут писать</div>
                </div>
              </div>
              <button onClick={() => { setReadOnlyEnabled(!readOnlyEnabled); markChanged(); }} className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${readOnlyEnabled ? "bg-cyan-500" : "bg-white/20"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${readOnlyEnabled ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Сообщение при включении</label>
                <textarea value={readOnlyMessage} onChange={(e) => { setReadOnlyMessage(e.target.value); markChanged(); }} className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="🔒 Чат переведён в режим только для чтения." />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Сообщение при выключении</label>
                <textarea value={readOnlyOffMessage} onChange={(e) => { setReadOnlyOffMessage(e.target.value); markChanged(); }} className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="🔓 Тихий режим выключен. Все могут писать." />
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <SectionTitle icon={AlertTriangle} title="Система предупреждений" color="text-yellow-400" />
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Предов для бана</label>
                <input type="number" value={warningsForBan} onChange={(e) => { const val = Math.min(10, Math.max(1, parseInt(e.target.value) || 3)); setWarningsForBan(val); markChanged(); }} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-center" min={1} max={10} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Дней бана</label>
                <input type="number" value={banDurationDays} onChange={(e) => { setBanDurationDays(parseInt(e.target.value) || 30); markChanged(); }} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-center" min={1} max={365} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Сгорание предов</label>
                <input type="number" value={warningExpireDays} onChange={(e) => { setWarningExpireDays(parseInt(e.target.value) || 14); markChanged(); }} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-center" min={1} max={365} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Сообщение авто-бана</label>
              <textarea value={autoBanMessage} onChange={(e) => { setAutoBanMessage(e.target.value); markChanged(); }} className="w-full min-h-[60px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="🚫 Пользователь {user} заблокирован..." />
            </div>
          </div>
        </Section>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Section>
          <SectionTitle icon={AlertCircle} title="Сообщения об ошибках" color="text-red-400" />
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Показывать сообщение при отключённой команде</label>
              <button onClick={() => { setShowDisabledMessage(!showDisabledMessage); markChanged(); }} className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${showDisabledMessage ? "bg-primary" : "bg-white/20"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${showDisabledMessage ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Команда отключена</label>
              <textarea value={disabledCommandMessage} onChange={(e) => { setDisabledCommandMessage(e.target.value); markChanged(); }} className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="❌ Эта команда отключена в настройках чата." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Недостаточно прав</label>
              <textarea value={noPermissionMessage} onChange={(e) => { setNoPermissionMessage(e.target.value); markChanged(); }} className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="❌ У вас недостаточно прав для выполнения этой команды." />
            </div>
          </div>
        </Section>

        <Section>
          <SectionTitle icon={MessageSquare} title="Сообщения об использовании команд" color="text-green-400" />
          <p className="text-xs text-muted-foreground mb-3">Показываются когда пользователь не указал цель команды</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">/ban, /unban</label>
              <textarea value={banUsageMessage} onChange={(e) => { setBanUsageMessage(e.target.value); markChanged(); }} className="w-full min-h-[36px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="❌ Укажите пользователя: /ban @username [время] [причина]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">/mute, /unmute</label>
              <textarea value={muteUsageMessage} onChange={(e) => { setMuteUsageMessage(e.target.value); markChanged(); }} className="w-full min-h-[36px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="❌ Укажите пользователя: /mute @username [время] [причина]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">/kick</label>
              <textarea value={kickUsageMessage} onChange={(e) => { setKickUsageMessage(e.target.value); markChanged(); }} className="w-full min-h-[36px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="❌ Укажите пользователя: /kick @username [причина]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">/warn, /unwarn</label>
              <textarea value={warnUsageMessage} onChange={(e) => { setWarnUsageMessage(e.target.value); markChanged(); }} className="w-full min-h-[36px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="❌ Укажите пользователя: /warn @username [причина]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">/report</label>
              <textarea value={reportUsageMessage} onChange={(e) => { setReportUsageMessage(e.target.value); markChanged(); }} className="w-full min-h-[36px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="❌ Ответьте на сообщение нарушителя командой /report [причина]" />
            </div>
          </div>
        </Section>
      </div>

      {hasChanges && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6 z-50">
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25">
            {isSaving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Check size={18} className="mr-2" />}
            Сохранить изменения
          </Button>
        </motion.div>
      )}
    </div>
  );
}
