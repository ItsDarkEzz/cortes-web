import { motion } from "framer-motion";
import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import { ArrowLeft, Shield, VolumeX, Ban, Brain, Zap } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { useState, useEffect } from "react";
import cortesLogo from "@assets/generated_images/cortes_ai_avatar.png";

const TwitchIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
);

const TelegramIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
);

function BannerSection({ title, platform, icon, iconBg, children }: { title: string; platform: string; icon: React.ReactNode; iconBg: string; children: React.ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-white`}>{icon}</div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{title}</h2>
                    <p className="text-base text-muted-foreground">{platform}</p>
                </div>
            </div>
            <div className="space-y-10">{children}</div>
        </motion.div>
    );
}

// Компонент для анимации отдельных букв
function AnimatedText({
    text,
    isVisible,
    baseDelay = 0,
    exitDelay = 0,
    className = "",
    isTitle = false
}: {
    text: string;
    isVisible: boolean;
    baseDelay?: number;
    exitDelay?: number;
    className?: string; // Для передачи классов (например text-transparent, если градиент на родителе)
    isTitle?: boolean
}) {
    const chars = text.split('');
    const totalChars = chars.length;

    return (
        <>
            {chars.map((char, index) => {
                // Появление: слева направо
                const appearDelay = baseDelay + index * 30;

                // Исчезновение: справа налево (обратный порядок)
                // Плюс добавляем exitDelay, чтобы начать исчезновение после других блоков
                const disappearOrderIndex = totalChars - 1 - index;
                const disappearDelay = exitDelay + (disappearOrderIndex * 30);

                return (
                    <motion.span
                        key={`${text}-${index}`}
                        className={isTitle ? "text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30" : className} // className приходит снаружи (например text-transparent)
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{
                            duration: 0.4,
                            ease: "easeInOut",
                            delay: isVisible ? appearDelay / 1000 : disappearDelay / 1000
                        }}
                        style={{
                            display: 'inline-block',
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                );
            })}
        </>
    );
}

// Улучшенная версия LogoReveal, которая сбрасывается для повтора
function LogoRevealLoop({ children, currentSlideIndex, totalSlides }: { children: React.ReactNode; currentSlideIndex: number; totalSlides: number }) {
    // Мы хотим, чтобы логотип "сканировался" на слайде 0.
    // И оставался видимым на 1, 2, 3, 4.
    // И перед возвратом на 0 (конец слайда 4) должен исчезнуть, чтобы снова сканироваться.

    // Простая логика: 
    // Если index === 0: animate from hidden to visible.
    // Если index > 0: stay visible.
    // Проблема: переход 4 -> 0. React увидит изменение state.
    // Если мы на 0, мы хотим start animation.
    // Framer motion сбросит анимацию, если key изменится или если initial/animate поменяются.

    // Используем key={currentSlideIndex === 0 ? 'scan' : 'static'}
    // На 0: initial=hidden, animate=visible.
    // На others: initial=visible, animate=visible.

    const isFirst = currentSlideIndex === 0;

    return (
        <div className="relative overflow-hidden rounded-2xl z-10">
            <motion.div
                key={isFirst ? "scan" : "static"}
                initial={isFirst ? { clipPath: "inset(0 100% 0 0)" } : { clipPath: "inset(0 0 0 0)" }}
                animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // smooth ease
            >
                {children}
            </motion.div>

            {/* Линия только на первом слайде */}
            {isFirst && (
                <motion.div
                    className="absolute top-0 bottom-0 w-[2px] bg-white z-20"
                    style={{
                        boxShadow: "0 0 40px 5px rgba(255, 255, 255, 0.8), 0 0 10px 1px rgba(255, 255, 255, 1)"
                    }}
                    initial={{ left: "0%", opacity: 1 }}
                    animate={{ left: "150%", opacity: 0 }} // Уводим дальше и фейдим
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
            )}
        </div>
    );
}


// Stories баннер — Концепт "Глитч-волна"
// Глобальный триггер для запуска анимации
let storiesPlayTrigger: (() => void) | null = null;

function StoriesPlayButton() {
    return (
        <motion.button
            onClick={() => storiesPlayTrigger?.()}
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary ml-0.5">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <span className="text-white font-medium">Запустить анимацию</span>
        </motion.button>
    );
}

function StoriesGlitchBanner({ autoPlay = true }: { autoPlay?: boolean }) {
    const [phase, setPhase] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(autoPlay);

    // Регистрируем триггер для внешней кнопки
    useEffect(() => {
        storiesPlayTrigger = () => {
            setPhase(0);
            setIsPlaying(true);
        };
        return () => { storiesPlayTrigger = null; };
    }, []);

    useEffect(() => {
        if (!isPlaying) return;
        if (phase === -1) {
            setPhase(0);
            return;
        }

        const durations = [2500, 2500, 2500, 2500, 2500, 2500, 3000];
        
        const timer = setTimeout(() => {
            const nextPhase = (phase + 1) % 7;
            if (nextPhase === 0 && !autoPlay) {
                setIsPlaying(false);
                setPhase(-1);
            } else {
                setPhase(nextPhase);
            }
        }, durations[phase]);

        return () => clearTimeout(timer);
    }, [phase, isPlaying, autoPlay]);

    return (
        <div className="relative w-full aspect-[9/16] overflow-hidden rounded-3xl bg-background">
            {/* Фон как на лендинге */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    radial-gradient(circle at 50% 30%, rgba(120, 119, 198, 0.15), transparent 50%),
                    linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 40px 40px, 40px 40px'
            }} />

            {/* Фаза 0: Логотип + тизер */}
            {phase === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="absolute -inset-6 bg-primary/20 rounded-full blur-3xl" />
                        <img src={cortesLogo} alt="Cortes" className="relative w-32 h-32 rounded-2xl border border-white/10" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-8 text-2xl text-muted-foreground text-center"
                    >
                        Твой чат скучный?
                    </motion.p>
                </div>
            )}

            {/* Фаза 1: Проблема → Решение */}
            {phase === 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl font-bold tracking-tighter text-gradient text-center"
                    >
                        CORTES
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-xl font-medium mt-4 bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent text-center"
                    >
                        AI который оживит общение
                    </motion.p>
                </div>
            )}

            {/* Фаза 2: Ключевая фича */}
            {phase === 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-white text-center leading-tight"
                    >
                        Не бот.
                        <br />
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                            Личность.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground text-center text-lg mt-6"
                    >
                        Шутит, спорит, троллит, помогает
                    </motion.p>
                </div>
            )}

            {/* Фаза 3: Модерация */}
            {phase === 3 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-white text-center leading-tight"
                    >
                        Полная модерация
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground text-center text-lg mt-4"
                    >
                        Бан, мут, фильтры
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="flex gap-4 mt-8"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-red-400">
                            <Shield size={24} />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-orange-400">
                            <VolumeX size={24} />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-red-400">
                            <Ban size={24} />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Фаза 4: Память и контекст */}
            {phase === 4 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-white text-center leading-tight"
                    >
                        Помнит
                        <br />
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                            всё
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground text-center text-lg mt-4"
                    >
                        Контекст, мемы, историю чата
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="mt-8"
                    >
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-purple-400">
                            <Brain size={28} />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Фаза 5: Скорость */}
            {phase === 5 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                    <motion.h2
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-bold text-white text-center"
                    >
                        &lt;200ms
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-2xl font-bold mt-2 bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent"
                    >
                        Мгновенные ответы
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                    >
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400">
                            <Zap size={28} />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Фаза 6: CTA */}
            {phase === 6 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                    <motion.img
                        src={cortesLogo}
                        alt="Cortes"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-24 h-24 rounded-xl border border-white/10 mb-6"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg mb-6"
                    >
                        Бесплатно в Telegram
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                    >
                        @TheCortesBot
                    </motion.div>
                </div>
            )}
        </div>
    );
}

// Статический баннер для Twitch - вариант 1
function TwitchBannerStatic() {
    return (
        <div className="relative w-full aspect-[5/1] overflow-hidden rounded-3xl bg-background border border-white/10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-60" />

            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-20">
                <div className="relative flex-shrink-0">
                    <div className="absolute -inset-3 bg-primary/30 rounded-3xl blur-2xl" />
                    <img src={cortesLogo} alt="Cortes" className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-2xl object-cover border border-white/10" />
                </div>

                <div className="ml-6 md:ml-10 lg:ml-14 flex-1">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
                        CORTES
                    </h1>
                    <div className="text-xl md:text-3xl lg:text-4xl mt-3 font-bold">
                        <p className="leading-tight text-transparent bg-clip-text bg-gradient-to-b from-primary to-purple-400">
                            Искусственный интеллект
                        </p>
                        <p className="leading-tight text-transparent bg-clip-text bg-gradient-to-b from-primary to-purple-400">
                            для твоего чата
                        </p>
                    </div>
                </div>

                <div className="hidden lg:block relative z-10">
                    <span className="text-2xl font-bold text-white/50 block text-right">
                        @TheCortesBot
                    </span>
                </div>
            </div>
        </div>
    );
}

// Статический баннер для Twitch - вариант 2 (с фичами)
function TwitchBannerStaticFeatures() {
    return (
        <div className="relative w-full aspect-[5/1] overflow-hidden rounded-3xl bg-background border border-white/10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-60" />

            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16 lg:px-20">
                <div className="flex items-center gap-6 md:gap-10">
                    <div className="relative flex-shrink-0">
                        <div className="absolute -inset-3 bg-primary/30 rounded-3xl blur-2xl" />
                        <img src={cortesLogo} alt="Cortes" className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl object-cover border border-white/10" />
                    </div>

                    <div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 mb-2">
                            CORTES
                        </h1>
                        <p className="text-xl md:text-xl lg:text-2xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-primary to-purple-400 font-medium">
                            Искусственный интеллект для твоего чата
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Brain className="text-purple-400" size={28} />
                        </div>
                        <span className="text-sm font-semibold text-white/70">Память</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Shield className="text-blue-400" size={28} />
                        </div>
                        <span className="text-sm font-semibold text-white/70">Модерация</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Zap className="text-yellow-400" size={28} />
                        </div>
                        <span className="text-sm font-semibold text-white/70">&lt;200ms</span>
                    </div>

                    <div className="ml-4 px-6 py-3 bg-gradient-to-r from-primary to-purple-500 rounded-full">
                        <span className="text-lg font-bold text-white">@TheCortesBot</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Анимированный баннер для GIF
function TwitchBannerAnimated() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Новые слайды V3 "Профессиональный/Вовлекающий"
    const slides = [
        {
            line1: "CORTES",
            line2: "Искусственный интеллект",
            line3: "для твоего чата", // Short, value-focused
            extra: "AI 2.0"
        },
        {
            line1: "ОБЩЕНИЕ",
            line2: "Самостоятельно общается",
            line3: "в твоем чате",
            extra: "Чат"
        },
        {
            line1: "ЛИЧНОСТЬ",
            line2: "Уникальный характер",
            line3: "под стиль чата",
            extra: "Стиль"
        },
        {
            line1: "КОНТЕКСТ",
            line2: "Помнит историю",
            line3: "и локальные мемы",
            extra: "Память"
        },
        {
            line1: "СТАРТ",
            line2: "Попробуй бесплатно",
            line3: "прямо сейчас",
            extra: "@TheCortesBot"
        }
    ];

    const currentSlide = slides[currentIndex];
    const totalCharsLine1 = currentSlide.line1.length;
    const totalCharsLine2 = currentSlide.line2.length;
    const totalCharsLine3 = currentSlide.line3.length;
    const totalCharsExtra = currentSlide.extra.length;

    // Задержки на появление (Entry Delay)
    // Сначала Заголовок, потом Подзаголовок 1, потом Подзаголовок 2
    const entryDelay1 = 0;
    const entryDelay2 = entryDelay1 + (totalCharsLine1 * 30) + 100; // Ждем пока появится заголовок + пауза
    const entryDelay3 = entryDelay2 + (totalCharsLine2 * 30) + 100; // Ждем подзаголовок 1 + пауза
    // Extra появляется последним
    const entryDelayExtra = entryDelay3 + (totalCharsLine3 * 30) + 100;

    // Полное время на появление всего текста
    const totalAppearanceTime = entryDelayExtra + (totalCharsExtra * 30) + 400;

    // Задержки на исчезновение (Exit Delay)
    // Сначала Подзаголовок 2 (снизу), потом Подзаголовок 1, потом Заголовок
    // Кнопка исчезает первой или вместе с низом (логика для слайда 5 такая же как для всех)
    const exitDelayExtra = 0;
    const exitDelay3 = 100;
    const exitDelay2 = exitDelay3 + (totalCharsLine3 * 30) + 50; // Ждем пока исчезнет низ
    const exitDelay1 = exitDelay2 + (totalCharsLine2 * 30) + 50; // Ждем пока исчезнет середина

    // Полное время исчезновения
    const totalExitTime = exitDelay1 + (totalCharsLine1 * 30) + 400;

    useEffect(() => {
        // 1. Сразу запускаем появление после монтирования или смены слайда
        // Используем requestAnimationFrame или малую задержку, чтобы браузер успел отрисовать opacity: 0
        const startTimer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        // 2. Таймер на начало исчезновения
        // Держим текст на экране некоторое время (например 3000мс) после полного появления
        const holdTime = 3000;
        const startExitTimerVal = totalAppearanceTime + holdTime;

        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, startExitTimerVal);

        // 3. Таймер на смену слайда
        // Меняем слайд только когда всё полностью исчезнет
        const changeSlideTimerVal = startExitTimerVal + totalExitTime + 100;

        const nextTimer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
            // Обратите внимание: isVisible здесь уже false, и мы его не ставим в true сразу.
            // isVisible = true выставится следующим эффектом после смены currentIndex
        }, changeSlideTimerVal);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(hideTimer);
            clearTimeout(nextTimer);
        };
    }, [currentIndex, totalAppearanceTime, totalExitTime]); // Зависимости обновляются при смене слайда

    return (
        <div className="relative w-full aspect-[5/1] overflow-hidden rounded-3xl bg-background border border-white/10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-60" />

            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-20">
                <div className="relative flex-shrink-0">
                    <div className="absolute -inset-3 bg-primary/30 rounded-3xl blur-2xl" />
                    <LogoRevealLoop currentSlideIndex={currentIndex} totalSlides={slides.length}>
                        <img src={cortesLogo} alt="Cortes" className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-2xl object-cover border border-white/10" />
                    </LogoRevealLoop>
                </div>

                <div className="ml-6 md:ml-10 lg:ml-14 flex-1">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
                        <AnimatedText
                            text={currentSlide.line1}
                            isVisible={isVisible}
                            baseDelay={entryDelay1}
                            exitDelay={exitDelay1}
                            isTitle={true}
                        />
                    </h1>
                    {/* Применяем градиент к каждой букве вертикально для плавной анимации */}
                    <div className="text-xl md:text-3xl lg:text-4xl mt-3 font-bold">
                        <p className="leading-tight">
                            <AnimatedText
                                text={currentSlide.line2}
                                isVisible={isVisible}
                                baseDelay={entryDelay2}
                                exitDelay={exitDelay2}
                                className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-purple-400"
                            />
                        </p>
                        <p className="leading-tight">
                            <AnimatedText
                                text={currentSlide.line3}
                                isVisible={isVisible}
                                baseDelay={entryDelay3}
                                exitDelay={exitDelay3}
                                className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-purple-400"
                            />
                        </p>
                    </div>
                </div>

                <div className="hidden lg:block relative z-10">
                    <span className="text-2xl font-bold text-white/50 block text-right">
                        <AnimatedText
                            text={currentSlide.extra}
                            isVisible={isVisible}
                            baseDelay={entryDelayExtra}
                            exitDelay={exitDelayExtra}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function Banners() {
    useSEO({ title: "Рекламные баннеры — Cortes AI Bot", description: "Рекламные баннеры Cortes для размещения у стримеров и ютуберов.", canonical: "/banners" });

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <div className="border-b border-white/10 py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4">
                    <Link href="/"><a className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors w-fit"><ArrowLeft size={20} /><span>Назад на главную</span></a></Link>
                </div>
            </div>

            <section className="py-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[200px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">Рекламные <span className="text-gradient-primary">баннеры</span></h1>
                        <p className="text-xl text-muted-foreground">Для размещения рекламы у стримеров и ютуберов</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-8 pb-24">
                <div className="max-w-7xl mx-auto px-4">
                    <BannerSection title="Twitch" platform="1920×384" icon={<TwitchIcon size={24} />} iconBg="bg-[#9146FF]">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Статический баннер — вариант 1</h3>
                                <TwitchBannerStatic />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Статический баннер — вариант 2</h3>
                                <TwitchBannerStaticFeatures />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Анимированный баннер</h3>
                                <TwitchBannerAnimated />
                            </div>
                        </div>
                    </BannerSection>

                    <BannerSection title="Telegram / Instagram Stories" platform="1080×1920 (9:16)" icon={<TelegramIcon size={24} />} iconBg="bg-gradient-to-br from-[#0088cc] to-[#833AB4]">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-[320px]">
                                <StoriesGlitchBanner autoPlay={false} />
                            </div>
                            <StoriesPlayButton />
                        </div>
                    </BannerSection>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// Экспорт только баннера для записи GIF
export function BannerExport() {
    return (
        <div className="bg-background" style={{ width: '1920px', height: '384px' }}>
            <TwitchBannerAnimated />
        </div>
    );
}

// Экспорт статического баннера
export function StaticBannerExport() {
    return (
        <div className="bg-background" style={{ width: '1920px', height: '384px' }}>
            <TwitchBannerStatic />
        </div>
    );
}

// Экспорт статического баннера с фичами
export function StaticBannerFeaturesExport() {
    return (
        <div className="bg-background" style={{ width: '1920px', height: '384px' }}>
            <TwitchBannerStaticFeatures />
        </div>
    );
}

// Экспорт Stories баннера для записи (1080x1920)
export function StoriesBannerExport() {
    return (
        <div style={{ width: '1080px', height: '1920px' }}>
            <StoriesGlitchBanner />
        </div>
    );
}
