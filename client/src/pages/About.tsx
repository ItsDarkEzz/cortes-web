import { motion } from "framer-motion";
import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import { ArrowLeft, Zap, Shield, Brain, Zap as ZapIcon, MessageSquare, Image, Volume2 } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

export default function About() {
    useSEO({
        title: "О проекте — История создания умного AI-бота",
        description: "Узнайте историю создания Cortes — AI-бота для Telegram. Принципы работы, миссия проекта и планы развития от разработчика Шахриёра.",
        canonical: "/about",
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
                            Кто такой <span className="text-gradient-primary">Cortes?</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Умный Telegram-бот, который вмешивается только когда это нужно. Он не спамит, не раздражает, а просто делает ваш чат лучше.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 relative">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-12">

                        {/* Origin */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-2xl bg-white/[0.03] border border-white/10"
                        >
                            <h2 className="text-3xl font-bold text-white mb-4">История Cortes</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                Всё началось в 2020 году, когда я, Шахриёр, впервые задумался о том, каким должен быть идеальный Telegram-бот. Идея была простой: создать ИИ, который не просто отвечает на команды, а реально понимает контекст и становится частью сообщества.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                Годы разработки, экспериментов и итераций привели к тому, что вы видите сейчас. Cortes — это не просто бот. Это помощник, который учится у вашего чата, адаптируется к его культуре и добавляет ценность каждый день.
                            </p>
                        </motion.div>

                        {/* Philosophy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-2xl bg-white/[0.03] border border-white/10"
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Принципы</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4">
                                        <Brain size={24} />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">Интеллект</h3>
                                    <p className="text-muted-foreground text-sm">Понимает контекст, культуру чата, историю разговора. Не просто отвечает.</p>
                                </div>
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4">
                                        <Shield size={24} />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">Приватность</h3>
                                    <p className="text-muted-foreground text-sm">Все данные зашифрованы. История ваших чатов никому не доступна.</p>
                                </div>
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4">
                                        <Zap size={24} />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">Скорость</h3>
                                    <p className="text-muted-foreground text-sm">Анализирует сообщения за миллисекунды. Мгновенные ответы.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30"
                        >
                            <h2 className="text-3xl font-bold text-white mb-4">Моя миссия</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Сделать каждый Telegram-чат более живым, интересным и привлекательным. Не заменить людей — дополнить их. Cortes — это помощник, который знает, когда говорить, а когда молчать.
                            </p>
                        </motion.div>

                        {/* Developer */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-8 rounded-2xl bg-white/[0.03] border border-white/10"
                        >
                            <h2 className="text-3xl font-bold text-white mb-4">Один разработчик</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                Cortes разрабатывается одним человеком — мной, Шахриёром. Я занимаюсь всем: от архитектуры системы до дизайна интерфейса, от обучения моделей до поддержки пользователей.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Это означает, что каждая строка кода, каждое решение — это результат тщательного анализа и глубокой заботы о качестве. Cortes — это мой проект, мой дом, и я хочу, чтобы он был идеальным.
                            </p>
                        </motion.div>

                        {/* Roadmap */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30"
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Что дальше?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Система модераций</h3>
                                        <p className="text-muted-foreground text-sm">Инструменты для администраторов с AI-помощью</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                                        <ZapIcon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Система фильтраций</h3>
                                        <p className="text-muted-foreground text-sm">Умные фильтры для контроля контента</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                                        <Image size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Генерация изображений</h3>
                                        <p className="text-muted-foreground text-sm">Cortes создаст арт по описанию</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                                        <Volume2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Ответы с голосом</h3>
                                        <p className="text-muted-foreground text-sm">Cortes сможет говорить в голосовых чатах</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 relative text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Готовы встретить Cortes?
                    </h2>
                    <Link href="/">
                        <a className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all no-underline">
                            Вернуться на главную
                        </a>
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
