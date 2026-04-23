import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingPageSchemas } from "@/components/SEOSchema";
import { Footer } from "@/components/cortes/Footer";
import {
  Reveal,
  SectionKicker,
  SiteFrame,
  SiteHeader,
  telegramAddUrl,
  telegramChannelUrl,
  telegramSupportUrl,
} from "@/components/cortes/SiteChrome";
import { useSEO } from "@/hooks/use-seo";
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Command,
  FileText,
  ImageIcon,
  LayoutDashboard,
  MessageSquareText,
  Mic,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const signalFacts = [
  {
    label: "Базовая модель",
    value: "5.2",
    note: "Основная reasoning-модель для ответов.",
  },
  {
    label: "Память",
    value: "20k",
    note: "Токенов локальной истории тредов.",
  },
  {
    label: "Фильтры",
    value: "40+",
    note: "Контентных и NSFW проверок в потоке.",
  },
  {
    label: "Отклик",
    value: "0.3s",
    note: "Оценка уместности ответа до генерации.",
  },
];

const operatingLayers = [
  {
    index: "01",
    title: "Логика наблюдателя",
    body: "Сначала бот читает комнату: кто говорит, к кому обращаются. Определяет, нужен ли ответ вообще. Отслеживает прямые обращения и повторяющиеся темы.",
  },
  {
    index: "02",
    title: "Память и аналитика",
    body: "Когда участие уместно, Cortes тянет историю, факты по людям и контекст последних веток. Помнит локальные договорённости.",
  },
  {
    index: "03",
    title: "Панель управления",
    body: "Последнее слово за владельцем. Ручные команды модерации, автоматические фильтры и дашборд с логами и настройками поведения.",
  },
];

const scenarios = [
  {
    name: "Команда разработки",
    message: "Кортес, напомни, почему откатили последний релиз?",
    read: "Прямой вызов, запрос к памяти, рабочий тон.",
    answer:
      "Откатили из-за ошибок в авторизации. Фикс в ветке, но безопаснее после проверки.",
  },
  {
    name: "Режим тишины",
    message: "Кто-нибудь видел презентацию с созвона?",
    read: "Запрос к людям, не к памяти бота.",
    answer: "Cortes молчит. Не вмешивается только ради присутствия.",
  },
];

const faqItems = [
  {
    question: "Cortes отвечает на каждое сообщение?",
    answer: "Нет. Cortes вмешивается только там, где ответ реально нужен: когда его позвали, нужен recall или аккуратный ответ.",
  },
  {
    question: "Какая moderation работает автоматически?",
    answer: "Фильтры контента: стоп-слова, репосты, медиа. Баны и муты — вручную через команды.",
  },
  {
    question: "Что в dashboard?",
    answer: "Режимы поведения, фильтры, история действий, память, инструкции и рабочие журналы по чату.",
  },
];

