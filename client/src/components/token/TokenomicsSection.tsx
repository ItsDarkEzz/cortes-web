import { motion } from "framer-motion";
import { Lock, Rocket, Users, Globe, Vote, Check } from "lucide-react";

const distribution = [
  { percent: 70, label: "Комьюнити", color: "#8B5CF6" },
  { percent: 15, label: "Экосистема", color: "#06B6D4" },
  { percent: 10, label: "Ликвидность", color: "#10B981" },
  { percent: 5, label: "Команда", color: "#F59E0B" },
];

const roadmapItems = [
  { phase: "01", title: "Запуск", icon: Rocket, items: ["Создание токена", "Airdrop S1", "Комьюнити"], active: true },
  { phase: "02", title: "Рост", icon: Users, items: ["Рефералы", "Квесты", "Конкурсы"], active: false },
  { phase: "03", title: "Экосистема", icon: Globe, items: ["Листинг DEX", "NFT", "Коллабы"], active: false },
  { phase: "04", title: "Управление", icon: Vote, items: ["Голосования", "DAO-lite", "Расширение"], active: false },
];

export function TokenomicsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">TOKEN</span>
            <span className="text-primary">OMICS</span>
          </h2>
        </motion.div>

        {/* Tokenomics Visual */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Circular Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square max-w-md mx-auto"
          >
            {/* Outer Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {distribution.map((item, i) => {
                const offset = distribution.slice(0, i).reduce((acc, d) => acc + d.percent, 0);
                const circumference = 2 * Math.PI * 45;
                const segmentLength = (item.percent / 100) * circumference;
                const gapLength = circumference - segmentLength;
                const rotation = (offset / 100) * 360;
                
                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={`${segmentLength} ${gapLength}`}
                    strokeLinecap="round"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: '50% 50%',
                    }}
                    className="opacity-80"
                  />
                );
              })}
            </svg>
            
            {/* Center Content - Token Logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.img 
                src="/token.png" 
                alt="$CORTES Token" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-2 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-2xl font-bold text-white">1B</span>
              <span className="text-xs text-white/40 font-mono tracking-wider">TOTAL SUPPLY</span>
            </div>

            {/* Floating Labels */}
            {distribution.map((item, i) => {
              // Вычисляем центр каждого сегмента
              const offsetPercent = distribution.slice(0, i).reduce((acc, d) => acc + d.percent, 0);
              const centerPercent = offsetPercent + item.percent / 2;
              // SVG повёрнут на -90deg, поэтому 0% = верх
              const angleDeg = (centerPercent / 100) * 360 - 90;
              const angleRad = angleDeg * (Math.PI / 180);
              const radius = 160;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="absolute top-1/2 left-1/2"
                  style={{ 
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 whitespace-nowrap">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-white">{item.percent}%</span>
                    <span className="text-xs text-white/50">{item.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {distribution.map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-lg font-medium text-white">{item.label}</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: item.color }}>{item.percent}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}

            {/* Vesting Note */}
            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">Вестинг команды</p>
                  <p className="text-xs text-white/50 mt-1">24 месяца, ежеквартальная разблокировка. Адреса публикуются.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-black text-center mb-16">
            <span className="text-white/30">ROAD</span>
            <span className="text-white">MAP</span>
          </h3>

          <div className="grid md:grid-cols-4 gap-4">
            {roadmapItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-3xl border transition-all duration-500 overflow-hidden group ${
                  item.active 
                    ? "bg-gradient-to-b from-primary/20 to-transparent border-primary/30" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Background logo on active card */}
                {item.active && (
                  <img 
                    src="/token.png" 
                    alt="" 
                    className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10"
                  />
                )}
                
                {item.active && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}
                
                <div className="flex items-center gap-3 mb-4 relative">
                  <span className={`text-4xl font-black ${item.active ? "text-primary" : "text-white/20"}`}>
                    {item.phase}
                  </span>
                  <item.icon className={`w-5 h-5 ${item.active ? "text-primary" : "text-white/30"}`} />
                </div>
                
                <h4 className="text-xl font-bold text-white mb-4 relative">{item.title}</h4>
                
                <ul className="space-y-2 relative">
                  {item.items.map((text, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      {item.active && j === 0 ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${item.active ? "bg-primary/50" : "bg-white/20"}`} />
                      )}
                      <span className={item.active ? "text-white/70" : "text-white/40"}>{text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
