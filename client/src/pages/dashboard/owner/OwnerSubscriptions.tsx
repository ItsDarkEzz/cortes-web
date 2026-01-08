/**
 * Owner Subscriptions - Управление подписками
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  CreditCard, Search, Plus, User, Calendar, 
  CheckCircle, XCircle, Clock, DollarSign, ArrowLeft
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
import { Switch } from "@/components/ui/switch";
import { useSubscriptions, useCreateSubscription, useUpdateSubscription } from "@/hooks/use-owner";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: "Активна", color: "text-green-400", icon: CheckCircle },
  expired: { label: "Истекла", color: "text-red-400", icon: XCircle },
  cancelled: { label: "Отменена", color: "text-gray-400", icon: XCircle },
  pending: { label: "Ожидание", color: "text-yellow-400", icon: Clock },
};

const plans = [
  { id: "free", name: "Бесплатный" },
  { id: "premium", name: "Премиум" },
  { id: "unlimited", name: "Безлимит" },
];

export default function OwnerSubscriptions() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    telegram_user_id: "",
    plan_id: "premium",
    duration_days: "30",
    auto_renew: true,
  });

  const { data: subsData, isLoading } = useSubscriptions({ 
    page, 
    search,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const createSub = useCreateSubscription();
  const updateSub = useUpdateSubscription();
  const { toast } = useToast();

  const handleCreateSubscription = async () => {
    if (!newSub.telegram_user_id) {
      toast({ title: "Ошибка", description: "Укажите Telegram ID", variant: "destructive" });
      return;
    }

    try {
      await createSub.mutateAsync({
        telegram_user_id: parseInt(newSub.telegram_user_id),
        plan_id: newSub.plan_id,
        duration_days: parseInt(newSub.duration_days),
        auto_renew: newSub.auto_renew,
      });
      toast({ title: "Успешно", description: "Подписка создана" });
      setIsAddDialogOpen(false);
      setNewSub({ telegram_user_id: "", plan_id: "premium", duration_days: "30", auto_renew: true });
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось создать подписку", variant: "destructive" });
    }
  };

  const handleCancelSubscription = async (id: number) => {
    try {
      await updateSub.mutateAsync({ id, data: { status: "cancelled" } });
      toast({ title: "Успешно", description: "Подписка отменена" });
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось отменить подписку", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
            <CreditCard className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold">Подписки</h1>
            <span className="text-sm text-muted-foreground">
              ({subsData?.pagination.total || 0})
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">
                {subsData?.total_revenue?.toLocaleString() || 0} ₽
              </span>
              <span className="text-muted-foreground">выручка</span>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать подписку</DialogTitle>
                  <DialogDescription>
                    Выдать подписку пользователю вручную
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium">Telegram ID</label>
                    <Input
                      placeholder="123456789"
                      value={newSub.telegram_user_id}
                      onChange={(e) => setNewSub({ ...newSub, telegram_user_id: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">План</label>
                    <Select
                      value={newSub.plan_id}
                      onValueChange={(v) => setNewSub({ ...newSub, plan_id: v })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Срок (дней)</label>
                    <Input
                      type="number"
                      value={newSub.duration_days}
                      onChange={(e) => setNewSub({ ...newSub, duration_days: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Автопродление</span>
                    <Switch 
                      checked={newSub.auto_renew} 
                      onCheckedChange={(v) => setNewSub({ ...newSub, auto_renew: v })} 
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreateSubscription} disabled={createSub.isPending}>
                    {createSub.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Создать
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по ID или имени..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="expired">Истёкшие</SelectItem>
              <SelectItem value="cancelled">Отменённые</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscriptions List */}
        <div className="flex-1 overflow-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : subsData?.subscriptions && subsData.subscriptions.length > 0 ? (
            subsData.subscriptions.map((sub, idx) => {
              const status = statusConfig[sub.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {sub.first_name || sub.username || `ID: ${sub.telegram_user_id}`}
                          </p>
                          {sub.username && (
                            <span className="text-sm text-muted-foreground">@{sub.username}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ID: {sub.telegram_user_id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {/* Plan */}
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {sub.plan_name}
                      </span>
                      
                      {/* Status */}
                      <div className="flex items-center gap-1">
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-sm ${status.color}`}>{status.label}</span>
                      </div>
                      
                      {/* Dates */}
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(sub.started_at)}
                        </div>
                        {sub.expires_at && (
                          <div className="text-muted-foreground">
                            до {formatDate(sub.expires_at)}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      {sub.status === "active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelSubscription(sub.id)}
                          disabled={updateSub.isPending}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          Отменить
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {sub.auto_renew && sub.status === "active" && (
                    <p className="mt-2 text-xs text-muted-foreground pl-14">
                      Автопродление включено
                    </p>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <CreditCard className="w-12 h-12 mb-4 opacity-20" />
              <p>Нет подписок</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {subsData && subsData.pagination.pages > 1 && (
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
              {page} / {subsData.pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(subsData.pagination.pages, p + 1))}
              disabled={page === subsData.pagination.pages}
            >
              Вперёд
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
