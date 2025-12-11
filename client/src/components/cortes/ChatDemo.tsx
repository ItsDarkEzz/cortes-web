import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Zap, Brain } from "lucide-react";
import { useState } from "react";

const scenarios = [
  {
    id: 1,
    user: "Ребят, посоветуйте фильм на вечер, чтобы мозг отдохнул.",
    analysis: ["Анализ контекста: Расслабление", "Триггер: Запрос рекомендации", "Тон: Дружелюбный/Лень"],
    cortes: "«Отель Гранд Будапешт». Визуально безупречно, сюжет летит, мозг отдыхает, а глаза радуются. Не благодари.",
    stats: { latency: "0.4s", confidence: "98%" }
  },
  {
    id: 2,
    user: "Кортес, кто прав в споре про табы и пробелы?",
    analysis: ["Анализ контекста: Холивар", "Триггер: Прямое обращение", "Тон: Провокация"],
    cortes: "В 2025 году спорить об этом — моветон. Используйте Prettier и идите писать код, а не комментарии.",
    stats: { latency: "0.3s", confidence: "99%" }
  },
  {
    id: 3,
    user: "Скиньте кто-нибудь презентацию с митапа, плиз.",
    analysis: ["Анализ контекста: Рабочий запрос", "Релевантность: Низкая для AI", "Действие: Игнорировать"],
    cortes: null,
    stats: { latency: "0.1s", confidence: "100%" }
  }
];

export function ChatDemo() {
  const [activeScenario, setActiveScenario] = useState(0);
  const scenario = scenarios[activeScenario];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Мышление <span className="text-gradient-primary">в реальном времени</span></h2>
          <p className="text-muted-foreground">Посмотрите, как Cortes принимает решения: отвечать или молчать.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scenario Selector */}
          <div className="space-y-4">
            {scenarios.map((s, index) => (
              <button
                key={index}
                onClick={() => setActiveScenario(index)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                  activeScenario === index 
                    ? "bg-white/10 border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono uppercase tracking-wider ${activeScenario === index ? "text-primary" : "text-muted-foreground"}`}>
                    Сценарий {index + 1}
                  </span>
                  {activeScenario === index && (
                    <motion.div layoutId="scenario-dot" className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-sm text-white/80 line-clamp-2 font-medium">"{s.user}"</p>
              </button>
            ))}
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-2 relative h-[500px] bg-black/40 rounded-[32px] border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeScenario}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 p-8 h-full flex flex-col justify-between"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="self-start bg-white/10 border border-white/20 text-white px-6 py-4 rounded-2xl rounded-bl-none max-w-md relative"
                >
                  <div className="absolute -top-6 left-0 text-xs text-muted-foreground flex items-center gap-2">
                    <MessageSquare size={12} /> Входящее сообщение
                  </div>
                  "{scenario.user}"
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="self-center w-full max-w-lg"
                >
                  <div className="relative py-8 flex flex-col items-center gap-4">
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
                    {scenario.analysis.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.3 }}
                        className="relative z-10 bg-black/80 border border-primary/30 px-4 py-2 rounded-lg text-xs font-mono text-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                  className="self-end w-full flex justify-end"
                >
                  {scenario.cortes ? (
                    <div className="bg-gradient-to-br from-primary/20 to-purple-900/20 border border-primary/30 text-white px-6 py-4 rounded-2xl rounded-br-none max-w-md relative shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                      <div className="absolute -top-6 right-0 text-xs text-primary flex items-center gap-2 justify-end">
                        Ответ сгенерирован <Zap size={12} />
                      </div>
                      <p>{scenario.cortes}</p>
                      <div className="mt-3 pt-3 border-t border-white/10 flex gap-4 text-[10px] font-mono opacity-70">
                        <span>LATENCY: {scenario.stats.latency}</span>
                        <span>CONFIDENCE: {scenario.stats.confidence}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 text-muted-foreground px-6 py-4 rounded-2xl rounded-br-none max-w-md italic relative">
                      <div className="absolute -top-6 right-0 text-xs text-muted-foreground flex items-center gap-2 justify-end">
                        Решение <Brain size={12} />
                      </div>
                      (Cortes остается молчаливым наблюдателем)
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
