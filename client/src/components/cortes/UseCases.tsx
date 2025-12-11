import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { BarChart3, TrendingUp, Users } from "lucide-react";

export function UseCases() {
  const [activeTab, setActiveTab] = useState("impact");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const impactStats = [
    {
      metric: "Активность",
      value: "+320%",
      description: "Среднее увеличение сообщений в чате",
      icon: TrendingUp
    },
    {
      metric: "Удержание",
      value: "4.5x",
      description: "Участники остаются в чате дольше",
      icon: Users
    },
    {
      metric: "Модерация",
      value: "-85%",
      description: "Вручную модерируемого контента",
      icon: BarChart3
    }
  ];

  const cases = [
    {
      name: "DevCommunity",
      size: "12K участников",
      problem: "Спам техподдержкой в общем чате",
      solution: "Cortes разделяет вопросы и фильтрует дубли",
      result: "30% меньше шума, +2K сообщений в день"
    },
    {
      name: "ArtCollective",
      size: "3.8K участников",
      problem: "Творческие люди хотят вдохновения",
      solution: "Еженедельные квесты и челленджи",
      result: "45% более активное участие, вирусный контент"
    },
    {
      name: "GamingGuild",
      size: "8.2K участников",
      problem: "Нужна система рейтинга и достижений",
      solution: "RPG система с ежедневными квестами",
      result: "Люди играют каждый день, +180% retention"
    },
    {
      name: "TechStartup",
      size: "2.1K участников",
      problem: "Команда нужна помощь с организацией",
      solution: "Cortes напоминает о встречах и целях",
      result: "На 40% меньше пропусков встреч"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Результаты</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4">
            Результаты использования <span className="text-gradient-primary">Cortes</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Реальные метрики и кейсы Telegram-чатов с AI-ботом Cortes
          </p>
        </div>

        <div className="flex gap-4 mb-12 justify-center">
          {["impact", "cases"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 border ${
                activeTab === tab
                  ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                  : "bg-transparent text-muted-foreground border-white/10 hover:border-white/20"
              }`}
            >
              {tab === "impact" ? "Метрики" : "Кейсы"}
            </button>
          ))}
        </div>

        <div ref={ref}>
          {activeTab === "impact" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {impactStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                    <stat.icon size={24} />
                  </div>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">{stat.metric}</p>
                  <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text mb-3">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "cases" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cases.map((caseItem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{caseItem.name}</h3>
                      <p className="text-sm text-primary font-mono">{caseItem.size}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Проблема</p>
                      <p className="text-sm text-muted-foreground">{caseItem.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Решение</p>
                      <p className="text-sm text-muted-foreground">{caseItem.solution}</p>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs uppercase tracking-widest text-primary font-mono mb-1">Результат</p>
                      <p className="text-sm font-semibold text-white">{caseItem.result}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 text-center">
          <p className="text-lg text-muted-foreground">
            Ваш чат может получить такие же результаты. <span className="text-white font-semibold">Начните бесплатно сегодня.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
