/**
 * Owner Bans - Управление глобальными банами
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Ban, Search, Plus, Trash2, User, Calendar, Clock, ArrowLeft
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalBans, useCreateBan, useRemoveBan } from "@/hooks/use-owner";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { GlobalBan } from "@/lib/api";

const reasonLabels: Record<GlobalBan['reason'], string> = {
  spam: "Спам",
  abuse: "Оскорбления",
  nsfw: "NSFW контент",
  scam: "Мошенничество",
  flood: "Флуд",
  other: "Другое",
};

const reasonColors: Record<GlobalBan['reason'], string> = {
  spam: "bg-yellow-500/10 text-yellow-400",
  abuse: "bg-red-500/10 text-red-400",
  nsfw: "bg-pink-500/10 text-pink-400",
  scam: "bg-orange-500/10 text-orange-400",
  flood: "bg-blue-500/10 text-blue-400",
  other: "bg-gray-500/10 text-gray-400",
};

export default function OwnerBans() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBan, setNewBan] = useState({
    telegram_user_id: "",
    reason: "other" as GlobalBan['reason'],
    reason_text: "",
    duration_days: "",
  });

  const { data: bansData, isLoading } = useGlobalBans({ page, search });
  const createBan = useCreateBan();
  const removeBan = useRemoveBan();
  const { toast } = useToast();

  const handleCreateBan = async () => {
    if (!newBan.telegram_user_id) {
      toast({ title: "Ошибка", description: "Укажите Telegram ID", variant: "destructive" });
      return;
    }

    try {
      await createBan.mutateAsync({
        telegram_user_id: parseInt(newBan.telegram_user_id),
        reason: newBan.reason,
        reason_text: newBan.reason_text || undefined,
        duration_days: newBan.duration_days ? parseInt(newBan.duration_days) : undefined,
      });
      toast({ title: "Успешно", description: "Пользователь заблокирован" });
      setIsAddDialogOpen(false);
      setNewBan({ telegram_user_id: "", reason: "other", reason_text: "", duration_days: "" });
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось заблокировать", variant: "destructive" });
    }
  };

  const handleRemoveBan = async (userId: number) => {
    try {
      await removeBan.mutateAsync(userId);
      toast({ title: "Успешно", description: "Блокировка снята" });
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось снять блокировку", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard/owner')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Ban className="w-6 h-6 text-red-400" />
            <h1 className="text-xl font-bold">Глобальные баны</h1>
            <span className="text-sm text-muted-foreground">
              ({bansData?.pagination.total || 0})
            </span>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Добавить бан
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Заблокировать пользователя</DialogTitle>
                <DialogDescription>
                  Пользователь не сможет взаимодействовать с ботом во всех чатах
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Telegram ID</label>
                  <Input
                    placeholder="123456789"
                    value={newBan.telegram_user_id}
                    onChange={(e) => setNewBan({ ...newBan, telegram_user_id: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Причина</label>
                  <Select
                    value={newBan.reason}
                    onValueChange={(v) => setNewBan({ ...newBan, reason: v as GlobalBan['reason'] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(reasonLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Комментарий (опционально)</label>
                  <Input
                    placeholder="Дополнительная информация..."
                    value={newBan.reason_text}
                    onChange={(e) => setNewBan({ ...newBan, reason_text: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Срок (дней, пусто = навсегда)</label>
                  <Input
                    type="number"
                    placeholder="Навсегда"
                    value={newBan.duration_days}
                    onChange={(e) => setNewBan({ ...newBan, duration_days: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Отмена
                </Button>
                <Button 
                  onClick={handleCreateBan} 
                  disabled={createBan.isPending}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {createBan.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Заблокировать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по ID или имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>

        {/* Bans List */}
        <div className="flex-1 overflow-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : bansData?.bans && bansData.bans.length > 0 ? (
            bansData.bans.map((ban, idx) => (
              <motion.div
                key={ban.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {ban.first_name || ban.username || `ID: ${ban.telegram_user_id}`}
                        </p>
                        {ban.username && (
                          <span className="text-sm text-muted-foreground">@{ban.username}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ID: {ban.telegram_user_id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs ${reasonColors[ban.reason]}`}>
                      {reasonLabels[ban.reason]}
                    </span>
                    
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(ban.banned_at)}
                      </div>
                      {ban.is_permanent ? (
                        <span className="text-red-400">Навсегда</span>
                      ) : ban.expires_at && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Clock className="w-3 h-3" />
                          до {formatDate(ban.expires_at)}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBan(ban.telegram_user_id)}
                      disabled={removeBan.isPending}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {ban.reason_text && (
                  <p className="mt-2 text-sm text-muted-foreground pl-14">
                    {ban.reason_text}
                  </p>
                )}
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Ban className="w-12 h-12 mb-4 opacity-20" />
              <p>Нет заблокированных пользователей</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {bansData && bansData.pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Назад
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {bansData.pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(bansData.pagination.pages, p + 1))}
              disabled={page === bansData.pagination.pages}
            >
              Вперёд
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
