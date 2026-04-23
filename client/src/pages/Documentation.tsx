import { Footer } from "@/components/cortes/Footer";
import {
  Reveal,
  SectionKicker,
  SiteFrame,
  SiteHeader,
  telegramSupportUrl,
} from "@/components/cortes/SiteChrome";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

const gettingStarted = [
  "Добавьте Cortes в Telegram-группу и выдайте ему нужные права.",
  "Откройте дашборд, чтобы выбрать режим поведения и рамки модерации.",
  "Проверьте, как бот реагирует на прямое обращение, реплай и запрос к памяти.",
  "По мере необходимости настраивайте инструкции, фильтры и админ-сценарии.",
];

const docsMap = [
  "Быстрый старт для новых сообществ и команд.",
  "Режимы поведения: normal, passive, muted и ручной контроль.",
  "Память: что сохраняется, как работает аналитика и как чистить контекст.",
  "Модерация, стоп-слова, фильтры и журнал действий в дашборде.",
  "Мультимодальность: распознавание голосовых, изображений и PDF.",
  "Частые ошибки при настройке и рабочие паттерны администраторов.",
];

export default function Documentation() {
  useSEO({
    title: "Документация — Руководство по настройке AI-бота",
    description:
      "Полное руководство по Cortes: как добавить бота в Telegram, настроить модерацию, использовать команды. Пошаговые инструкции с примерами.",
    canonical: "/documentation",
  });

  return (
    <SiteFrame>
      <SiteHeader />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 cortes-shell overflow-hidden">
          {/* Azure orbital glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
          
          <Reveal>
            <SectionKicker>Документация</SectionKicker>
            <h1 className="mt-8 max-w-5xl font-cortes-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.85] tracking-[-0.06em] text-white">
              Правильный путь запуска <br />
              <span className="text-white/40">вашего бота.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white/50">
              Пока полная документация оформляется, здесь зафиксирован минимальный рабочий маршрут: как добавить бота, выбрать режим, что менять в дашборде и куда идти за помощью.
            </p>
          </Reveal>
        </section>

        {/* QUICK START */}
        <section className="cortes-shell py-20 mt-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            <Reveal className="lg:sticky lg:top-40">
              <SectionKicker>Быстрый Старт</SectionKicker>
              <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                Как не потеряться <br />на старте.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/40">
                Этих шагов достаточно, чтобы запустить бота и проверить базовую механику Cortes в живой группе.
              </p>
            </Reveal>

            <div className="grid gap-4">
              {gettingStarted.map((step, index) => (
                <Reveal
                  key={index}
                  delay={index * 0.1}
                  className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col sm:flex-row gap-6 items-start group transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/20 font-cortes-mono text-[12px] text-[#3B82F6] border border-[#3B82F6]/30">
                    0{index + 1}
                  </div>
                  <p className="text-lg leading-relaxed text-white/80 group-hover:text-white transition-colors mt-1">
                    {step}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* DOCS INDEX */}
        <section className="cortes-shell py-20 mt-20">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
            <Reveal className="order-2 lg:order-1 lg:sticky lg:top-40">
              <div className="grid sm:grid-cols-2 gap-4">
                {docsMap.map((item, index) => (
                  <Reveal
                    key={index}
                    delay={index * 0.05}
                    className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#15110d] to-[#09090b] p-8 flex flex-col justify-between"
                  >
                    <div className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] mb-8">
                       Секция {index + 1}
                    </div>
                    <p className="text-base leading-relaxed text-white/60">
                      {item}
                    </p>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <SectionKicker>Карта Документации</SectionKicker>
              <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                Вокруг реальных задач администратора.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/40">
                Никаких пустых маркетинговых текстов. Мы пишем о конкретике: как бот говорит, что он помнит, как его ограничить от лишнего мусора и как читать логи в дашборде.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="cortes-shell py-20 mt-10">
          <Reveal className="rounded-[36px] border border-white/8 bg-[radial-gradient(circle_at_85%_15%,rgba(239,68,68,0.12),transparent_35%),linear-gradient(180deg,#120d0d_0%,#09090b_100%)] p-10 lg:p-14">
            <SectionKicker className="text-[#ef4444]">Новый Раздел</SectionKicker>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-start">
              <div>
                <h2 className="font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                  Отдельный гид по RP-командам.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
                  Мы вынесли RP-систему в отдельную публичную страницу: с форматами вызова, русскими алиасами, репликами, кастомными командами и управлением через dashboard.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6">
                <div className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Что внутри
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/65">
                  <li>• reply и @username</li>
                  <li>• команды через слэш, точку и plain-text</li>
                  <li>• реплики после RP-команды</li>
                  <li>• переключатели RP и 18+ по чату</li>
                </ul>
                <Link
                  href="/rp"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
                >
                  Открыть RP-гид
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SUPPORT CALLOUT */}
        <section className="cortes-shell py-20 mt-20 mb-40">
          <Reveal className="rounded-[40px] border border-white/5 bg-[#09090b] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <SectionKicker>Остались вопросы?</SectionKicker>
              <h2 className="mt-8 font-cortes-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.9] tracking-[-0.04em] text-white">
                Инструкция не заменит живой диалог.
              </h2>
              <p className="mt-8 text-xl leading-relaxed text-white/40">
                Если вам нужна точная настройка до релиза полного мануала, лучше сразу идти в поддержку. Так вы решите задачу по вашей конфигурации, а не будете читать обобщенную заглушку.
              </p>
              
              <a
                href={telegramSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 inline-flex h-14 items-center justify-center rounded-full bg-white px-10 font-cortes-mono text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
              >
                Написать в поддержку
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </SiteFrame>
  );
}
