/**
 * Owner Broadcast - Рассылка сообщений
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Send, Users, MessageCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBroadcast, useBotStats } from "@/hooks/use-owner";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const targetOptions = [
  { value: "all", label: "Все чаты", description: "Отправить во все активные чаты" },
  { value: "subscribers", label: "Подписчики", description: "Только пользователи с подпиской" },
  { value: "chat_admins", label: "Админы чатов", description: "Только администраторы чатов" },
];

export default function OwnerBroadcast() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "subscribers" | "chat_admins">("all");
  const [sent, setSent] = useState<{ taskId: string; count: number } | null>(null);

  const { data: stats } = useBotStats();
  const broadcast = useBroadcast();
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim()) {
      toast({ title: "Ошибка", description: "Введите сообщение", variant: "destructive" });
      return;
    }

    try {
      const result = await broadcast.mutateAsync({
        message: message.trim(),
        target,
      });
      setSent({ taskId: result.task_id, count: result.target_count });
      toast({ title: "Успешно", description: `Рассылка запущена на ${result.target_count} получателей` });
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось отправить рассылку", variant: "destructive" });
    }
  };

  const getTargetCount = () => {
    if (!stats) return 0;
    switch (target) {
      case "all": return stats.active_chats;
      case "subscribers": return "?"; // Нужен отдельный запрос
      case "chat_admins": return "?";
      default: return 0;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard/owner')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Send className="w-6 h-6 text-orange-400" />
          <h1 className="text-xl font-bold">Рассылка</h1>
        </div>

        {sent ? (
          // Success State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-green-500/10 border border-green-500/20 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Рассылка запущена!</h2>
            <p className="text-muted-foreground mb-4">
              Сообщение отправляется {sent.count} получателям
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              ID задачи: {sent.taskId}
            </p>
            <Button onClick={() => { setSent(null); setMessage(""); }}>
              Новая рассылка
            </Button>
          </motion.div>
        ) : (
          // Form
          <div className="space-y-6">
            {/* Target Selection */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-4">Получатели</h3>
              
              <div className="grid gap-3">
                {targetOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setTarget(option.value as typeof target)}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                      target === option.value
                        ? "bg-primary/10 border-primary"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        target === option.value
                          ? "border-primary bg-primary"
                          : "border-white/20"
                      }`}>
                        {target === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Примерно {getTargetCount()} получателей</span>
              </div>
            </div>

            {/* Message */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-4">Сообщение</h3>
              
              <Textarea
                placeholder="Введите текст сообщения...

Поддерживается HTML разметка:
<b>жирный</b>, <i>курсив</i>, <code>код</code>"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px] bg-white/5 border-white/10"
              />
              
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{message.length} символов</span>
                <span>HTML разметка поддерживается</span>
              </div>
            </div>

            {/* Preview */}
            {message && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4">Предпросмотр</h3>
                <div 
                  className="p-4 rounded-lg bg-black/20 prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </div>
            )}

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={broadcast.isPending || !message.trim()}
              className="w-full h-12 text-lg gap-2"
            >
              {broadcast.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Отправить рассылку
            </Button>

            {/* Warning */}
            <p className="text-center text-sm text-muted-foreground">
              ⚠️ Рассылка будет отправлена немедленно. Убедитесь, что сообщение корректно.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
