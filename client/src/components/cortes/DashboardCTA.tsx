import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Shield, BarChart3, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function DashboardCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Shield,
      title: "Модерация",
      description: "Настройте фильтры стоп-слов, каналов, медиа и символов"
    },
    {
      icon: Settings,
      title: "Настройки бота",
      description: "Управляйте характером, поведением и инструкциями бота"
    },
    {
      icon: BarChart3,
      title: "Аналитика",
      description: "Просматривайте логи модерации, статистику и активность"
    },
    {
      icon: Users,
      title: "Участники",
      description: "Просматривайте предупреждения и историю действий"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Панель управления</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
            Управляйте ботом через <span className="text-gradient-primary">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Полный контроль над модерацией, настройками и аналитикой вашего чата в удобном веб-интерфейсе
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-primary/30 transition-colors duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-105"
            >
              Войти в Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4 text-sm">
            Войдите через Telegram для доступа к панели управления
          </p>
        </motion.div>
      </div>
    </section>
  );
}