export default function LandingPage() {
  useSEO({
    title: "Cortes AI — Telegram-бот с памятью, moderation и dashboard",
    description: "Cortes — AI-бот для Telegram-групп: понимает контекст, не отвечает без повода, помогает с moderation и управляется через dashboard.",
    canonical: "/",
  });

  return (
    <SiteFrame>
      <LandingPageSchemas />
      <SiteHeader />

      <main className="relative z-10 pt-32 pb-40">
        
        {/* HERO SECTION */}
        <section className="cortes-shell min-h-[75vh] flex flex-col justify-center items-center text-center">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </span>
              Система Активна
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative max-w-[90vw]">
            <h1 className="font-cortes-display text-[clamp(4.5rem,14vw,14rem)] leading-[0.8] tracking-[-0.06em] text-white relative z-10 [text-shadow:0_0_80px_rgba(255,255,255,0.15)] mix-blend-screen">
              Держать
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">паузу.</span>
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#3B82F6] blur-[140px] rounded-full opacity-10 pointer-events-none -z-10" />
            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#8B5CF6] blur-[140px] rounded-full opacity-[0.15] pointer-events-none -z-10" />
          </Reveal>

          <Reveal delay={0.3} className="mt-14 max-w-2xl mx-auto px-4">
            <p className="text-lg md:text-2xl leading-relaxed text-white/50 font-light">
              Самая редкая функция ИИ — умение промолчать. Cortes читает комнату, 
              держит локальный контекст и помогает с модерацией, не превращая чат в свалку генеративного шума.
            </p>
          </Reveal>

          <Reveal delay={0.4} className="mt-14 flex flex-col sm:flex-row items-center gap-6">
            <a
              href={telegramAddUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 font-cortes-mono text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Добавить бота
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
            <Link href="/dashboard" className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-cortes-mono text-[12px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10">
              Личный кабинет
            </Link>
          </Reveal>
        </section>

        {/* METRICS - MASSIVE BENTO */}
        <section className="cortes-shell mt-40">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             {signalFacts.map((fact, i) => (
               <Reveal key={fact.label} delay={i * 0.1} className="flex flex-col justify-between rounded-3xl bg-white/[0.02] border border-white/5 p-8 md:p-10 aspect-square group hover:bg-white/[0.04] transition-colors">
                 <p className="font-cortes-mono text-[10px] uppercase tracking-[0.3em] text-[#3B82F6]">{fact.label}</p>
                 <div>
                   <p className="font-cortes-display text-[clamp(4rem,8vw,6rem)] leading-[0.8] tracking-[-0.06em] text-white mb-4 group-hover:scale-105 transition-transform origin-bottom-left ease-out duration-500">{fact.value}</p>
                   <p className="text-sm text-white/40 leading-relaxed">{fact.note}</p>
                 </div>
               </Reveal>
             ))}
           </div>
        </section>

        {/* PROTOCOL */}
        <section id="protocol" className="cortes-shell mt-40 pt-20">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-start">
            <Reveal className="lg:sticky lg:top-40">
              <SectionKicker>Протокол и Архитектура</SectionKicker>
              <h2 className="mt-6 font-cortes-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.85] tracking-[-0.06em] text-white">
                Фильтрация 
                <br />до ответа.
              </h2>
              <p className="mt-8 text-lg text-white/50 leading-relaxed max-w-sm">
                Архитектура Cortes построена вокруг оценки уместности. Бот не бросается отвечать на каждое сообщение, а пропускает поток через слои модерации и памяти.
              </p>
            </Reveal>

            <div className="space-y-4">
              {operatingLayers.map((layer, i) => (
                <Reveal key={layer.index} delay={i * 0.1} className="rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 p-10 md:p-14">
                  <div className="font-cortes-display text-[8rem] leading-[0.7] tracking-[-0.1em] text-white/5 mb-8 selection:bg-transparent">
                    {layer.index}
                  </div>
                  <h3 className="font-cortes-display text-4xl tracking-[-0.04em] text-white mb-6">
                    {layer.title}
                  </h3>
                  <p className="text-xl text-white/60 leading-relaxed max-w-xl">
                    {layer.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CONTROL SURFACES BENTO */}
        <section className="cortes-shell mt-40">
          <SectionKicker>Панели Управления</SectionKicker>
          <h2 className="mt-6 max-w-3xl font-cortes-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.85] tracking-[-0.06em] text-white mb-16">
            Управление и модерация. Без магии.
          </h2>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
             
            {/* Main Reasoning Card - spans 2x2 */}
            <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#15110d] to-[#09090b] p-8 md:p-10 md:col-span-2 md:row-span-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(139,92,246,0.15),transparent_50%)]" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-8">
                    <BrainCircuit className="h-6 w-6 text-[#8B5CF6]" />
                  </div>
                  <h3 className="font-cortes-display text-4xl tracking-[-0.04em] text-white mb-6">Уровень Аналитики</h3>
                  <p className="text-xl text-white/50 leading-relaxed max-w-md">
                    Бот помнит сюжет чата. Контекст, персоны, локальные мемы и договоренности не обнуляются после пары сообщений. Чувство вовлеченности вместо сиюминутных ответов.
                  </p>
                </div>
                
                <div className="mt-12 flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60"><Bot className="w-3 h-3"/> Характер</span>
                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60"><MessageSquareText className="w-3 h-3"/> Память</span>
                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60"><Sparkles className="w-3 h-3"/> Тон</span>
                </div>
              </div>
            </Reveal>

            {/* Moderation Card */}
            <Reveal delay={0.2} className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 md:col-span-1 lg:col-span-2 flex flex-col justify-start overflow-hidden relative">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-[#3B82F6]/20 blur-[60px]" />
              <div className="relative z-10">
                <Command className="h-8 w-8 text-white/40 mb-6" />
                <h3 className="font-cortes-display text-2xl text-white mb-4">Ручной контроль</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6">Команды для админов и автоматические фильтры. Авто-сценарии только там, где можно задать ясные правила.</p>
              </div>
              <div className="mt-auto pt-6 space-y-2 relative z-10">
                {["/ban, /mute, /warn", "Стоп-слова и репосты", "NSFW фильтры"].map(t => (
                  <div key={t} className="rounded-xl bg-white/5 px-4 py-3 text-xs text-white/60 border border-white/[0.05]">{t}</div>
                ))}
              </div>
            </Reveal>

            {/* Inputs Card */}
            <Reveal delay={0.3} className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col justify-between">
              <div>
                <Mic className="h-8 w-8 text-white/40 mb-6" />
                <h3 className="font-cortes-display text-2xl text-white mb-4">Форматы</h3>
              </div>
              <p className="text-sm text-white/50 leading-relaxed mt-4">Понимает голосовые, PDF, фото, длинные рабочие треды.</p>
            </Reveal>

            {/* Dashboard Card */}
            <Reveal delay={0.4} className="rounded-3xl border border-white/5 bg-[#09090b] p-8 flex flex-col justify-between relative overflow-hidden ring-1 ring-inset ring-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.1),transparent_70%)]" />
              <div className="relative z-10">
                <LayoutDashboard className="h-8 w-8 text-[#3B82F6] mb-6" />
                <h3 className="font-cortes-display text-2xl text-white mb-4">Дашборд</h3>
                <p className="text-sm text-white/50 leading-relaxed mt-4">Настройка поведения, логи модерации и точка входа без возни в TG.</p>
              </div>
            </Reveal>

          </div>
        </section>

        {/* SCENARIOS CHAT UI */}
        <section id="scenarios" className="cortes-shell mt-40">
          <SectionKicker>Сценарии</SectionKicker>
          <h2 className="mt-6 max-w-3xl font-cortes-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.06em] text-white">
            Поведение вживую.
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {scenarios.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.1} className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 relative overflow-hidden group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-10">
                    <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{s.name}</p>
                    <div className="h-2 w-2 rounded-full bg-[#8B5CF6] group-hover:scale-150 transition-transform" />
                  </div>
                  
                  {/* Message Bubble User */}
                  <div className="flex gap-4 mb-8">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex-shrink-0" />
                    <div className="rounded-2xl rounded-tl-sm bg-white/10 px-5 py-4 text-sm text-white/80 max-w-[85%] border border-white/5 shadow-2xl backdrop-blur">
                      {s.message}
                    </div>
                  </div>

                  {/* Message Bubble Bot */}
                  <div className="flex gap-4 justify-end mb-8 relative z-10">
                    <div className="rounded-2xl rounded-tr-sm bg-[#8B5CF6]/90 px-5 py-4 text-sm text-white max-w-[85%] shadow-[0_10px_40px_rgba(139,92,246,0.4)]">
                      {s.answer}
                    </div>
                    <div className="h-8 w-8 bg-white flex items-center justify-center rounded-full flex-shrink-0 shadow-lg font-cortes-display text-black font-bold text-xs">C</div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-cortes-mono text-[9px] uppercase tracking-[0.2em] text-[#3B82F6] mb-2">Оценка системы</p>
                  <p className="text-sm text-white/40 leading-relaxed font-cortes-mono">{s.read}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ ACORDION */}
        <section id="faq" className="cortes-shell mt-40">
           <div className="grid lg:grid-cols-2 gap-16 items-start">
             <div>
               <SectionKicker>Частые Вопросы</SectionKicker>
               <h2 className="mt-6 font-cortes-display text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.85] tracking-[-0.06em] text-white">
                 База знаний.
               </h2>
             </div>
             
             <div className="w-full">
               <Accordion type="single" collapsible className="w-full">
                 {faqItems.map((item, index) => (
                   <AccordionItem
                     key={item.question}
                     value={`item-${index}`}
                     className="border-b border-white/10 px-0 last:border-b-0"
                   >
                     <AccordionTrigger className="py-8 text-left font-cortes-display text-[1.5rem] leading-tight text-white hover:no-underline md:text-[2rem] hover:text-[#3B82F6] transition-colors">
                       {item.question}
                     </AccordionTrigger>
                     <AccordionContent className="pb-8 text-lg leading-relaxed text-white/50">
                       {item.answer}
                     </AccordionContent>
                   </AccordionItem>
                 ))}
               </Accordion>
             </div>
           </div>
        </section>

      </main>
      <Footer />
    </SiteFrame>
  );
}
