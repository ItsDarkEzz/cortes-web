import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Settings, BarChart3, Gamepad2, MessageCircle } from "lucide-react";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

const features = [
  {
    icon: Settings,
    title: "Настройки",
    description: "Персонализация поведения бота",
    color: "text-blue-400"
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    description: "Статистика использования",
    color: "text-cyan-400"
  },
  {
    icon: Gamepad2,
    title: "RPG Прогресс",
    description: "Уровни и достижения",
    color: "text-green-400"
  },
  {
    icon: MessageCircle,
    title: "История",
    description: "Архив диалогов",
    color: "text-purple-400"
  },
];

export default function Login() {
  useSEO({
    title: "Личный кабинет | Cortes AI",
    description: "Войдите в личный кабинет Cortes через Telegram для управления вашим AI-ботом",
    canonical: "/login",
  });

  const handleTelegramLogin = () => {
    window.open("https://t.me/TheCortesBot", "_blank");
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Background Ambient Glow - как в Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </motion.div>

        {/* Badge - как в Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white/80 tracking-wide">ЛИЧНЫЙ КАБИНЕТ</span>
        </motion.div>

        {/* Title - стиль Hero */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]"
        >
          <span className="block text-gradient">ПАНЕЛЬ</span>
          <span className="block text-3xl md:text-5xl mt-2 font-bold font-sans bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
            Управления Cortes
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-light"
        >
          Настраивайте бота, отслеживайте статистику и управляйте RPG-прогрессом вашего чата
        </motion.p>

        {/* Features grid - стиль Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-colors duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${feature.color} group-hover:scale-110 transition-transform mx-auto`}>
                <feature.icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Login button - стиль Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="pt-8"
        >
          <Button
            onClick={handleTelegramLogin}
            size="lg"
            className="h-14 px-8 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white
              font-medium text-lg shadow-[0_0_20px_rgba(0,136,204,0.4)]
              transition-all hover:scale-105 cursor-pointer"
          >
            <TelegramIcon className="w-5 h-5 mr-3" />
            Войти через Telegram
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm text-muted-foreground/70"
        >
          Безопасная авторизация через @TheCortesBot
        </motion.p>
      </div>

      {/* Bottom Gradient Fade - как в Hero */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
