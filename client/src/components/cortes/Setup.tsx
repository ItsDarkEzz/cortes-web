import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, MessageSquare, Settings, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Setup() {
  const [activeArchetype, setActiveArchetype] = useState("mentor");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const archetypes = [
    {
      id: "mentor",
      name: "Ментор",
      description: "Помогает учиться, объясняет сложное просто, поддерживает новичков",
      examples: ["«Давайте разберёмся по шагам»", "«Вот хороший ресурс для изучения»"]
    },
    {
      id: "jester",
      name: "Шут",
      description: "Смешной, саркастичный, любит пранки и шутки про код",
      examples: ["«Это работает? Просто удаление не попробовал?»", "«Stack Overflow решает всё»"]
    },
    {
      id: "guardian",
      name: "Страж",
      description: "Серьёзный, ответственный, помогает с модерацией",
      examples: ["«Тон, пожалуйста»", "«Давайте придём к консенсусу»"]
    },
    {
      id: "sage",
      name: "Мудрец",
      description: "Глубокие знания, философский подход, любит глубокие дискуссии",
      examples: ["«Интересный вопрос, позволь мне поразмыслить»", "«Это напоминает нам о...»"]
    }
  ];

  const features = [
    { icon: MessageSquare, text: "Выберите архетип" },
    { icon: Settings, text: "Или напишите свой" },
    { icon: Wand2, text: "Система адаптируется" },
    { icon: Check, text: "Готово!" }
  ];

  const activeArchetypeData = archetypes.find(a => a.id === activeArchetype);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Персонализация</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
            Выберите <span className="text-gradient-primary">личность</span> Cortes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Четыре готовых архетипа или полная кастомизация под вашу культуру чата
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {archetypes.map((archetype, idx) => (
            <motion.button
              key={archetype.id}
              onClick={() => setActiveArchetype(archetype.id)}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-2xl transition-colors duration-300 text-left ${
                activeArchetype === archetype.id
                  ? "bg-white/10 border-2 border-primary shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                  : "bg-white/[0.02] border border-white/10 hover:bg-white/[0.05]"
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{archetype.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {archetype.description}
              </p>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeArchetype}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-16 relative overflow-hidden"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary to-purple-500 blur-[100px] opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-widest text-primary font-mono mb-4">Примеры общения</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeArchetypeData?.examples.map((example, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg bg-black/30 border border-white/10 flex items-start gap-3"
                >
                  <span className="text-primary text-xl leading-none mt-1">→</span>
                  <p className="text-muted-foreground italic">{example}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Как это работает</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="relative">
                {idx < features.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-2 w-4 h-px bg-gradient-to-r from-primary to-transparent" />
                )}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                    <feature.icon size={24} />
                  </div>
                  <p className="text-sm font-medium text-white">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Начать с Cortes
          </Button>
          <p className="text-muted-foreground mt-4">Первый месяц полностью бесплатен</p>
        </div>
      </div>
    </section>
  );
}
