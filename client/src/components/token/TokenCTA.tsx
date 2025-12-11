import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function TokenCTA() {
  const scrollToAirdrop = () => {
    document.getElementById("airdrop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-[2.5rem] blur-xl opacity-30" />
          
          <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 md:p-12 text-center overflow-hidden">
            {/* Animated background logos */}
            <motion.img 
              src="/token.png" 
              alt="" 
              className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.img 
              src="/token.png" 
              alt="" 
              className="absolute -left-8 -top-8 w-32 h-32 rounded-full opacity-[0.07]"
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Ограниченное предложение</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="text-white">Не упусти свой </span>
                <span className="text-gradient-primary">Airdrop</span>
              </h2>

              <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                200 миллионов $CORTES ждут своих владельцев. Подключи кошелёк, выполни задания и получи награду в Season 1.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={scrollToAirdrop}
                  size="lg"
                  className="h-14 px-10 rounded-full bg-white text-black hover:bg-white/90 font-semibold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                >
                  Участвовать
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <a href="https://t.me/thecortesbot" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 rounded-full border-white/20 hover:bg-white/5"
                  >
                    <img src="/token.png" alt="" className="w-6 h-6 rounded-full mr-2" />
                    Telegram
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">200M</p>
                  <p className="text-xs text-white/40">Пул наград</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">50K</p>
                  <p className="text-xs text-white/40">Макс. на юзера</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">S1</p>
                  <p className="text-xs text-white/40">Сезон</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
