/**
 * Вкладка "Фильтры" - стоп-слова, триггер-слова, медиа, face-control
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Filter, Link2, Languages, Type, EyeOff, Image, Video, Mic, File, Music, 
  Sticker, BarChart2, Globe, UserCheck, Users, FileText, Plus, X, Edit2, 
  Check, Loader2, Trash2, GripVertical, Eye, MessageSquare 
} from "lucide-react";
import { Section, SectionTitle, Toggle, SettingRow, CollapsibleSection, CommandCard } from "./components";
import { useChatSettings, useUpdateChatSettings } from "@/hooks/use-chats";

interface FiltersTabProps {
  chatId: string;
}

export function FiltersTab({ chatId }: FiltersTabProps) {
  const { data: settings, isLoading } = useChatSettings(chatId);
  const updateSettings = useUpdateChatSettings(chatId);

  // Локальное состояние для фильтров
  const [stopWordsEnabled, setStopWordsEnabled] = useState(false);
  const [stopWords, setStopWords] = useState<string[]>([]);
  const [stopWordMessage, setStopWordMessage] = useState("");
  const [blockChannelPosts, setBlockChannelPosts] = useState(false);
  const [blockedChannels, setBlockedChannels] = useState<string[]>([]);
  const [channelBlockMessage, setChannelBlockMessage] = useState("");
  const [filterArabic, setFilterArabic] = useState(false);
  const [arabicMessage, setArabicMessage] = useState("");
  const [filterChinese, setFilterChinese] = useState(false);
  const [chineseMessage, setChineseMessage] = useState("");
  const [filterZalgo, setFilterZalgo] = useState(false);
  const [zalgoMessage, setZalgoMessage] = useState("");
  const [nsfwFilterEnabled, setNsfwFilterEnabled] = useState(false);
  const [nsfwMessage, setNsfwMessage] = useState("");
  // Триггер-слова
  const [triggerWordsEnabled, setTriggerWordsEnabled] = useState(false);
  const [triggerWords, setTriggerWords] = useState<string[]>([]);
  const [triggerWordsMessage, setTriggerWordsMessage] = useState("");
  const [newTriggerWord, setNewTriggerWord] = useState("");
  // Медиа права
  const [canSendPhotos, setCanSendPhotos] = useState(true);
  const [canSendVideos, setCanSendVideos] = useState(true);
  const [canSendVideoNotes, setCanSendVideoNotes] = useState(true);
  const [canSendVoiceNotes, setCanSendVoiceNotes] = useState(true);
  const [canSendDocuments, setCanSendDocuments] = useState(true);
  const [canSendAudios, setCanSendAudios] = useState(true);
  const [canSendStickers, setCanSendStickers] = useState(true);
  const [canSendPolls, setCanSendPolls] = useState(true);
  const [canSendLinks, setCanSendLinks] = useState(true);

  const [newWord, setNewWord] = useState("");
  const [newChannel, setNewChannel] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Загружаем данные из API
  useEffect(() => {
    if (settings?.filters) {
      const f = settings.filters;
      setStopWordsEnabled(f.stop_words_enabled ?? false);
      setStopWords(f.stop_words || []);
      setStopWordMessage(f.stop_word_message || "⚠️ Сообщение удалено. Причина: запрещённое слово.");
      setBlockChannelPosts(f.block_channel_posts ?? false);
      setBlockedChannels(f.blocked_channels || []);
      setChannelBlockMessage(f.channel_block_message || "⚠️ Репост из этого канала запрещён.");
      setFilterArabic(f.filter_arabic ?? false);
      setArabicMessage(f.arabic_message || "⚠️ {user}, арабские символы запрещены.");
      setFilterChinese(f.filter_chinese ?? false);
      setChineseMessage(f.chinese_message || "⚠️ {user}, китайские символы запрещены.");
      setFilterZalgo(f.filter_zalgo ?? false);
      setZalgoMessage(f.zalgo_message || "⚠️ {user}, zalgo-текст запрещён.");
      setNsfwFilterEnabled(f.nsfw_filter_enabled ?? false);
      setNsfwMessage(f.nsfw_message || "🔞 {user}, NSFW контент запрещён.");
      setTriggerWordsEnabled(f.trigger_words_enabled ?? false);
      setTriggerWords(f.trigger_words || []);
      setTriggerWordsMessage(f.trigger_words_message || "");
    }
    if (settings?.media_permissions) {
      const m = settings.media_permissions;
      setCanSendPhotos(m.can_send_photos ?? true);
      setCanSendVideos(m.can_send_videos ?? true);
      setCanSendVideoNotes(m.can_send_video_notes ?? true);
      setCanSendVoiceNotes(m.can_send_voice_notes ?? true);
      setCanSendDocuments(m.can_send_documents ?? true);
      setCanSendAudios(m.can_send_audios ?? true);
      setCanSendStickers(m.can_send_stickers ?? true);
      setCanSendPolls(m.can_send_polls ?? true);
      setCanSendLinks(m.can_send_links ?? true);
    }
    setHasChanges(false);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync({
        filters: {
          stop_words_enabled: stopWordsEnabled,
          stop_words: stopWords,
          stop_word_message: stopWordMessage,
          block_channel_posts: blockChannelPosts,
          blocked_channels: blockedChannels,
          channel_block_message: channelBlockMessage,
          filter_arabic: filterArabic,
          arabic_message: arabicMessage,
          filter_chinese: filterChinese,
          chinese_message: chineseMessage,
          filter_zalgo: filterZalgo,
          zalgo_message: zalgoMessage,
          block_links: !canSendLinks,
          nsfw_filter_enabled: nsfwFilterEnabled,
          nsfw_message: nsfwMessage,
          trigger_words_enabled: triggerWordsEnabled,
          trigger_words: triggerWords,
          trigger_words_message: triggerWordsMessage,
        },
        media_permissions: {
          can_send_photos: canSendPhotos,
          can_send_videos: canSendVideos,
          can_send_video_notes: canSendVideoNotes,
          can_send_voice_notes: canSendVoiceNotes,
          can_send_documents: canSendDocuments,
          can_send_audios: canSendAudios,
          can_send_stickers: canSendStickers,
          can_send_polls: canSendPolls,
          can_send_links: canSendLinks,
        }
      });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const markChanged = () => setHasChanges(true);

  const addStopWord = () => {
    if (!newWord.trim()) return;
    // Разбиваем по запятой и добавляем все слова
    const words = newWord
      .split(',')
      .map(w => w.trim().toLowerCase())
      .filter(w => w && !stopWords.includes(w));
    if (words.length > 0) {
      setStopWords([...stopWords, ...words]);
      setNewWord("");
      markChanged();
    }
  };

  const removeStopWord = (idx: number) => {
    setStopWords(stopWords.filter((_, i) => i !== idx));
    markChanged();
  };

  const addTriggerWords = () => {
    if (!newTriggerWord.trim()) return;
    const words = newTriggerWord
      .split(',')
      .map(w => w.trim().toLowerCase())
      .filter(w => w && !triggerWords.includes(w));
    if (words.length > 0) {
      setTriggerWords([...triggerWords, ...words]);
      setNewTriggerWord("");
      markChanged();
    }
  };

  const removeTriggerWord = (idx: number) => {
    setTriggerWords(triggerWords.filter((_, i) => i !== idx));
    markChanged();
  };

  const addChannel = () => {
    const channel = newChannel.startsWith("@") ? newChannel : `@${newChannel}`;
    if (newChannel && !blockedChannels.includes(channel)) {
      setBlockedChannels([...blockedChannels, channel]);
      setNewChannel("");
      markChanged();
    }
  };

  const removeChannel = (idx: number) => {
    setBlockedChannels(blockedChannels.filter((_, i) => i !== idx));
    markChanged();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <CollapsibleSection icon={Filter} title="Стоп-слова" color="text-red-400" enabled={stopWordsEnabled} onToggle={() => { setStopWordsEnabled(!stopWordsEnabled); markChanged(); }}>
          <div className="flex flex-wrap gap-2 mb-3">
            {stopWords.map((w, i) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-red-400/10 text-red-400 text-sm flex items-center gap-1.5">
                {w}
                <button onClick={() => removeStopWord(i)} className="hover:text-red-300"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input value={newWord} onChange={(e) => setNewWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addStopWord()} placeholder="Слова через запятую..." className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" />
            <Button size="sm" onClick={addStopWord}><Plus size={14} /></Button>
          </div>
          <input value={stopWordMessage} onChange={(e) => { setStopWordMessage(e.target.value); markChanged(); }} placeholder="Сообщение при удалении" className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" />
        </CollapsibleSection>

        <CollapsibleSection icon={Link2} title="Фильтр каналов" color="text-orange-400" enabled={blockChannelPosts} onToggle={() => { setBlockChannelPosts(!blockChannelPosts); markChanged(); }}>
          <div className="flex flex-wrap gap-2 mb-3">
            {blockedChannels.map((c, i) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-orange-400/10 text-orange-400 text-sm flex items-center gap-1.5">
                {c}
                <button onClick={() => removeChannel(i)} className="hover:text-orange-300"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input value={newChannel} onChange={(e) => setNewChannel(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addChannel()} placeholder="@channel_name" className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" />
            <Button size="sm" onClick={addChannel}><Plus size={14} /></Button>
          </div>
          <input value={channelBlockMessage} onChange={(e) => { setChannelBlockMessage(e.target.value); markChanged(); }} placeholder="Сообщение при блокировке" className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" />
        </CollapsibleSection>

        <CollapsibleSection icon={MessageSquare} title="Триггер-слова" color="text-purple-400" enabled={triggerWordsEnabled} onToggle={() => { setTriggerWordsEnabled(!triggerWordsEnabled); markChanged(); }} className="lg:col-span-2">
          <p className="text-xs text-muted-foreground mb-2">Бот отправит сообщение при упоминании этих слов/фраз</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {triggerWords.map((w, i) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-purple-400/10 text-purple-400 text-sm flex items-center gap-1.5">
                {w}
                <button onClick={() => removeTriggerWord(i)} className="hover:text-purple-300"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <input value={newTriggerWord} onChange={(e) => setNewTriggerWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTriggerWords()} placeholder="Слова через запятую..." className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" />
              <Button size="sm" onClick={addTriggerWords}><Plus size={14} /></Button>
            </div>
            <textarea value={triggerWordsMessage} onChange={(e) => { setTriggerWordsMessage(e.target.value); markChanged(); }} placeholder="Сообщение. Переменные: {user}, {word}" className="w-full h-9 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm resize-none" />
          </div>
        </CollapsibleSection>

        <Section>
          <SectionTitle icon={Languages} title="Фильтр текста" color="text-cyan-400" />
          <div className="space-y-2">
            <CommandCard icon={Type} title="Арабские символы" desc="Блокировать арабский текст" enabled={filterArabic} onToggle={() => { setFilterArabic(!filterArabic); markChanged(); }} color="text-cyan-400" message={arabicMessage} onMessageChange={(v) => { setArabicMessage(v); markChanged(); }} vars="{username}, {name}" />
            <CommandCard icon={Type} title="Китайские символы" desc="Блокировать китайский текст" enabled={filterChinese} onToggle={() => { setFilterChinese(!filterChinese); markChanged(); }} color="text-cyan-400" message={chineseMessage} onMessageChange={(v) => { setChineseMessage(v); markChanged(); }} vars="{username}, {name}" />
            <CommandCard icon={Type} title="Zalgo текст" desc="Блокировать искажённый текст" enabled={filterZalgo} onToggle={() => { setFilterZalgo(!filterZalgo); markChanged(); }} color="text-cyan-400" message={zalgoMessage} onMessageChange={(v) => { setZalgoMessage(v); markChanged(); }} vars="{username}, {name}" />
          </div>
        </Section>

        <Section>
          <SectionTitle icon={EyeOff} title="NSFW фильтр" color="text-pink-400" />
          <div className="space-y-2">
            <CommandCard icon={EyeOff} title="NSFW контент" desc="Блокировать откровенный контент" enabled={nsfwFilterEnabled} onToggle={() => { setNsfwFilterEnabled(!nsfwFilterEnabled); markChanged(); }} color="text-pink-400" message={nsfwMessage} onMessageChange={(v) => { setNsfwMessage(v); markChanged(); }} vars="{username}, {name}" />
          </div>
        </Section>

        <Section className="lg:col-span-2">
          <SectionTitle icon={Image} title="Разрешения медиа" color="text-blue-400" />
          <p className="text-sm text-muted-foreground mb-4">Выберите, какой контент могут отправлять участники</p>
          <div className="grid md:grid-cols-3 gap-2">
            <SettingRow icon={Image} title="Фото" desc="Изображения" enabled={canSendPhotos} onToggle={() => { setCanSendPhotos(!canSendPhotos); markChanged(); }} color="text-green-400" />
            <SettingRow icon={Video} title="Видео" desc="Видеофайлы" enabled={canSendVideos} onToggle={() => { setCanSendVideos(!canSendVideos); markChanged(); }} color="text-blue-400" />
            <SettingRow icon={Video} title="Кружки" desc="Видео-кружки" enabled={canSendVideoNotes} onToggle={() => { setCanSendVideoNotes(!canSendVideoNotes); markChanged(); }} color="text-purple-400" />
            <SettingRow icon={Mic} title="Голосовые" desc="Голосовые сообщения" enabled={canSendVoiceNotes} onToggle={() => { setCanSendVoiceNotes(!canSendVoiceNotes); markChanged(); }} color="text-orange-400" />
            <SettingRow icon={File} title="Файлы" desc="Документы" enabled={canSendDocuments} onToggle={() => { setCanSendDocuments(!canSendDocuments); markChanged(); }} color="text-yellow-400" />
            <SettingRow icon={Music} title="Музыка" desc="Аудиофайлы" enabled={canSendAudios} onToggle={() => { setCanSendAudios(!canSendAudios); markChanged(); }} color="text-pink-400" />
            <SettingRow icon={Sticker} title="Стикеры" desc="Стикеры и GIF" enabled={canSendStickers} onToggle={() => { setCanSendStickers(!canSendStickers); markChanged(); }} color="text-cyan-400" />
            <SettingRow icon={BarChart2} title="Опросы" desc="Голосования" enabled={canSendPolls} onToggle={() => { setCanSendPolls(!canSendPolls); markChanged(); }} color="text-indigo-400" />
            <SettingRow icon={Globe} title="Ссылки" desc="Превью ссылок" enabled={canSendLinks} onToggle={() => { setCanSendLinks(!canSendLinks); markChanged(); }} color="text-teal-400" />
          </div>
        </Section>

        {/* Face Control */}
        <FaceControlSection chatId={chatId} onChangesMade={markChanged} />
      </div>

      {/* Плавающая кнопка сохранения */}
      {hasChanges && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="fixed bottom-6 right-6 z-50"
        >
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25">
            {isSaving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Check size={18} className="mr-2" />}
            Сохранить изменения
          </Button>
        </motion.div>
      )}
    </div>
  );
}


