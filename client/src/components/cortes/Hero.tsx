import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4" aria-label="Главный экран">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-white/80 tracking-wide">AI НОВОГО ПОКОЛЕНИЯ</span>
        </motion.div>

        <motion.h1
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.8, delay: 0.1}}
            className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9]"
        >
          <span className="block text-gradient">CORTES</span>
          <span
              className="block text-5xl md:text-7xl mt-2 font-bold font-sans bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
            Интеллект. Харизма.
          </span>
        </motion.h1>

        <motion.p
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.8, delay: 0.3}}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
        >
          Интеллектуальный бот на <span className="text-white font-medium">GPT-5.2</span>, который понимает контекст, помогает с модерацией и не тратит ваше время впустую.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm text-muted-foreground/70"
        >
          Бесплатный AI-бот • Команды модерации • Фильтры контента • Мгновенные ответы
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <a
            href="https://t.me/thecortesbot?startgroup=add"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90
                font-medium text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]
                transition-all hover:scale-105 cursor-pointer"
            >
              Добавить в чат
            </Button>
          </a>
          <a href="/dashboard">
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/20 bg-transparent hover:bg-white/5 hover:border-white/40 text-lg transition-all">
              Войти в Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
