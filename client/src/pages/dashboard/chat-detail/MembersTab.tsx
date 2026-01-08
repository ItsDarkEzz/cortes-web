/**
 * Вкладка "Участники" - список участников чата
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Crown, ChevronRight, Loader2, AlertTriangle, Minus } from "lucide-react";
import { useChatMembers, useUpdateMemberRole, useRemoveWarning } from "@/hooks/use-chats";
import { API_BASE, roleLabels, roleColors } from "./constants";

interface MembersTabProps {
  chatId: string;
}

export function MembersTab({ chatId }: MembersTabProps) {
  const { data, isLoading, refetch } = useChatMembers(chatId);
  const updateRole = useUpdateMemberRole(chatId);
  const removeWarning = useRemoveWarning(chatId);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [updatingRole, setUpdatingRole] = useState<number | null>(null);
  const [removingWarning, setRemovingWarning] = useState<number | null>(null);
  
  const members = data?.members || [];
  const warningLimit = data?.warning_limit || 3;
  const filtered = search 
    ? members.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        (m.username && m.username.toLowerCase().includes(search.toLowerCase()))
      )
    : members;

  const handleRoleChange = async (userId: number, newRole: string) => {
    setUpdatingRole(userId);
    try {
      await updateRole.mutateAsync({ userId, role: newRole });
      refetch();
      setSelectedId(null);
    } catch (e) {
      console.error("Failed to update role:", e);
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleRemoveWarning = async (userId: number) => {
    setRemovingWarning(userId);
    try {
      await removeWarning.mutateAsync(userId);
      refetch();
    } catch (e) {
      console.error("Failed to remove warning:", e);
    } finally {
      setRemovingWarning(null);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Всего участников: <span className="text-white font-medium">{data?.total || 0}</span>
        </p>
      </div>
      
      <div className="relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск участников..." className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {search ? "Участники не найдены" : "Нет данных об участниках"}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl overflow-hidden">
                  <img 
                    src={`${API_BASE}/users/${m.id}/avatar`}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                  <span className="hidden items-center justify-center w-full h-full text-xl">{m.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{m.name}</p>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${roleColors[m.role]}`}>{roleLabels[m.role]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.username ? `@${m.username}` : `ID: ${m.id}`}</p>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-bold">{m.messages_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Сообщений</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <p className={`font-bold ${m.warnings > 0 ? "text-red-400" : "text-green-400"}`}>{m.warnings}/{warningLimit}</p>
                      {m.warnings > 0 && (
                        <button 
                          onClick={() => handleRemoveWarning(m.id)}
                          disabled={removingWarning === m.id}
                          className="p-1 rounded-lg hover:bg-red-400/20 text-red-400 transition-colors disabled:opacity-50"
                          title="Снять предупреждение"
                        >
                          {removingWarning === m.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Minus size={12} />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Преды</p>
                  </div>
                </div>
                {m.role !== "owner" && (
                  <Button variant="outline" size="sm" className="border-white/10" onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}>
                    <Crown size={14} className="mr-2" />Роль
                    <ChevronRight size={14} className={`ml-1 transition-transform duration-200 ${selectedId === m.id ? "rotate-90" : ""}`} />
                  </Button>
                )}
              </div>
              
              {/* Мобильная статистика */}
              <div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t border-white/10">
                <div className="flex-1 text-center">
                  <p className="font-bold">{m.messages_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Сообщений</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <p className={`font-bold ${m.warnings > 0 ? "text-red-400" : "text-green-400"}`}>{m.warnings}/{warningLimit}</p>
                    {m.warnings > 0 && (
                      <button 
                        onClick={() => handleRemoveWarning(m.id)}
                        disabled={removingWarning === m.id}
                        className="p-1 rounded-lg hover:bg-red-400/20 text-red-400 transition-colors disabled:opacity-50"
                        title="Снять предупреждение"
                      >
                        {removingWarning === m.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Minus size={12} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Преды</p>
                </div>
              </div>
              
              {/* Панель изменения роли с плавной анимацией */}
              <AnimatePresence>
                {selectedId === m.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-muted-foreground mb-3">Изменить роль:</p>
                      <div className="flex gap-2">
                        {(["admin", "moderator", "member"] as const).map((r) => (
                          <button 
                            key={r} 
                            disabled={updatingRole === m.id}
                            onClick={() => m.role !== r && handleRoleChange(m.id, r)}
                            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 ${m.role === r ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"}`}
                          >
                            {updatingRole === m.id ? <Loader2 size={16} className="mx-auto animate-spin" /> : roleLabels[r]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
