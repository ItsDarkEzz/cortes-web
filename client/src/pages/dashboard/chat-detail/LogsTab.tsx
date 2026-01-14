/**
 * Вкладка "Журнал" - логи модерации, сообщений и настроек
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Ban, VolumeX, UserMinus, AlertCircle, Flag, Lock,
  AlertTriangle, MessageSquare, Check, Loader2, Trash2,
  Crown, Filter, ExternalLink, Reply, UserCheck, FileText, Settings, ChevronLeft, ChevronRight
} from "lucide-react";
import { useChatLogs, useChatMessages, useChatSettingsLogs } from "@/hooks/use-chats";

interface LogsTabProps {
  chatId: string;
}

const logColors: Record<string, string> = {
  ban: "text-red-400 bg-red-400/10",
  mute: "text-orange-400 bg-orange-400/10",
  warn: "text-yellow-400 bg-yellow-400/10",
  kick: "text-purple-400 bg-purple-400/10",
  delete: "text-blue-400 bg-blue-400/10",
  role: "text-green-400 bg-green-400/10",
  filter: "text-pink-400 bg-pink-400/10",
  face_control_pass: "text-green-400 bg-green-400/10",
  face_control_decline: "text-red-400 bg-red-400/10",
  face_control_info: "text-blue-400 bg-blue-400/10"
};

const actionLabels: Record<string, string> = {
  ban: "Бан", unban: "Разбан", mute: "Мут", unmute: "Размут",
  warn: "Предупреждение", unwarn: "Снятие предупреждения", kick: "Кик",
  delete: "Удаление", read_only_on: "Тихий режим вкл", read_only_off: "Тихий режим выкл",
  filter_trigger: "Сработал фильтр", role_change: "Смена роли",
  face_control_pass: "Face Control: принят",
  face_control_decline: "Face Control: отклонён",
  face_control_questionnaire_start: "Face Control: анкета"
};

const filterLabels: Record<string, string> = {
  stop_word: "Стоп-слово", media: "Медиа", symbols: "Символы",
  arabic: "Арабские", chinese: "Китайские", zalgo: "Zalgo", nsfw: "NSFW"
};

const sectionLabels: Record<string, string> = {
  bot: "Бот", moderation: "Модерация", filters: "Фильтры",
  face_control: "Face-контроль", media_permissions: "Медиа"
};

const messageTypeLabels: Record<string, string> = {
  text: "Текст", photo: "📷 Фото", video: "🎬 Видео", video_note: "🔵 Кружок",
  voice: "🎤 Голосовое", audio: "🎵 Аудио", document: "📄 Документ",
  sticker: "🎨 Стикер", animation: "🎞 GIF", poll: "📊 Опрос"
};

function Pagination({ pagination, page, setPage }: { pagination: any; page: number; setPage: (p: number) => void }) {
  if (!pagination || pagination.pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="border-white/10">
        <ChevronLeft size={16} />
      </Button>
      <span className="text-sm text-muted-foreground px-3">{page} / {pagination.pages}</span>
      <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="border-white/10">
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}

export function LogsTab({ chatId }: LogsTabProps) {
  const [tab, setTab] = useState<"actions" | "messages" | "settings">("actions");
  const [logsPage, setLogsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [settingsPage, setSettingsPage] = useState(1);

  const { data: logsData, isLoading: logsLoading } = useChatLogs(chatId, { limit: 20, page: logsPage });
  const { data: messagesData, isLoading: messagesLoading } = useChatMessages(chatId, { limit: 20, page: messagesPage });
  const { data: settingsLogsData, isLoading: settingsLogsLoading } = useChatSettingsLogs(chatId, { limit: 20, page: settingsPage });

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getTelegramLink = (messageId: number | undefined) => {
    if (!messageId) return null;
    const linkChatId = chatId.startsWith('-100') ? chatId.slice(4) : chatId.replace('-', '');
    return `https://t.me/c/${linkChatId}/${messageId}`;
  };

  const logs = logsData?.logs || [];
  const messages = messagesData?.messages || [];
  const settingsLogs = settingsLogsData?.logs || [];

  const renderLogDetails = (log: typeof logs[0]) => {
    const details: string[] = [];
    if (log.filter_type) details.push(filterLabels[log.filter_type] || log.filter_type);
    if (log.matched_content && log.filter_type !== log.matched_content) details.push(`"${log.matched_content}"`);
    if (log.warning_count !== undefined && log.warning_limit !== undefined) details.push(`${log.warning_count}/${log.warning_limit}`);
    if (log.duration) details.push(log.duration);
    if (log.old_role && log.new_role) details.push(`${log.old_role} → ${log.new_role}`);
    if (log.message_id) details.push(`#${log.message_id}`);
    return details.length > 0 ? details.join(' • ') : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-white/5">
        <button onClick={() => setTab("actions")} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors text-sm ${tab === "actions" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>Модерация</button>
        <button onClick={() => setTab("messages")} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors text-sm ${tab === "messages" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>Сообщения</button>
        <button onClick={() => setTab("settings")} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors text-sm ${tab === "settings" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}>Настройки</button>
      </div>

      {tab === "actions" ? (
        logsLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Нет записей о действиях модераторов</div>
        ) : (
          <>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${logColors[log.type] || "text-gray-400 bg-gray-400/10"}`}>
                      {log.type === "ban" && <Ban size={18} />}
                      {log.type === "mute" && <VolumeX size={18} />}
                      {log.type === "warn" && <AlertCircle size={18} />}
                      {log.type === "kick" && <UserMinus size={18} />}
                      {log.type === "delete" && <Trash2 size={18} />}
                      {log.type === "role" && <Crown size={18} />}
                      {log.type === "filter" && <Filter size={18} />}
                      {log.type === "face_control_pass" && <UserCheck size={18} />}
                      {log.type === "face_control_decline" && <UserMinus size={18} />}
                      {log.type === "face_control_info" && <FileText size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {actionLabels[log.action] || log.action}
                        {log.target_name && log.target_name !== "—" && <span className="text-primary ml-1">{log.target_name}</span>}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{log.by_name}{log.reason && ` • ${log.reason}`}</p>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">{formatTime(log.created_at)}</span>
                  </div>
                  {renderLogDetails(log) && <div className="mt-2 pt-2 border-t border-white/5 text-xs text-muted-foreground">{renderLogDetails(log)}</div>}
                </div>
              ))}
            </div>
            <Pagination pagination={logsData?.pagination} page={logsPage} setPage={setLogsPage} />
          </>
        )
      ) : tab === "messages" ? (
        messagesLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Нет сообщений</div>
        ) : (
          <>
            <div className="space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-xl ${msg.deleted ? "bg-red-500/5 border border-red-500/20" : "bg-white/5 border border-white/10"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">{msg.user_name}</span>
                      {msg.message_type && msg.message_type !== "text" && (
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-muted-foreground">{messageTypeLabels[msg.message_type] || msg.message_type}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{formatTime(msg.created_at)}</span>
                      {msg.telegram_message_id && (
                        <a href={getTelegramLink(msg.telegram_message_id) || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80" title="Открыть в Telegram">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  {msg.reply_to_user_name && (
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Reply size={12} /><span>Ответ на сообщение</span><span className="text-primary">{msg.reply_to_user_name}</span>
                    </div>
                  )}
                  <p className={msg.deleted ? "text-red-400 italic" : ""}>{msg.deleted ? "[удалено]" : (msg.text || `[${messageTypeLabels[msg.message_type] || msg.message_type}]`)}</p>
                  {msg.deleted && msg.deleted_reason && <p className="text-sm text-red-400/70 mt-2 flex items-center gap-2"><Trash2 size={14} />{msg.deleted_reason}</p>}
                </div>
              ))}
            </div>
            <Pagination pagination={messagesData?.pagination} page={messagesPage} setPage={setMessagesPage} />
          </>
        )
      ) : (
        settingsLogsLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : settingsLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Нет записей об изменениях настроек</div>
        ) : (
          <>
            <div className="space-y-2">
              {settingsLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Settings size={14} className="text-primary" />
                      <span className="font-medium">{sectionLabels[log.section] || log.section}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{log.field_name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatTime(log.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-400 line-through">{log.old_value || "—"}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-green-400">{log.new_value || "—"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Изменил: {log.user_name}</p>
                </div>
              ))}
            </div>
            <Pagination pagination={settingsLogsData?.pagination} page={settingsPage} setPage={setSettingsPage} />
          </>
        )
      )}
    </div>
  );
}
