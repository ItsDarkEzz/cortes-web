import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Zap, Sparkles, Shield, Brain, MessageCircleMore, Mic, LayoutDashboard } from "lucide-react";

export function Architecture() {
  const [activeLayer, setActiveLayer] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metricsRef = useRef(null);
  const metricsInView = useInView(metricsRef, { once: true, margin: "-100px" });

  const layers = [
    {
      id: 1,
      name: "Observer",
      title: "Решение: отвечать или молчать",
      description: "Cortes сначала наблюдает за потоком сообщений, проверяет контекст, режим чата и полезность своего ответа. Поэтому он не лезет в каждую реплику.",
      details: ["Смотрит на упоминания, reply и тон диалога", "Уважает режимы normal / passive / muted / admins", "Не плодит шум ради самого ответа"],
      IconComponent: Zap,
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: 2,
      name: "Memory",
      title: "Память о чате и людях",
      description: "Бот держит в памяти не только последние реплики, но и устойчивые факты, summary, связи между участниками и темы, которые всплывали раньше.",
      details: ["Помнит факты, preferences и прошлые обсуждения", "Вытаскивает recall не только из ближайшего окна сообщений", "Помогает быстро вернуться в контекст спора или решения"],
      IconComponent: Sparkles,
      color: "from-violet-500 to-purple-500"
    },
    {
      id: 3,
      name: "Actions",
      title: "Ответы, медиа и контроль",
      description: "Когда Cortes решает вмешаться, он умеет отвечать по тексту, голосовым, фото и PDF, а для админов даёт moderation и Dashboard.",
      details: ["Понимает голосовые, изображения, скриншоты и PDF", "Есть moderation, фильтры и настройки поведения", "Админы управляют ботом через web Dashboard"],
      IconComponent: Shield,
      color: "from-rose-500 to-pink-500"
    }
  ];

  const activeLayerData = layers.find(l => l.id === activeLayer);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">СИСТЕМА</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4">
            Как работает AI-бот <span className="text-gradient-primary">Cortes</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Три слоя, которые и делают его полезным: observer-логика, память и управляемые действия
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {layers.map((layer, idx) => (
            <motion.button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative h-48 rounded-2xl border transition-all duration-300 overflow-hidden group ${
                activeLayer === layer.id
                  ? "border-primary/50 bg-white/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${layer.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <layer.IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded-full ${
                    activeLayer === layer.id 
                      ? `bg-gradient-to-r ${layer.color} text-white` 
                      : "bg-white/10 text-muted-foreground"
                  }`}>
                    0{layer.id}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{layer.name}</p>
                  <h3 className="text-lg font-bold text-white">{layer.title}</h3>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="relative h-24 mb-12 overflow-hidden hidden md:block">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background"
              style={{ left: `${33 + i * 33}%` }}
            />
          ))}
        </div>

        <motion.div
          key={activeLayer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-primary font-mono mb-3">Слой {activeLayer}</p>
                <h3 className="text-3xl font-bold text-white mb-4">{activeLayerData?.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{activeLayerData?.description}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-primary font-mono mb-4">Спецификация</p>
              {activeLayerData?.details.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <span className="text-primary font-bold">→</span>
                  <span className="text-sm text-muted-foreground">{detail}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div ref={metricsRef} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Observer", value: "Не спамит", IconComponent: MessageCircleMore },
            { label: "Память", value: "Long-term", IconComponent: Brain },
            { label: "Медиа", value: "Voice + PDF", IconComponent: Mic },
            { label: "Контроль", value: "Dashboard", IconComponent: LayoutDashboard }
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={metricsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex justify-center mb-2">
                <metric.IconComponent className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{metric.label}</div>
              <div className="text-lg font-bold text-white">{metric.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