function FaceControlSection({ chatId, onChangesMade }: { chatId: string; onChangesMade: () => void }) {
  const { data: settings } = useChatSettings(chatId);
  const updateSettings = useUpdateChatSettings(chatId);

  const [faceControlEnabled, setFaceControlEnabled] = useState(false);
  const [requireAvatar, setRequireAvatar] = useState(false);
  const [requireUsername, setRequireUsername] = useState(false);
  const [minNameLength, setMinNameLength] = useState(2);
  const [nsfwAvatarCheck, setNsfwAvatarCheck] = useState(false);
  const [questionnaireEnabled, setQuestionnaireEnabled] = useState(false);
  const [questionnaireIntro, setQuestionnaireIntro] = useState("");
  const [questionnaireSuccess, setQuestionnaireSuccess] = useState("");
  const [questionnaireQuestions, setQuestionnaireQuestions] = useState<Array<{id: number; text: string; required: boolean; order: number}>>([]);
  const [notifyChatId, setNotifyChatId] = useState<string>("");
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Загружаем данные из API
  useEffect(() => {
    if (settings?.face_control) {
      const fc = settings.face_control;
      setFaceControlEnabled(fc.enabled ?? false);
      setRequireAvatar(fc.require_avatar ?? false);
      setRequireUsername(fc.require_username ?? false);
      setMinNameLength(fc.min_name_length ?? 2);
      setNsfwAvatarCheck(fc.nsfw_avatar_check ?? false);
      setQuestionnaireEnabled(fc.questionnaire_enabled ?? false);
      setQuestionnaireIntro(fc.questionnaire_intro || "Ответьте на вопросы для вступления в чат");
      setQuestionnaireSuccess(fc.questionnaire_success || "Добро пожаловать!");
      setQuestionnaireQuestions(fc.questionnaire_questions || []);
      setNotifyChatId(fc.notify_chat_id ? String(fc.notify_chat_id) : "");
      setHasLocalChanges(false);
    }
  }, [settings]);

  const markChanged = () => {
    setHasLocalChanges(true);
    onChangesMade();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync({
        face_control: {
          enabled: faceControlEnabled,
          require_avatar: requireAvatar,
          require_username: requireUsername,
          min_name_length: minNameLength,
          nsfw_avatar_check: nsfwAvatarCheck,
          questionnaire_enabled: questionnaireEnabled,
          questionnaire_intro: questionnaireIntro,
          questionnaire_success: questionnaireSuccess,
          questionnaire_questions: questionnaireQuestions,
          notify_chat_id: notifyChatId ? parseInt(notifyChatId) : null,
        }
      });
      setHasLocalChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-4">
      {hasLocalChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="bg-green-500 hover:bg-green-600">
            {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Check size={16} className="mr-2" />}
            Сохранить Face Control
          </Button>
        </div>
      )}
      
      <CollapsibleSection icon={UserCheck} title="Face-контроль" color="text-green-400" enabled={faceControlEnabled} onToggle={() => { setFaceControlEnabled(!faceControlEnabled); markChanged(); }} className="lg:col-span-2">
        <div className="grid lg:grid-cols-2 gap-2 mb-4">
          <SettingRow icon={Image} title="Требовать аватар" desc="Аватар обязателен" enabled={requireAvatar} onToggle={() => { setRequireAvatar(!requireAvatar); markChanged(); }} color="text-green-400" />
          <SettingRow icon={EyeOff} title="NSFW аватар" desc="Проверка аватара" enabled={nsfwAvatarCheck} onToggle={() => { setNsfwAvatarCheck(!nsfwAvatarCheck); markChanged(); }} color="text-pink-400" />
          <SettingRow icon={Users} title="Username" desc="@username обязателен" enabled={requireUsername} onToggle={() => { setRequireUsername(!requireUsername); markChanged(); }} color="text-green-400" />
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-green-400"><FileText size={14} /></div>
              <div><p className="font-medium text-sm">Мин. длина имени</p></div>
            </div>
            <input type="number" value={minNameLength} onChange={(e) => { setMinNameLength(parseInt(e.target.value) || 2); markChanged(); }} className="w-14 h-8 px-2 rounded-lg bg-white/5 border border-white/10 text-center text-sm" min={1} max={64} />
          </div>
        </div>

        {/* Анкета */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400"><FileText size={18} /></div>
              <div>
                <p className="font-medium">Анкета при вступлении</p>
                <p className="text-sm text-muted-foreground">{questionnaireQuestions.length} вопросов</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {questionnaireEnabled && (
                <Button variant="outline" size="sm" onClick={() => setShowQuestionnaireModal(true)}>
                  <Edit2 size={14} className="mr-2" />Настроить
                </Button>
              )}
              <Toggle enabled={questionnaireEnabled} onToggle={() => { setQuestionnaireEnabled(!questionnaireEnabled); markChanged(); }} />
            </div>
          </div>
          
          {questionnaireEnabled && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Вступительное сообщение</label>
                <textarea 
                  value={questionnaireIntro} 
                  onChange={(e) => { setQuestionnaireIntro(e.target.value); markChanged(); }} 
                  className="w-full min-h-[60px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 resize-y text-sm" 
                  placeholder="Ответьте на вопросы для вступления в чат"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Сообщение при успешном прохождении</label>
                <input 
                  value={questionnaireSuccess} 
                  onChange={(e) => { setQuestionnaireSuccess(e.target.value); markChanged(); }} 
                  className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" 
                  placeholder="Добро пожаловать!"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">ID чата/пользователя для уведомлений о заявках</label>
                <input 
                  value={notifyChatId} 
                  onChange={(e) => { setNotifyChatId(e.target.value); markChanged(); }} 
                  className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm" 
                  placeholder="-1001234567890 или 123456789"
                />
                <p className="text-xs text-muted-foreground mt-1">Укажите ID чата или пользователя, куда будут приходить заявки на модерацию</p>
              </div>
            </div>
          )}
        </div>

        {/* Модальное окно анкеты */}
        <QuestionnaireModal 
          isOpen={showQuestionnaireModal} 
          onClose={() => setShowQuestionnaireModal(false)} 
          questions={questionnaireQuestions}
          intro={questionnaireIntro}
          success={questionnaireSuccess}
          onSave={(data) => { 
            setQuestionnaireQuestions(data.questions.map((q, i) => ({ id: q.id, text: q.text, required: q.required, order: i }))); 
            setQuestionnaireIntro(data.intro);
            setQuestionnaireSuccess(data.success);
            markChanged(); 
          }} 
        />
      </CollapsibleSection>
    </div>
  );
}


interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Array<{id: number; text: string; required: boolean}>;
  intro: string;
  success: string;
  onSave: (data: { questions: Array<{id: number; text: string; required: boolean}>; intro: string; success: string }) => void;
}

function QuestionnaireModal({ isOpen, onClose, questions, intro, success, onSave }: QuestionnaireModalProps) {
  const [localQuestions, setLocalQuestions] = useState(questions);
  const [localIntro, setLocalIntro] = useState(intro);
  const [localSuccess, setLocalSuccess] = useState(success);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    setLocalQuestions(questions);
    setLocalIntro(intro);
    setLocalSuccess(success);
  }, [questions, intro, success, isOpen]);

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDragEnd = () => {
    if (draggedIdx !== null && dragOverIdx !== null && draggedIdx !== dragOverIdx) {
      const items = [...localQuestions];
      const [removed] = items.splice(draggedIdx, 1);
      items.splice(dragOverIdx, 0, removed);
      setLocalQuestions(items);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold flex items-center gap-3"><FileText size={24} className="text-blue-400" />Конструктор анкеты</h2>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white"><X size={24} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Приветствие */}
          <div>
            <label className="text-base font-medium mb-3 block">Приветственное сообщение</label>
            <textarea value={localIntro} onChange={(e) => setLocalIntro(e.target.value)} rows={3} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-base resize-none" placeholder="Сообщение перед первым вопросом..." />
          </div>

          {/* Вопросы */}
          <div>
            <label className="text-base font-medium mb-3 block">Вопросы (перетащите для изменения порядка)</label>
            <div className="space-y-3">
              {localQuestions.map((q, i) => (
                <div 
                  key={q.id} 
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 rounded-2xl border group transition-all cursor-move ${
                    draggedIdx === i ? "opacity-50 bg-primary/10 border-primary/30" : 
                    dragOverIdx === i ? "bg-primary/5 border-primary/20" : 
                    "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <GripVertical size={22} className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
                  <span className="w-10 h-10 rounded-full bg-primary/20 text-primary text-base flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                  <input 
                    value={q.text} 
                    onChange={(e) => {
                      const updated = [...localQuestions];
                      updated[i] = { ...updated[i], text: e.target.value };
                      setLocalQuestions(updated);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-base focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    placeholder="Текст вопроса..."
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = [...localQuestions];
                      updated[i] = { ...updated[i], required: !updated[i].required };
                      setLocalQuestions(updated);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors shrink-0 ${q.required ? "bg-red-400/20 text-red-400" : "bg-white/10 text-muted-foreground hover:text-white"}`}
                  >
                    {q.required ? "Обязательный" : "Опциональный"}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setLocalQuestions(localQuestions.filter((_, idx) => idx !== i)); }}
                    className="p-2.5 rounded-xl hover:bg-red-400/20 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => setLocalQuestions([...localQuestions, { id: Date.now(), text: "", required: false }])}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Plus size={20} />Добавить вопрос
              </button>
            </div>
          </div>

          {/* Сообщение после */}
          <div>
            <label className="text-base font-medium mb-3 block">Сообщение после заполнения</label>
            <textarea value={localSuccess} onChange={(e) => setLocalSuccess(e.target.value)} rows={3} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-base resize-none" placeholder="Сообщение после ответа на все вопросы..." />
          </div>

          {/* Превью */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-400/10 to-primary/10 border border-blue-400/20">
            <p className="text-base text-blue-400 mb-4 font-medium flex items-center gap-2"><Eye size={20} />Превью диалога</p>
            <div className="space-y-4 text-base">
              <div className="flex gap-3">
                <span className="text-2xl">🤖</span>
                <p className="flex-1 p-3 rounded-xl bg-white/5">{localIntro || "Приветствие..."}</p>
              </div>
              {localQuestions.map((q, i) => (
                <div key={q.id} className="space-y-3 pl-8 border-l-2 border-white/10">
                  <div className="flex gap-3">
                    <span className="text-2xl">🤖</span>
                    <p className="flex-1 p-3 rounded-xl bg-white/5">{q.text || `Вопрос ${i + 1}`} {q.required && <span className="text-red-400">*</span>}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">👤</span>
                    <p className="flex-1 p-3 rounded-xl bg-primary/10 text-primary/70 italic">Ответ пользователя...</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <span className="text-2xl">🤖</span>
                <p className="flex-1 p-3 rounded-xl bg-white/5">{localSuccess || "Завершение..."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
          <Button variant="outline" size="lg" onClick={onClose}>Отмена</Button>
          <Button size="lg" onClick={() => { onSave({ questions: localQuestions, intro: localIntro, success: localSuccess }); onClose(); }}>Сохранить</Button>
        </div>
      </motion.div>
    </div>
  );
}
