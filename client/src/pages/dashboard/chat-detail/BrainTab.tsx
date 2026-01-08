/**
 * Вкладка "Мозг" - инструкции, память и мнения бота
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Brain, Edit2, Check, Loader2, 
  MessageSquare, Plus, Trash2, Zap
} from "lucide-react";
import { Section, SectionTitle } from "./components";
import { 
  useChatBrain, useUpdateChatBrain, 
  useChatOpinions, useCreateOpinion, useUpdateOpinion, useDeleteOpinion 
} from "@/hooks/use-chats";
import type { Opinion } from "@/lib/api";

interface BrainTabProps {
  chatId: string;
}

export function BrainTab({ chatId }: BrainTabProps) {
  const { data: brainData, isLoading } = useChatBrain(chatId);
  const updateBrain = useUpdateChatBrain(chatId);
  const [instructions, setInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (brainData?.instructions !== undefined) {
      setInstructions(brainData.instructions || "");
      setHasChanges(false);
    }
  }, [brainData?.instructions]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBrain.mutateAsync(instructions);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save instructions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Память — компактная полоса */}
      <div className="flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Память</p>
            <p className="font-semibold">{brainData?.memory_entries || 0} записей</p>
          </div>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div>
          <p className="text-xs text-muted-foreground">Сообщений</p>
          <p className="font-semibold">{brainData?.total_messages_processed?.toLocaleString() || "0"}</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div>
          <p className="text-xs text-muted-foreground">Статус</p>
          <p className="font-semibold text-green-400">● Активен</p>
        </div>
      </div>

      {/* Инструкции */}
      <Section>
        <SectionTitle icon={Edit2} title="Инструкции" color="text-yellow-400" />
        <p className="text-sm text-muted-foreground mb-3">
          Как Cortes должен вести себя в этом чате
        </p>
        <textarea 
          value={instructions}
          onChange={(e) => { setInstructions(e.target.value); setHasChanges(true); }}
          placeholder="Например: Будь более формальным, избегай шуток, фокусируйся на технических темах..." 
          rows={3} 
          maxLength={4096}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/30 text-sm" 
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{instructions.length} / 4096</span>
          {hasChanges && (
            <Button onClick={handleSave} disabled={isSaving} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              {isSaving ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Check size={14} className="mr-1" />}
              Сохранить
            </Button>
          )}
        </div>
      </Section>

      {/* Мнения */}
      <OpinionsSection chatId={chatId} />
    </div>
  );
}


// ============== Opinions Section ==============

