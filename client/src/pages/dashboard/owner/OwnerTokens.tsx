import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Coins, Loader2, Search, Sparkles, Wallet } from "lucide-react";

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
} from "@/components/ui/dialog";
import { useAdjustTokens, useTokenUsers } from "@/hooks/use-owner";
import { useToast } from "@/hooks/use-toast";
import type { TokenUser } from "@/lib/api/owner";

function displayName(user: TokenUser) {
  return user.display_name || user.first_name || user.username || `User ${user.telegram_user_id}`;
}

export default function OwnerTokens() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<TokenUser | null>(null);
  const [amount, setAmount] = useState("100");
  const [reason, setReason] = useState("Ручное начисление");

  const { data, isLoading } = useTokenUsers({
    page,
    search: search.trim() || undefined,
  });
  const adjustTokens = useAdjustTokens();

  const totalUsers = data?.pagination.total || 0;
  const totalBalance = data?.total_balance || 0;
  const topHolder = useMemo(() => data?.users?.[0], [data?.users]);

  const handleAdjust = async () => {
    if (!selectedUser) {
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount === 0) {
      toast({
        title: "Ошибка",
        description: "Укажи ненулевое количество токенов.",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Ошибка",
        description: "Нужна причина корректировки.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await adjustTokens.mutateAsync({
        telegram_user_id: selectedUser.telegram_user_id,
        amount: parsedAmount,
        reason: reason.trim(),
      });
      toast({
        title: "Готово",
        description: `Новый баланс пользователя: ${result.balance_after} токенов`,
      });
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить баланс.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard/owner")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Coins className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold">Токены</h1>
            <span className="text-sm text-muted-foreground">({totalUsers})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Общий баланс
            </div>
            <div className="mt-2 text-3xl font-semibold">{totalBalance.toLocaleString()}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="w-4 h-4 text-amber-400" />
              Пользователей с историей
            </div>
            <div className="mt-2 text-3xl font-semibold">{totalUsers.toLocaleString()}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Топ баланс
            </div>
            <div className="mt-2 text-lg font-semibold truncate">{topHolder ? displayName(topHolder) : "Нет данных"}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topHolder ? `${topHolder.balance.toLocaleString()} токенов` : "—"}
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по Telegram ID, @username или имени..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>

        <div className="flex-1 rounded-3xl border border-white/10 bg-[#09090b]/80 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data?.users?.length ? data.users.map((user) => (
                <div key={user.telegram_user_id} className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-white truncate">{displayName(user)}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      ID: {user.telegram_user_id}
                      {user.username ? ` · @${user.username}` : ""}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Баланс</div>
                      <div className="font-semibold text-amber-300">{user.balance}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Заработано</div>
                      <div className="font-semibold">{user.total_earned}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Ген. credits</div>
                      <div className="font-semibold">{user.standard_credits} / {user.premium_credits}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Последняя транзакция</div>
                      <div className="font-semibold">
                        {user.last_transaction_at ? new Date(user.last_transaction_at).toLocaleDateString("ru-RU") : "—"}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setAmount("100");
                      setReason("Ручное начисление");
                    }}
                    className="shrink-0"
                  >
                    Изменить баланс
                  </Button>
                </div>
              )) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  По этому фильтру пользователей не нашлось.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Страница {data?.pagination.page || page} из {data?.pagination.pages || 1}</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Назад
            </Button>
            <Button
              variant="outline"
              disabled={page >= (data?.pagination.pages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Дальше
            </Button>
          </div>
        </div>

        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Изменить баланс</DialogTitle>
              <DialogDescription>
                {selectedUser ? `${displayName(selectedUser)} · ${selectedUser.telegram_user_id}` : "Пользователь не выбран"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium">Количество токенов</label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                  placeholder="Например: 100 или -50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Положительное число начисляет токены, отрицательное списывает.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Причина</label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1"
                  placeholder="За что меняем баланс"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Отмена
              </Button>
              <Button onClick={handleAdjust} disabled={adjustTokens.isPending}>
                {adjustTokens.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
