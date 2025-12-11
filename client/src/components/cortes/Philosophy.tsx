import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquareOff, Brain, Zap } from "lucide-react";

export function Philosophy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Меньше <span className="text-gradient-primary">шума</span> в Telegram-чате
          </h2>
          <p className="text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
            Cortes — не обычный бот, который вмешивается в каждый разговор. 
            Он — <span className="text-white">умный AI-наблюдатель, аналитик и участник одновременно.</span>
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
            className="h-96 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent rounded-3xl border border-red-500/20 overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-center px-8 gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs text-muted-foreground"
                    style={{
                      marginLeft: `${(i * 17) % 40}px`,
                      marginRight: `${(i * 23) % 40}px`,
                    }}
                  >
                    [БОТ] Привет! Спасибо за сообщение! 🤖
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <p className="text-sm text-red-400 font-medium">Обычные боты отвечают на всё</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-96 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl border border-primary/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center px-8">
                <div className="bg-gradient-to-br from-primary/30 to-purple-900/30 border border-primary/40 px-8 py-6 rounded-2xl text-center max-w-sm backdrop-blur-sm">
                  <p className="text-white font-medium leading-relaxed mb-4">
                    "Думаю, ты ошибаешься. Вот почему..."
                  </p>
                  <div className="flex justify-center gap-3">
                    <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-primary/30 text-primary">
                      АНАЛИЗ: ✓
                    </span>
                    <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-primary/30 text-primary">
                      КОНТЕКСТ: ✓
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <p className="text-sm text-primary font-medium">Cortes отвечает только когда это важно</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            {
              icon: MessageSquareOff,
              title: "Минимализм",
              description: "Каждое слово на вес золота. Нет пустых реакций, только значимые реплики.",
              color: "text-blue-400"
            },
            {
              icon: Brain,
              title: "Интеллект",
              description: "Понимает не только текст, но и подтекст, историю и мотивы участников.",
              color: "text-primary"
            },
            {
              icon: Zap,
              title: "Живость",
              description: "Не киборг в маске. Имеет характер, юмор и может спорить по-человечески.",
              color: "text-cyan-400"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