function OpinionsSection({ chatId }: { chatId: string }) {
  const { data: opinionsData, isLoading } = useChatOpinions(chatId);
  const createOpinion = useCreateOpinion(chatId);
  const updateOpinion = useUpdateOpinion(chatId);
  const deleteOpinion = useDeleteOpinion(chatId);
  
  const [editingOpinion, setEditingOpinion] = useState<Opinion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [form, setForm] = useState({
    topic: "",
    stance: "",
    reasoning: "",
    strength: 7,
    can_change: true,
  });

  const resetForm = () => {
    setForm({ topic: "", stance: "", reasoning: "", strength: 7, can_change: true });
    setEditingOpinion(null);
    setIsCreating(false);
  };

  const handleCreate = async () => {
    if (!form.topic.trim() || !form.stance.trim()) return;
    try {
      await createOpinion.mutateAsync(form);
      resetForm();
    } catch (error) {
      console.error("Failed to create opinion:", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingOpinion || editingOpinion.id < 0) {
      // Создаём новое (переопределение дефолтного)
      await handleCreate();
      return;
    }
    try {
      await updateOpinion.mutateAsync({ 
        opinionId: editingOpinion.id, 
        data: { stance: form.stance, reasoning: form.reasoning, strength: form.strength, can_change: form.can_change } 
      });
      resetForm();
    } catch (error) {
      console.error("Failed to update opinion:", error);
    }
  };

  const handleEdit = (opinion: Opinion) => {
    setForm({
      topic: opinion.topic,
      stance: opinion.stance,
      reasoning: opinion.reasoning,
      strength: opinion.strength,
      can_change: opinion.can_change,
    });
    setEditingOpinion(opinion);
    setIsCreating(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOpinion.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete opinion:", error);
    }
  };

  const opinions = opinionsData?.opinions || [];
  const customOpinions = opinions.filter(o => !o.is_default);
  const defaultOpinions = opinions.filter(o => o.is_default);
  const isFormOpen = isCreating || editingOpinion !== null;

  return (
    <Section>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle icon={MessageSquare} title="Мнения" color="text-purple-400" />
        {!isFormOpen && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { resetForm(); setIsCreating(true); }}
            className="gap-1.5 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <Plus size={14} />Новое мнение
          </Button>
        )}
      </div>

      {/* Форма */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-purple-400" />
                <span className="font-medium text-sm">
                  {editingOpinion ? (editingOpinion.is_default ? "Переопределить мнение" : "Редактировать") : "Новое мнение"}
                </span>
              </div>
              
              {(isCreating || editingOpinion?.is_default) && (
                <input
                  type="text"
                  placeholder="Тема (музыка, спорт, технологии...)"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-black/20 border border-white/10 text-sm focus:outline-none focus:border-purple-500/50"
                />
              )}
              
              <input
                type="text"
                placeholder="Позиция — что думает Cortes"
                value={form.stance}
                onChange={(e) => setForm({ ...form, stance: e.target.value })}
                className="w-full h-9 px-3 rounded-lg bg-black/20 border border-white/10 text-sm focus:outline-none focus:border-purple-500/50"
              />
              
              <textarea
                placeholder="Почему так считает (обоснование)"
                value={form.reasoning}
                onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 resize-none text-sm focus:outline-none focus:border-purple-500/50"
              />
              
              {/* Сила убеждения — кнопки выбора */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Сила убеждения</p>
                <div className="flex gap-1.5">
                  {[
                    { value: 3, label: "Слабое", color: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30" },
                    { value: 5, label: "Умеренное", color: "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30" },
                    { value: 7, label: "Сильное", color: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30" },
                    { value: 9, label: "Твёрдое", color: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, strength: opt.value })}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                        form.strength === opt.value 
                          ? opt.color + " ring-1 ring-white/20" 
                          : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Может измениться — сегментированный переключатель */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">При хороших аргументах</p>
                <div className="flex rounded-lg bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, can_change: false })}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      !form.can_change 
                        ? "bg-red-500/20 text-red-400" 
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <span>Не изменит мнение</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, can_change: true })}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      form.can_change 
                        ? "bg-green-500/20 text-green-400" 
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <span>Может передумать</span>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={resetForm}>Отмена</Button>
                <Button 
                  size="sm" 
                  onClick={handleUpdate}
                  disabled={createOpinion.isPending || updateOpinion.isPending || !form.stance.trim()}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {(createOpinion.isPending || updateOpinion.isPending) && <Loader2 size={14} className="mr-1 animate-spin" />}
                  Сохранить
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Список мнений */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
        </div>
      ) : opinions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-purple-500/10 flex items-center justify-center">
            <MessageSquare size={24} className="text-purple-400/50" />
          </div>
          <p className="text-sm text-muted-foreground">У Cortes пока нет мнений для этого чата</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Добавьте первое, чтобы задать характер</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Кастомные */}
          {customOpinions.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-2">Настроенные</p>
              <div className="grid gap-2">
                {customOpinions.map((op) => (
                  <OpinionCard key={op.id} opinion={op} onEdit={() => handleEdit(op)} onDelete={() => handleDelete(op.id)} isDeleting={deleteOpinion.isPending} />
                ))}
              </div>
            </div>
          )}
          
          {/* Дефолтные */}
          {defaultOpinions.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Базовые</p>
              <div className="flex flex-wrap gap-2">
                {defaultOpinions.map((op) => (
                  <DefaultOpinionChip key={op.topic} opinion={op} onOverride={() => handleEdit(op)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}


// ============== Opinion Card (для кастомных) ==============

interface OpinionCardProps {
  opinion: Opinion;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function OpinionCard({ opinion, onEdit, onDelete, isDeleting }: OpinionCardProps) {
  const strengthColor = opinion.strength >= 8 ? "from-red-500 to-orange-500" 
    : opinion.strength >= 5 ? "from-purple-500 to-pink-500" 
    : "from-blue-500 to-cyan-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 hover:border-purple-500/30 transition-all"
    >
      {/* Индикатор силы */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b ${strengthColor}`} />
      
      <div className="pl-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{opinion.topic}</span>
              {!opinion.can_change && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">твёрдое</span>
              )}
            </div>
            <p className="text-sm text-white/80 mt-1">{opinion.stance}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{opinion.reasoning}</p>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Edit2 size={12} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-red-400 hover:text-red-300" 
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============== Default Opinion Chip (для базовых) ==============

interface DefaultOpinionChipProps {
  opinion: Opinion;
  onOverride: () => void;
}

function DefaultOpinionChip({ opinion, onOverride }: DefaultOpinionChipProps) {
  return (
    <button
      onClick={onOverride}
      className="group relative px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all text-sm"
    >
      <span className="text-muted-foreground group-hover:text-white transition-colors">{opinion.topic}</span>
      <span className="ml-1.5 text-[10px] text-muted-foreground/50 group-hover:text-purple-400 transition-colors">
        +
      </span>
    </button>
  );
}
