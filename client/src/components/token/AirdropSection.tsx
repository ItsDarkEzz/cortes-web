import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  CheckCircle2, 
  Circle,
  Users, 
  MessageSquare, 
  Share2,
  Sparkles,
  Clock,
  X
} from "lucide-react";

type TaskStatus = "pending" | "done" | "verifying";

interface Task {
  id: string;
  title: string;
  reward: string;
  icon: React.ElementType;
  status: TaskStatus;
}

const initialTasks: Task[] = [
  { id: "wallet", title: "Подключить кошелёк", reward: "Обязательно", icon: Wallet, status: "pending" },
  { id: "group", title: "Добавить бота в группу (24ч)", reward: "+1,000", icon: Users, status: "pending" },
  { id: "activity", title: "Взаимодействие с ботом", reward: "+2,000-5,000", icon: MessageSquare, status: "pending" },
  { id: "social", title: "Социальная активность", reward: "+500-50,000", icon: Share2, status: "pending" },
];

export function AirdropSection() {
  const [walletConnected] = useState(false);
  const [walletAddress] = useState("");
  const [tasks] = useState<Task[]>(initialTasks);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const completedTasks = tasks.filter(t => t.status === "done").length;

  const handleConnectClick = () => {
    setShowComingSoon(true);
  };

  return (
    <section id="airdrop" className="relative py-32 overflow-hidden">
      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-gradient-to-b from-card to-background rounded-3xl border border-white/10 p-8 text-center"
            >
              <button
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Скоро!</h3>
              <p className="text-white/60 mb-6">
                Токен $CORTES находится в разработке. Airdrop и подключение кошельков будут доступны после запуска токена.
              </p>
              <p className="text-sm text-white/40 mb-6">
                Следите за анонсами в нашем Telegram-канале, чтобы не пропустить старт!
              </p>
              
              <div className="flex gap-3 justify-center">
                <a href="https://t.me/thecortes" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full bg-primary hover:bg-primary/90">
                    Telegram
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => setShowComingSoon(false)}
                >
                  Понятно
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-2 pr-5 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6"
          >
            <img src="/token.png" alt="$CORTES" className="w-8 h-8 rounded-full" />
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary tracking-wider">SEASON 1</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="text-white">AIR</span>
            <span className="text-primary">DROP</span>
          </h2>
          
          <p className="text-xl text-white/40">
            <span className="text-white font-semibold">200M $CORTES</span> pool • Max <span className="text-white font-semibold">50K</span> per user
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-secondary/50 rounded-[2.5rem] blur-xl opacity-20" />
          
          <div className="relative bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>

            <div className="p-8 md:p-12">
              {/* Wallet Section */}
              <div className="mb-10">
                {!walletConnected ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <Wallet className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Подключите Solana-кошелёк</h3>
                        <p className="text-sm text-white/40">Phantom, Solflare или Slope</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleConnectClick}
                      className="h-12 px-8 rounded-full bg-white text-black hover:bg-white/90 font-semibold"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Подключить
                    </Button>
                  </motion.div>
                ) : null}
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {tasks.slice(1).map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                      task.status === "done"
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        task.status === "done" ? "bg-green-500/20" : "bg-white/5"
                      }`}>
                        <task.icon className={`w-5 h-5 ${task.status === "done" ? "text-green-500" : "text-white/50"}`} />
                      </div>
                      <span className={`font-medium ${task.status === "done" ? "text-white" : "text-white/70"}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-primary">{task.reward}</span>
                      {task.status === "done" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-10 text-center"
              >
                <Button
                  disabled={!walletConnected}
                  size="lg"
                  className="h-14 px-12 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 font-semibold text-lg disabled:opacity-30"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Проверить и получить
                </Button>
                <p className="mt-4 text-xs text-white/30">
                  Награды распределяются периодическими on-chain батчами
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Reward Tiers - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Базовый", value: "1,000" },
            { label: "Активность", value: "2K-5K" },
            { label: "Реферал", value: "+500" },
            { label: "Контент", value: "→50K" },
          ].map((tier, i) => (
            <div key={i} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-colors">
              <img src="/token.png" alt="" className="absolute -right-3 -top-3 w-12 h-12 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" />
              <p className="text-2xl font-bold text-white relative">{tier.value}</p>
              <p className="text-xs text-white/40 mt-1 relative">{tier.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
