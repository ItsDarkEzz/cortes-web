import { Link } from "wouter";
import { Footer } from "@/components/cortes/Footer";
import {
  Reveal,
  SectionKicker,
  SiteFrame,
  SiteHeader,
  telegramAddUrl,
} from "@/components/cortes/SiteChrome";
import { useSEO } from "@/hooks/use-seo";

const commandFormats = [
  {
    title: "Через слэш",
    copy: "/hug @user",
    description: "Классический формат для тех, кто любит явные команды.",
  },
  {
    title: "Через точку",
    copy: ".обнять @user",
    description: "Быстрый чатовый стиль без лишней формальности.",
  },
  {
    title: "Прямо текстом",
    copy: "пожать руку @user отличный бот",
    description: "Работают русские алиасы, включая многоcловные фразы.",
  },
];

const featureGrid = [
  "Работа по reply и через @username.",
  "Русские алиасы и dot-команды без переключения контекста.",
  "Реплика после команды: бот красиво добавляет её в ответ.",
  "Кастомные RP-команды через /rpadd, /rplist и /rpdel.",
  "Учёт пола через /gender для форм слов и ответов.",
  "Отдельное управление RP и 18+ категориями в чате.",
];

const adminControls = [
  "/rpconfig",
  "/rpconfig on",
  "/rpconfig off",
  "/rpconfig adult on",
  "/rpconfig adult off",
];

const examples = [
  {
    title: "Базовый сценарий",
    command: "/handshake @user",
    result: "Бот отправляет короткое RP-сообщение с упоминаниями обоих участников.",
  },
  {
    title: "С репликой",
    command: "пожать руку @user отличный бот",
    result: "Бот добавляет действие и отдельной строкой прикладывает реплику.",
  },
  {
    title: "По reply",
    command: ".обнять",
    result: "Если команда отправлена ответом на сообщение, цель подставляется автоматически.",
  },
];

export default function RPGuide() {
  useSEO({
    title: "RP-команды Cortes — как включить, настроить и использовать",
    description:
      "Публичное руководство по RP-командам Cortes: форматы вызова, русские алиасы, реплики, кастомные команды и управление через dashboard.",
    canonical: "/rp",
  });

  return (
    <SiteFrame>
      <SiteHeader />

      <main>
        <section className="relative pt-40 pb-20 cortes-shell overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#ef4444]/10 blur-[130px] pointer-events-none" />
          <div className="absolute right-[10%] top-[15%] h-[320px] w-[320px] rounded-full bg-[#3B82F6]/10 blur-[110px] pointer-events-none" />

          <Reveal>
            <SectionKicker>RP-Система</SectionKicker>
            <h1 className="mt-8 max-w-5xl font-cortes-display text-[clamp(3.3rem,7vw,6.4rem)] leading-[0.84] tracking-[-0.06em] text-white">
              RP-команды без перегруза,
              <br />
              <span className="text-white/35">но с нормальным контролем.</span>
            </h1>
            <p className="mt-10 max-w-3xl text-xl leading-relaxed text-white/55">
              У Cortes RP-слой сделан не как случайный набор мем-команд, а как полноценный чатовый модуль: reply, русские алиасы, реплики, кастомные команды и отдельные переключатели для админов.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/documentation"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
              >
                Общая документация
              </Link>
              <a
                href={telegramAddUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
              >
                Добавить бота в чат
              </a>
            </div>
          </Reveal>
        </section>

        <section className="cortes-shell py-16">
          <div className="grid gap-4 lg:grid-cols-3">
            {commandFormats.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 0.08}
                className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8"
              >
                <div className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#3B82F6]">
                  {item.title}
                </div>
                <code className="mt-6 block rounded-2xl border border-white/8 bg-black/40 px-4 py-4 font-cortes-mono text-sm text-white">
                  {item.copy}
                </code>
                <p className="mt-5 text-base leading-relaxed text-white/55">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="cortes-shell py-20">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
            <Reveal className="lg:sticky lg:top-40">
              <SectionKicker>Что Есть Внутри</SectionKicker>
              <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                Не просто действия,
                <br />
                а целый слой общения.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/45">
                Эта система подходит и для лёгких дружелюбных чатов, и для более активных комьюнити, где хочется живого ролевого взаимодействия без ручной рутины.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {featureGrid.map((item, index) => (
                <Reveal
                  key={item}
                  delay={index * 0.05}
                  className="rounded-[28px] border border-white/8 bg-gradient-to-b from-[#111111] to-[#09090b] p-7"
                >
                  <p className="text-lg leading-relaxed text-white/78">{item}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="cortes-shell py-20">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <Reveal className="rounded-[32px] border border-white/8 bg-[#09090b] p-10">
              <SectionKicker>Для Администраторов</SectionKicker>
              <h2 className="mt-6 font-cortes-display text-[clamp(2.3rem,4vw,3.2rem)] leading-[0.92] tracking-[-0.04em] text-white">
                Включение и контроль по чату.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/45">
                RP можно выключить полностью для конкретного чата, а взрослый раздел держать отдельно. Это позволяет не смешивать обычную атмосферу чата с более чувствительными категориями.
              </p>

              <div className="mt-8 grid gap-3">
                {adminControls.map((command) => (
                  <div
                    key={command}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 font-cortes-mono text-sm text-white"
                  >
                    <code>{command}</code>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="rounded-[32px] border border-[#ef4444]/15 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_65%)] p-10">
              <SectionKicker className="text-[#ef4444]">Важно</SectionKicker>
              <h3 className="mt-6 font-cortes-display text-3xl leading-[0.95] tracking-[-0.04em] text-white">
                Раздел 18+ выключен по умолчанию.
              </h3>
              <p className="mt-6 text-base leading-relaxed text-white/55">
                Сначала чат получает обычный RP-набор. Дополнительные взрослые категории появляются только после явного включения администратором через команду или dashboard.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="cortes-shell py-20">
          <Reveal>
            <SectionKicker>Как Это Выглядит</SectionKicker>
            <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
              Типовые сценарии в одном месте.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {examples.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 0.08}
                className="rounded-[28px] border border-white/8 bg-white/[0.03] p-8"
              >
                <div className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {item.title}
                </div>
                <code className="mt-5 block rounded-2xl border border-white/8 bg-black/40 px-4 py-4 font-cortes-mono text-sm text-white">
                  {item.command}
                </code>
                <p className="mt-5 text-base leading-relaxed text-white/60">
                  {item.result}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="cortes-shell py-24 mb-32">
          <Reveal className="rounded-[40px] border border-white/8 bg-[#09090b] p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.14),transparent_65%)] pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <SectionKicker>Следующий Шаг</SectionKicker>
              <h2 className="mt-8 font-cortes-display text-[clamp(2.6rem,4vw,4rem)] leading-[0.9] tracking-[-0.04em] text-white">
                Можно запускать RP-слой
                <br />
                в живом чате.
              </h2>
              <p className="mt-8 text-xl leading-relaxed text-white/45">
                Сначала включите базовые RP-команды, проверьте reply, русские алиасы и кастомные сценарии. Потом, если это подходит формату сообщества, отдельно решайте вопрос с 18+ категорией.
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </SiteFrame>
  );
}
