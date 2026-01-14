import { motion } from "framer-motion";
import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { useState, useEffect } from "react";
import cortesLogo from "@assets/generated_images/cortes_ai_avatar.png";

const TwitchIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
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
                        <div>
                            <TwitchBannerAnimated />
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
