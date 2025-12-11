import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Scroll, Sword, Crown } from "lucide-react";

const items = [
  {
    title: "RPG Система",
    desc: "Превратите общение в игру. Получайте XP за активность.",
    icon: Trophy,
    col: "md:col-span-2",
    bg: "bg-gradient-to-br from-purple-900/20 to-black"
  },
  {
    title: "Квесты",
    desc: "Ежедневные задания для всего чата.",
    icon: Scroll,
    col: "md:col-span-1",
    bg: "bg-card"
  },
  {
    title: "Дуэли",
    desc: "Вызывайте друзей на интеллектуальные битвы.",
    icon: Sword,
    col: "md:col-span-1",
    bg: "bg-card"
  },
  {
    title: "Достижения",
    desc: "Уникальные бейджи за особые заслуги в чате.",
    icon: Crown,
    col: "md:col-span-2",
    bg: "bg-gradient-to-br from-blue-900/20 to-black"
  }
];

export function RpgSystem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Gamification</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">RPG-система в Telegram-чате</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Геймификация общения: XP, уровни, квесты, дуэли и достижения для участников
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`${item.col} ${item.bg} rounded-3xl border border-white/10 p-8 flex flex-col justify-between hover:border-primary/30 transition-colors duration-300 group`}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform text-white">
                <item.icon />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
