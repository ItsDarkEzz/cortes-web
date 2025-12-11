import { motion } from "framer-motion";
import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import { ArrowLeft, Terminal, Gamepad2, Trophy, MessageSquare, Settings, Sparkles } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

export default function Commands() {
    useSEO({
        title: "Команды бота — Полный список команд Cortes",
        description: "Все команды AI-бота Cortes для Telegram: RPG-система, квесты, дуэли, достижения, настройки. Полное руководство с примерами использования.",
        canonical: "/commands",
    });

    const commandCategories = [
        {
            name: "Основные",
            icon: MessageSquare,
            color: "text-blue-400",
            commands: [
                { cmd: "@Cortes", desc: "Обратиться к боту напрямую", example: "@Cortes что думаешь об этом?" },
                { cmd: "/start", desc: "Начать работу с ботом", example: "/start" },
                { cmd: "/help", desc: "Показать список команд", example: "/help" },
                { cmd: "/stats", desc: "Статистика чата", example: "/stats" }
            ]
        },
        {
            name: "RPG Система",
            icon: Gamepad2,
            color: "text-purple-400",
            commands: [
                { cmd: "/profile", desc: "Показать свой профиль с XP и уровнем", example: "/profile" },
                { cmd: "/top", desc: "Таблица лидеров чата", example: "/top" },
                { cmd: "/daily", desc: "Получить ежедневную награду", example: "/daily" },
                { cmd: "/inventory", desc: "Показать инвентарь", example: "/inventory" }
            ]
        },
        {
            name: "Квесты и Дуэли",
            icon: Trophy,
            color: "text-yellow-400",
            commands: [
                { cmd: "/quest", desc: "Показать текущий квест", example: "/quest" },
                { cmd: "/duel @user", desc: "Вызвать пользователя на дуэль", example: "/duel @username" },
                { cmd: "/accept", desc: "Принять вызов на дуэль", example: "/accept" },
                { cmd: "/achievements", desc: "Список достижений", example: "/achievements" }
            ]
        },
        {
            name: "AI Функции",
            icon: Sparkles,
            color: "text-cyan-400",
            commands: [
                { cmd: "/ask [вопрос]", desc: "Задать вопрос AI", example: "/ask как работает квантовый компьютер?" },
                { cmd: "/summarize", desc: "Краткое содержание обсуждения", example: "/summarize" },
                { cmd: "/translate [текст]", desc: "Перевести текст", example: "/translate Hello world" }
            ]
        },
        {
            name: "Администрирование",
            icon: Settings,
            color: "text-green-400",
            commands: [
                { cmd: "/settings", desc: "Настройки бота (только админы)", example: "/settings" },
                { cmd: "/mute @user [время]", desc: "Замутить пользователя", example: "/mute @user 1h" },
                { cmd: "/warn @user", desc: "Выдать предупреждение", example: "/warn @user" },
                { cmd: "/rules", desc: "Показать правила чата", example: "/rules" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            
            {/* Header */}
            <div className="border-b border-white/10 py-6 sticky top-0 z-50 bg-black/50 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4">
                    <Link href="/">
                        <a className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors w-fit">
                            <ArrowLeft size={20} />
                            <span>Назад на главную</span>
                        </a>
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <Terminal size={16} className="text-primary" />
                            <span className="text-sm font-medium text-white/80">Справочник команд</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold mb-6">
                            Команды <span className="text-gradient-primary">Cortes</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Полный список команд AI-бота для Telegram. RPG-система, квесты, дуэли и многое другое.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Commands */}
            <section className="py-20 relative">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="space-y-12">
                        {commandCategories.map((category, catIdx) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: catIdx * 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${category.color}`}>
                                        <category.icon size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {category.commands.map((command, cmdIdx) => (
                                        <motion.div
                                            key={command.cmd}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: catIdx * 0.1 + cmdIdx * 0.05 }}
                                            className="p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <code className="px-3 py-1 rounded-lg bg-primary/20 text-primary font-mono text-sm">
                                                    {command.cmd}
                                                </code>
                                            </div>
                                            <p className="text-muted-foreground text-sm mb-3">{command.desc}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                                                <span>Пример:</span>
                                                <code className="px-2 py-0.5 rounded bg-white/5 font-mono">{command.example}</code>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="py-20 relative">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Советы по использованию</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "Обращайтесь по имени", desc: "Cortes лучше реагирует, когда вы обращаетесь к нему напрямую через @Cortes" },
                            { title: "Используйте контекст", desc: "Бот понимает контекст разговора — не нужно повторять всю историю" },
                            { title: "RPG каждый день", desc: "Не забывайте про /daily — ежедневные награды накапливаются" },
                            { title: "Дуэли с друзьями", desc: "Дуэли — отличный способ развлечь чат и заработать XP" }
                        ].map((tip, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20"
                            >
                                <h3 className="text-white font-semibold mb-2">{tip.title}</h3>
                                <p className="text-muted-foreground text-sm">{tip.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 relative text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Готовы попробовать?
                    </h2>
                    <p className="text-muted-foreground mb-8">Добавьте Cortes в свой чат и начните использовать команды</p>
                    <a
                        href="https://t.me/thecortesbot?startgroup=add"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all"
                    >
                        Добавить в чат
                    </a>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
