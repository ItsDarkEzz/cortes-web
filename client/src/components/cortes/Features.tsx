import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Shield, Zap, BarChart3, MessageCircle } from "lucide-react";

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Brain,
      title: "Контекстное понимание",
      description: "Анализирует историю, подтекст и культуру вашего чата. Не просто отвечает — понимает.",
      color: "text-blue-400"
    },
    {
      icon: Shield,
      title: "Команды модерации",
      description: "Баны, муты, кики, предупреждения через команды. Тихий режим и управление правами участников.",
      color: "text-cyan-400"
    },
    {
      icon: Zap,
      title: "Молниеносная реакция",
      description: "Обрабатывает сообщения за <300ms. Сверхбыстрый анализ на GPT-5.2, мгновенные ответы.",
      color: "text-yellow-400"
    },
    {
      icon: BarChart3,
      title: "Фильтры контента",
      description: "Автоматическая блокировка стоп-слов, репостов из каналов, нежелательных символов и медиа.",
      color: "text-green-400"
    },
    {
      icon: Brain,
      title: "Автоматическая адаптация",
      description: "Cortes сам подстраивается под культуру, стиль и нормы вашего чата со временем.",
      color: "text-purple-400"
    },
    {
      icon: MessageCircle,
      title: "Естественный диалог",
      description: "Говорит как человек: может спорить, шутить, поддразнивать и поддерживать.",
      color: "text-pink-400"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Возможности</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4">
            Возможности AI-бота <span className="text-gradient-primary">Cortes</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Всё, что нужно вашему Telegram-чату: от умных ответов до геймификации
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-colors duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-transparent mt-6 group-hover:w-full transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
