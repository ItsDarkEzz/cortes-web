import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Brain, Shield, Users } from "lucide-react";

export function UseCases() {
  const [activeTab, setActiveTab] = useState("impact");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const impactStats = [
    {
      metric: "Для живых чатов",
      value: "Память",
      description: "Локальные мемы, договорённости и прошлые темы не теряются через полчаса.",
      icon: Brain
    },
    {
      metric: "Для команд",
      value: "Summary",
      description: "Удобно быстро вернуться в контекст после пропущенного обсуждения.",
      icon: Users
    },
    {
      metric: "Для админов",
      value: "Control",
      description: "Режимы, фильтры, moderation и Dashboard помогают держать чат под контролем.",
      icon: Shield
    }
  ];

  const cases = [
    {
      name: "Дружеские чаты",
      size: "20-80 участников",
      problem: "Хочется живого бота с характером, но без ощущения, что он влезает в каждую шутку.",
      solution: "Observer-поведение + память о людях и локальных мемах.",
      result: "Бот становится частью атмосферы, а не ещё одним источником шума."
    },
    {
      name: "Dev / AI комьюнити",
      size: "50-300 участников",
      problem: "Идеи, ссылки и решения быстро тонут в потоке обсуждений.",
      solution: "Summary, recall и память о прошлых ветках разговора.",
      result: "Проще вернуться в спор или быстро вспомнить, кто что предлагал."
    },
    {
      name: "Учебные группы",
      size: "30-200 участников",
      problem: "Одни и те же вопросы по материалам повторяются снова и снова.",
      solution: "Бот помнит контекст, документы и может подхватить повторяющийся вопрос.",
      result: "Меньше повторов и проще держать общий контекст без ручных пересказов."
    },
    {
      name: "Команды и стартапы",
      size: "10-100 участников",
      problem: "Решения и обещания теряются, если кто-то не успел читать чат весь день.",
      solution: "Память о договорённостях, recap и админский контроль через Dashboard.",
      result: "Меньше потерь контекста и меньше ручной рутины у владельца чата."
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Сценарии</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4">
            Где особенно хорошо заходит <span className="text-gradient-primary">Cortes</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Не для всех подряд, а для тех чатов, где важны контекст, память и аккуратное поведение бота
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
              {tab === "impact" ? "Кому подходит" : "Примеры"}
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
            Если у тебя активная группа и обычные боты уже раздражают, <span className="text-white font-semibold">Cortes стоит попробовать первым.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
