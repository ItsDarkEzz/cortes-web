import { Footer } from "@/components/cortes/Footer";
import { ArrowUpRight, Mail, MessageCircle, Zap } from "lucide-react";
import {
  Reveal,
  SectionKicker,
  SiteFrame,
  SiteHeader,
  supportEmail,
  telegramAddUrl,
  telegramChannelUrl,
  telegramSupportUrl,
} from "@/components/cortes/SiteChrome";
import { useSEO } from "@/hooks/use-seo";

const channels = [
  {
    icon: MessageCircle,
    label: "Telegram support",
    value: "@ItsDarkEz",
    description: "Самый быстрый путь, если нужно решить проблему по реальной настройке или поведению бота.",
    href: telegramSupportUrl,
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
    border: "border-[#3B82F6]/20",
  },
  {
    icon: Mail,
    label: "Email",
    value: supportEmail,
    description: "Подходит для длинных вопросов, баг-репортов и всего, что удобнее описывать письмом.",
    href: `mailto:${supportEmail}`,
    color: "text-[#8B5CF6]",
    bg: "bg-[#8B5CF6]/10",
    border: "border-[#8B5CF6]/20",
  },
  {
    icon: Zap,
    label: "Channel",
    value: "@TheCortes",
    description: "Новости продукта, обновления и новые сценарии использования без лишнего шума.",
    href: telegramChannelUrl,
    color: "text-white",
    bg: "bg-white/10",
    border: "border-white/20",
  },
];

const faq = [
  {
    question: "Как добавить Cortes в мой чат?",
    answer:
      "Откройте установочную ссылку, выберите группу и выдайте боту нужные права. Дальше уже стоит зайти в дашборд и сразу зафиксировать режим поведения.",
  },
  {
    question: "Почему Cortes иногда молчит?",
    answer:
      "Потому что это часть дизайна продукта. Если вопрос не требует памяти, аналитики или участия бота, промолчать часто полезнее ещё одной автоматической реплики.",
  },
  {
    question: "Безопасны ли мои данные?",
    answer:
      "Cortes хранит часть истории и извлечённых фактов, чтобы держать контекст разговора. Вы в любой момент можете удалить бота, и логика перестанет собирать контекст.",
  },
  {
    question: "Где следить за обновлениями?",
    answer:
      "Быстрее всего — в Telegram-канале проекта. Там появляются продуктовые апдейты, сценарии использования и заметки по развитию.",
  },
];

export default function Support() {
  useSEO({
    title: "Поддержка — Помощь с AI-ботом для Telegram",
    description:
      "Нужна помощь с Cortes? Telegram-поддержка с ответом в течение часа, email, FAQ. Присоединяйтесь к сообществу пользователей.",
    canonical: "/support",
  });

  return (
    <SiteFrame>
      <SiteHeader />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 cortes-shell overflow-hidden">
          {/* Violet orbital glow */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />
          
          <Reveal>
            <SectionKicker>Поддержка</SectionKicker>
            <h1 className="mt-8 max-w-5xl font-cortes-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.85] tracking-[-0.06em] text-white">
              Прямые каналы. <br />
              <span className="text-white/40">Без тикетов.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white/50">
              Поддержка устроена так же, как и сам продукт: без лишнего шума. Если вопрос надо решить быстро — пишите в Telegram. Нужно больше контекста — пишите на email.
            </p>
          </Reveal>
        </section>

        {/* CHANNELS GRID */}
        <section className="cortes-shell py-20 mt-10">
          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((channel, index) => (
              <Reveal
                key={channel.label}
                delay={index * 0.1}
                className="group relative"
              >
                <a
                  href={channel.href}
                  target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="block h-full rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04] overflow-hidden"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${channel.bg} border ${channel.border} mb-8`}>
                    <channel.icon className={`h-5 w-5 ${channel.color}`} />
                  </div>
                  
                  <div className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] mb-4">
                    {channel.label}
                  </div>
                  <h3 className="text-2xl font-cortes-display text-white mb-4">
                    {channel.value}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50 mb-8">
                    {channel.description}
                  </p>

                  <div className="mt-auto inline-flex items-center gap-2 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                    Открыть
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="cortes-shell py-20 mt-20 mb-40">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
             <Reveal className="lg:sticky lg:top-40">
               <SectionKicker>Частые Вопросы</SectionKicker>
               <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                 База знаний.
               </h2>
               <p className="mt-6 text-lg leading-relaxed text-white/40">
                 Ниже только самые частые ситуации. Всё, что связано с конкретным чатом, режимом или памятью, лучше сразу обсуждать напрямую.
               </p>
               
               <a
                 href={telegramSupportUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-white px-8 font-cortes-mono text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
               >
                 Написать в Telegram
               </a>
             </Reveal>

             <div className="grid gap-4">
               {faq.map((item, index) => (
                 <Reveal
                   key={item.question}
                   delay={index * 0.1}
                   className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#15110d] to-[#09090b] p-8 md:p-10"
                 >
                   <h3 className="font-cortes-display text-2xl text-white mb-4">{item.question}</h3>
                   <p className="text-base leading-relaxed text-white/50">{item.answer}</p>
                 </Reveal>
               ))}
             </div>
           </div>
        </section>
      </main>

      <Footer />
    </SiteFrame>
  );
}
