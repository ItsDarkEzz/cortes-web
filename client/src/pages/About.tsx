import { Footer } from "@/components/cortes/Footer";
import {
  Reveal,
  SectionKicker,
  SiteFrame,
  SiteHeader,
  telegramAddUrl,
} from "@/components/cortes/SiteChrome";
import { useSEO } from "@/hooks/use-seo";

const principles = [
  "Не отвечать без пользы, даже если ответить технически можно.",
  "Держать контекст дольше, чем живёт текущая ветка разговора.",
  "Оставлять владельцу чата контроль через дашборд, а не магию без рычагов.",
];

const chapters = [
  {
    index: "01",
    title: "Откуда появилась идея",
    body: [
      "Cortes начался с очень простой мысли: большинство Telegram-ботов либо слишком тупые, либо слишком навязчивые. Они умеют реагировать, но не умеют чувствовать границу между полезным участием и лишним шумом.",
      "Поэтому продукт строился не как “ассистент на все случаи”, а как участник группы, который сначала понимает, нужен ли он здесь вообще.",
    ],
  },
  {
    index: "02",
    title: "Что здесь принципиально",
    body: [
      "Память нужна не ради красивого слова long-term memory. Она нужна, чтобы не терять людей, решения, локальные мемы, повторяющиеся вопросы и нити разговоров, которые обычно исчезают в потоке.",
      "Observer-логика нужна не ради необычности, а чтобы бот не ломал культуру чата. Хороший ответ важен, но ещё важнее умение промолчать.",
    ],
  },
  {
    index: "03",
    title: "Как проект строится",
    body: [
      "Cortes разрабатывается как цельный продукт: бот, память, модерация, дашборд и сайт должны говорить на одном языке. Это не набор случайных фич, а одна система с ясной дисциплиной.",
      "Проект ведётся одним разработчиком, поэтому каждая итерация проходит через один и тот же фильтр: станет ли продукт чище, умнее и спокойнее, чем был до этого.",
    ],
  },
];

const roadmap = [
  "Более глубокая память по людям, ролям и повторяющимся темам.",
  "Расширенные сценарии ручного контроля для групп с высокой чувствительностью к шуму.",
  "Более интуитивные панели в дашборде для настройки поведения и логов.",
  "Новые мультимодальные сценарии, где голос, изображения и PDF действительно полезны.",
];

export default function About() {
  useSEO({
    title: "О проекте Cortes — AI-бот для Telegram-групп",
    description:
      "История Cortes, принципы продукта, память о чате, observer-поведение, moderation и планы развития проекта от разработчика Шахриёра.",
    canonical: "/about",
  });

  return (
    <SiteFrame>
      <SiteHeader />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 cortes-shell overflow-hidden">
          {/* Deep blue orbital glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <Reveal>
            <SectionKicker>О проекте</SectionKicker>
            <h1 className="mt-8 max-w-5xl font-cortes-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.85] tracking-[-0.06em] text-white">
              Не генератор шума, <br />
              <span className="text-white/40">а участник чата.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white/50">
              Это продукт про чувство меры: бот должен помнить больше, чем обычный собеседник, но вмешиваться реже, чем большинство существующих AI-ассистентов.
            </p>
          </Reveal>
        </section>

        {/* THESIS & PRINCIPLES BENTO */}
        <section className="cortes-shell py-20 mt-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            <Reveal className="lg:sticky lg:top-40">
              <SectionKicker>Тезис</SectionKicker>
              <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                Понимать границы до того, как демонстрировать интеллект.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/40">
                У Cortes нет цели отвечать чаще всех. Его цель — быть полезным именно тогда,
                когда людям нужен recall, summary, модерация или аккуратное вмешательство в
                сложный разговор.
              </p>
            </Reveal>

            <div className="grid gap-4">
              {principles.map((principle, index) => (
                <Reveal
                  key={index}
                  delay={index * 0.1}
                  className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col sm:flex-row gap-6 items-start group transition-colors hover:bg-white/[0.04]"
                >
                  <div className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] shrink-0 mt-1">
                    0{index + 1}
                  </div>
                  <p className="text-lg leading-relaxed text-white/80 group-hover:text-white transition-colors">
                    {principle}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTERS */}
        <section className="cortes-shell py-20 mt-20">
          <div className="grid gap-4">
            {chapters.map((chapter, index) => (
              <Reveal
                key={chapter.title}
                delay={index * 0.1}
                className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#15110d] to-[#09090b] p-8 md:p-12 relative overflow-hidden"
              >
                {/* Decorative fade at the bottom of each card */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                
                <div className="grid lg:grid-cols-[120px_1fr_1.2fr] gap-8 lg:gap-12 relative z-10">
                  <div className="font-cortes-display text-6xl leading-none tracking-[-0.08em] text-[#3B82F6]/50">
                    {chapter.index}
                  </div>

                  <h3 className="text-3xl leading-tight text-white md:text-4xl font-cortes-display tracking-tight">
                    {chapter.title}
                  </h3>

                  <div className="space-y-6 text-lg leading-relaxed text-white/50">
                    {chapter.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ROADMAP */}
        <section className="cortes-shell py-20 mt-20 mb-40">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            <Reveal className="lg:sticky lg:top-40">
              <SectionKicker>Roadmap</SectionKicker>
              <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                Движение в сторону глубины, а не шума.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/40">
                Дорожная карта Cortes не про бесконечное распухание интерфейса. Она про то,
                чтобы память, логика наблюдателя и панели управления становились точнее и спокойнее.
              </p>
            </Reveal>

            <div className="grid gap-4">
              {roadmap.map((item, index) => (
                <Reveal
                  key={index}
                  delay={index * 0.1}
                  className="rounded-3xl border border-white/5 bg-white/[0.02] px-8 py-6 flex items-center gap-6 group"
                >
                  <div className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#3B82F6] shrink-0">
                    0{index + 1}
                  </div>
                  <p className="text-base leading-relaxed text-white/60 group-hover:text-white transition-colors">
                    {item}
                  </p>
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
