import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Shield, Zap, BarChart3, MessageCircle, Mic, FileText } from "lucide-react";

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Brain,
      title: "Память о людях и темах",
      description: "Помнит факты, привычки, прошлые обсуждения и важные детали конкретного чата.",
      color: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Не спамит без причины",
      description: "Сначала оценивает контекст, потом решает: отвечать, промолчать или дождаться прямого обращения.",
      color: "text-cyan-400"
    },
    {
      icon: Mic,
      title: "Голосовые и аудио",
      description: "Понимает голосовые, расшифровывает аудио и умеет держать контекст даже в мультимодальных диалогах.",
      color: "text-yellow-400"
    },
    {
      icon: FileText,
      title: "Фото, скриншоты и PDF",
      description: "Разбирает изображения и документы, чтобы отвечать по содержимому, а не только по тексту.",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Режимы и moderation",
      description: "Normal, passive, muted, admins, плюс фильтры, команды и инструменты для наведения порядка.",
      color: "text-purple-400"
    },
    {
      icon: BarChart3,
      title: "Dashboard для админов",
      description: "Настройки поведения, аналитика, логи и контроль над тем, как Cortes живёт внутри чата.",
      color: "text-pink-400"
    },
    {
      icon: MessageCircle,
      title: "Характер под чат",
      description: "Можно задать имя, стиль и рамки поведения, чтобы бот чувствовался частью вашей среды.",
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
            Всё, за что любят живых чат-ботов: память, контекст, мультимодальность и админский контроль
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
