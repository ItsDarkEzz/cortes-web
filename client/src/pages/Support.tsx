import { motion } from "framer-motion";
import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import { ArrowLeft, MessageCircle, Mail, Zap, ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

export default function Support() {
    useSEO({
        title: "Поддержка — Помощь с AI-ботом для Telegram",
        description: "Нужна помощь с Cortes? Telegram-поддержка с ответом в течение часа, email, FAQ. Присоединяйтесь к сообществу пользователей.",
        canonical: "/support",
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

            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-6xl md:text-7xl font-bold mb-6">
                            Нужна <span className="text-gradient-primary">помощь?</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Мы здесь, чтобы помочь. Выберите удобный способ связи.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Support Channels */}
            <section className="py-20 relative">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Telegram */}
                        <motion.a
                            href="https://t.me/ItsDarkEz"
                            target={"_blank"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-all group hover:scale-105"
                        >
                            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Telegram</h3>
                            <p className="text-muted-foreground mb-6">
                                Пишите нам в чат поддержки. Ответ в течение часа.
                            </p>
                            <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                                <span>Написать</span>
                                <ExternalLink size={18} />
                            </div>
                        </motion.a>

                        {/* Email */}
                        <motion.a
                            href="mailto:support@thecortes.ru"
                            target={"_blank"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all group hover:scale-105"
                        >
                            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Email</h3>
                            <p className="text-muted-foreground mb-6">
                                Отправьте нам письмо на поддержку. Ответим в течение 24 часов.
                            </p>
                            <div className="flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-3 transition-all">
                                <span>support@thecortes.ru</span>
                                <ExternalLink size={18} />
                            </div>
                        </motion.a>

                        {/* Community */}
                        <motion.a
                            href="https://t.me/TheCortesChat"
                            target={"_blank"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-500/50 transition-all group hover:scale-105"
                        >
                            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Community</h3>
                            <p className="text-muted-foreground mb-6">
                                Присоединитесь к сообществу пользователей Cortes.
                            </p>
                            <div className="flex items-center gap-2 text-green-400 font-semibold group-hover:gap-3 transition-all">
                                <span>Перейти</span>
                                <ExternalLink size={18} />
                            </div>
                        </motion.a>

                    </div>
                </div>
            </section>

            {/* FAQ Quick Links */}
            <section className="py-20 relative">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Популярные вопросы
                    </h2>

                    <div className="space-y-4">
                        {[
                            { q: "Как добавить Cortes в мой чат?", a: "Нажмите кнопку внизу на главной странице, выберите группу и дайте боту необходимые права." },
                            { q: "Cortes не отвечает на мои сообщения", a: "Это нормально! Cortes отвечает только когда это нужно. Попробуйте обратиться к нему по имени @Cortes." },
                            { q: "Безопасны ли мои данные?", a: "Да, полностью. Все сообщения шифруются, и мы не храним историю ваших чатов." },
                            { q: "Когда выйдет режим модератора?", a: "Находится в разработке. Следите за обновлениями в нашем сообществе." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.05 }}
                                className="p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary/20 transition-all"
                            >
                                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                                <p className="text-muted-foreground text-sm">{item.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Status */}
            <section className="py-20 relative">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-mono text-green-400">SYSTEM STATUS: ONLINE</span>
                        </div>
                        <p className="text-muted-foreground">
                            Все системы работают нормально. Время ответа: <span className="text-white font-semibold">&lt;50ms</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>

    );
}
