import { motion } from "framer-motion";
import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import { ArrowLeft, Check, Sparkles, Zap, Crown } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { SEOSchema } from "@/components/SEOSchema";

export default function Pricing() {
    useSEO({
        title: "Тарифы и цены — Бесплатный AI-бот для Telegram",
        description: "Cortes полностью бесплатен во время бета-тестирования. Все функции доступны без ограничений: RPG-система, квесты, AI-ответы. Узнайте о будущих тарифах.",
        canonical: "/pricing",
    });

    const plans = [
        {
            name: "Free",
            price: "0 ₽",
            period: "навсегда",
            description: "Базовые функции для небольших чатов",
            features: [
                "До 500 участников в чате",
                "AI-ответы на сообщения",
                "Базовая RPG-система",
                "Квесты и достижения",
                "Поддержка сообщества"
            ],
            cta: "Добавить бесплатно",
            href: "https://t.me/thecortesbot?startgroup=add",
            popular: false,
            icon: Zap,
            gradient: "from-blue-500/20 to-cyan-500/20",
            border: "border-blue-500/30"
        },
        {
            name: "Beta",
            price: "0 ₽",
            period: "сейчас",
            description: "Все функции Pro бесплатно во время бета",
            features: [
                "Неограниченное количество участников",
                "Полный доступ к AI",
                "Расширенная RPG-система",
                "Приоритетная поддержка",
                "Все будущие функции",
                "Ранний доступ к обновлениям"
            ],
            cta: "Получить Beta-доступ",
            href: "https://t.me/thecortesbot?startgroup=add",
            popular: true,
            icon: Sparkles,
            gradient: "from-primary/20 to-purple-500/20",
            border: "border-primary/50"
        },
        {
            name: "Pro",
            price: "скоро",
            period: "",
            description: "Для крупных сообществ и бизнеса",
            features: [
                "Всё из Free",
                "Неограниченные участники",
                "Продвинутая модерация",
                "Кастомизация персоны",
                "API доступ",
                "Приоритетная поддержка 24/7"
            ],
            cta: "Скоро",
            href: "#",
            popular: false,
            icon: Crown,
            gradient: "from-yellow-500/20 to-orange-500/20",
            border: "border-yellow-500/30",
            disabled: true
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <SEOSchema type="software" />
            
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-green-400">Бета-тестирование — всё бесплатно!</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold mb-6">
                            Тарифы <span className="text-gradient-primary">Cortes</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Сейчас все функции AI-бота для Telegram доступны бесплатно. Присоединяйтесь к бета-тестированию.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 relative">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative p-8 rounded-2xl bg-gradient-to-br ${plan.gradient} border ${plan.border} ${plan.popular ? 'scale-105 shadow-[0_0_40px_rgba(139,92,246,0.3)]' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-sm font-bold text-white">
                                        Рекомендуем
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${plan.popular ? 'text-primary' : 'text-white'}`}>
                                        <plan.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground ml-2">/ {plan.period}</span>}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                            <Check size={18} className="text-green-400 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={plan.href}
                                    target={plan.href.startsWith('http') ? '_blank' : undefined}
                                    rel={plan.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                                        plan.disabled 
                                            ? 'bg-white/10 text-muted-foreground cursor-not-allowed'
                                            : plan.popular 
                                                ? 'bg-white text-black hover:bg-white/90' 
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {plan.cta}
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 relative">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Вопросы о тарифах</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Почему Cortes бесплатный?", a: "Мы находимся в стадии бета-тестирования и хотим собрать обратную связь от пользователей. Все функции доступны бесплатно, чтобы вы могли оценить возможности бота." },
                            { q: "Когда появятся платные тарифы?", a: "Платные тарифы появятся после завершения бета-тестирования. Базовая версия останется бесплатной навсегда." },
                            { q: "Что будет с моим чатом после бета?", a: "Все чаты, добавленные во время бета, получат специальные условия и скидки на Pro-тариф." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="p-6 rounded-xl bg-white/[0.03] border border-white/10"
                            >
                                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                                <p className="text-muted-foreground text-sm">{item.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
