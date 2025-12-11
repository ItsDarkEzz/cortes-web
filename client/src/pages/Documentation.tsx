import { motion } from "framer-motion";
import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import { ArrowLeft, AlertCircle, BookOpen } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

export default function Documentation() {
    useSEO({
        title: "Документация — Руководство по настройке AI-бота",
        description: "Полное руководство по Cortes: как добавить бота в Telegram, настроить RPG-систему, использовать команды. Пошаговые инструкции с примерами.",
        canonical: "/documentation",
    });

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
                        <h1 className="text-6xl md:text-7xl font-bold mb-6">
                            <span className="text-gradient-primary">Документация</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Полное руководство по работе с Cortes.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Coming Soon */}
            <section className="py-32 relative">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                <AlertCircle size={32} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Скоро</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                            Документация находится в разработке. Полное руководство и примеры использования  будут доступны очень скоро.
                        </p>

                        <div className="inline-block px-6 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 font-mono text-sm">
                            COMING SOON
                        </div>
                    </motion.div>

                    {/* What's Coming */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16"
                    >
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">Что будет в документации</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Как добавить Cortes в ваш чат",
                                "Системные требования и лимиты",
                                "Примеры использования RPG системы",
                                "Интеграция с другими ботами",
                                "Часто задаваемые вопросы",
                                "Советы и трюки для администраторов"
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 + idx * 0.05 }}
                                    className="p-4 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-3"
                                >
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                                        <BookOpen size={12} />
                                    </div>
                                    <span className="text-muted-foreground">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Subscribe */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center"
                    >
                        <p className="text-muted-foreground mb-4">
                            Хотите быть среди первых, кто получит доступ к документации?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <input
                                type="email"
                                placeholder="ваш email"
                                className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 w-full sm:w-auto"
                            />
                            <button className="px-6 py-3 bg-primary rounded-lg text-white font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
                                Подписаться
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
