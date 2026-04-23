import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  LucideIcon,
  MessagesSquare,
  Radio,
  ScanSearch,
  Sparkles,
  Users,
} from "lucide-react";
import { useRoute } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { SiteFrame, SiteHeader } from "@/components/cortes/SiteChrome";

type RecapPayload = {
  share_code?: string;
  title: string;
  summary: string;
  period_hours: number;
  message_count: number;
  unique_users: number;
  key_topics: string[];
  notable_events: string[];
  active_participants: Array<{ display_name: string; message_count: number }>;
};

type TopicCard = {
  index: string;
  title: string;
  blurb: string;
};

type EventCard = {
  index: string;
  title: string;
  blurb: string;
};

type InsightStat = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  shellClassName: string;
  iconClassName: string;
};

function deriveChatTitle(title: string): string {
  return title.replace(/^Recap за .*? для /, "").trim() || "чата";
}

function safeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeRecapPayload(input: any): RecapPayload {
  return {
    share_code: typeof input?.share_code === "string" ? input.share_code : undefined,
    title: String(input?.title || "Recap"),
    summary: String(input?.summary || ""),
    period_hours: Number(input?.period_hours || 0),
    message_count: Number(input?.message_count || 0),
    unique_users: Number(input?.unique_users || 0),
    key_topics: safeArray<string>(input?.key_topics),
    notable_events: safeArray<string>(input?.notable_events),
    active_participants: safeArray<{ display_name: string; message_count: number }>(input?.active_participants),
  };
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value || 0);
}

function formatPeriod(periodHours: number): string {
  if (periodHours >= 24 && periodHours % 24 === 0) {
    const days = periodHours / 24;
    const mod10 = days % 10;
    const mod100 = days % 100;
    if (mod10 === 1 && mod100 !== 11) return `${days} день`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${days} дня`;
    return `${days} дней`;
  }
  return `${periodHours} ч.`;
}

function getPeriodBreakdown(periodHours: number): { value: string; unit: string } {
  const formatted = formatPeriod(periodHours);
  const match = formatted.match(/^(\d+)\s+(.*)$/);
  return {
    value: match?.[1] || String(periodHours || 0),
    unit: match?.[2] || "ч.",
  };
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function truncateText(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const safeSlice = lastSpace > Math.floor(maxLength * 0.55) ? slice.slice(0, lastSpace) : slice;
  return `${safeSlice.trimEnd()}…`;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "и", "в", "на", "с", "по", "для", "что", "это", "как", "его", "ее", "её",
    "или", "при", "под", "про", "над", "из", "за", "без", "когда", "после",
    "перед", "между", "были", "было", "этот", "эта", "эти", "который",
    "которая", "которые", "уже", "ещё", "очень", "также", "период", "чата",
    "чат", "линия", "линии", "сюжет", "сюжеты", "вокруг",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3 && !stopWords.has(word));
}

function isMeaningfulTopic(topic: string): boolean {
  const normalized = topic.toLowerCase().trim();
  if (!normalized || normalized.length < 5) return false;
  if (/^(photo|video|gif|audio|reply|replies|context|text|если|только)$/i.test(normalized)) return false;
  const keywords = extractKeywords(normalized);
  if (keywords.length === 0) return false;
  if (keywords.length === 1 && keywords[0].length < 7) return false;
  return true;
}

function isMeaningfulEvent(event: string): boolean {
  const normalized = event.toLowerCase().trim();
  if (!normalized) return false;
  if (normalized.startsWith("вопросы в чате")) return false;
  if (normalized.includes("задал") && normalized.includes("вопрос")) return false;
  return true;
}

function findRelevantContexts(topic: string, summary: string, events: string[]): string[] {
  const keywords = extractKeywords(topic);
  const candidates = [...splitIntoSentences(summary), ...events];
  const ranked = candidates
    .map((candidate) => {
      const candidateKeywords = new Set(extractKeywords(candidate));
      const score = keywords.reduce((acc, keyword) => acc + (candidateKeywords.has(keyword) ? 1 : 0), 0);
      return { candidate, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.map((item) => item.candidate);
}

function buildTopicCards(payload: RecapPayload): TopicCard[] {
  const candidateTopics = payload.key_topics.filter(isMeaningfulTopic);
  const meaningfulEvents = payload.notable_events.filter(isMeaningfulEvent);
  const summarySentences = splitIntoSentences(payload.summary)
    .filter((sentence) => extractKeywords(sentence).length >= 2);

  const sourceTopics = candidateTopics.length > 0
    ? candidateTopics
    : meaningfulEvents.length > 0
      ? meaningfulEvents
      : summarySentences;

  const usedBlurbs = new Set<string>();

  return sourceTopics.slice(0, 5).map((topic, index) => {
    const contexts = findRelevantContexts(topic, payload.summary, meaningfulEvents);
    const context = contexts.find((candidate) => !usedBlurbs.has(candidate));
    const fallback =
      index === 0
        ? "Через этот мотив участники считывали почти весь массив сообщений."
        : "Ветка регулярно возвращалась и постепенно стала одной из узнаваемых нервных точек обсуждения.";
    const title = truncateText(topic, 92);
    const blurb = truncateText(context || fallback, 160);
    usedBlurbs.add(blurb);

    return {
      index: String(index + 1).padStart(2, "0"),
      title,
      blurb,
    };
  });
}

function buildEventCards(events: string[]): EventCard[] {
  const meaningful = events.filter(isMeaningfulEvent);
  const source = meaningful.length > 0 ? meaningful : events;

  return source.slice(0, 5).map((event, index) => {
    const cleaned = event.replace(/\s+/g, " ").trim();
    const titleMatch = cleaned.split(/:\s+|,\s+/).find((part) => part.trim().length >= 18);
    const title = truncateText(titleMatch || cleaned, 78);
    const blurb = title === cleaned
      ? "Эпизод не выпадал из поля зрения и постепенно набирал вес внутри общего разговора."
      : truncateText(cleaned, 190);

    return {
      index: String(index + 1).padStart(2, "0"),
      title,
      blurb,
    };
  });
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/30">
          <ScanSearch className="w-8 h-8 text-[#3B82F6] animate-pulse" />
        </div>
      </div>
      <h3 className="mt-8 font-cortes-display text-2xl text-white tracking-[-0.04em]">Инициализация архива</h3>
      <p className="mt-4 text-white/40 font-cortes-mono text-[10px] uppercase tracking-[0.2em]">Поиск сигналов в массиве данных...</p>
    </div>
  );
}

function ErrorView({ apiUnavailable }: { apiUnavailable: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-8">
         <Radio className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="font-cortes-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.06em] text-white">
        {apiUnavailable ? "API Отключен" : "Архив удален"}
      </h1>
      <p className="mt-6 text-lg text-white/50 leading-relaxed">
        {apiUnavailable
          ? "Не удается связаться с базой данных на локальном порту."
          : "Ссылка истекла или этот слепок памяти был затерт владельцем."}
      </p>
    </div>
  );
}

function SectionEyebrow({
  children,
  className = "text-[#3B82F6]",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p className={`font-cortes-mono text-[10px] uppercase tracking-[0.3em] ${className}`}>
      {children}
    </p>
  );
}

// Ensure SiteHeader does not display the dashboard link if the user isn't logged in on this public URL.
export default function RecapSharePage() {
  const [match, params] = useRoute("/recap/:shareCode");
  const shareCode = params?.shareCode ?? "";
  const [payload, setPayload] = useState<RecapPayload | null>(null);
  const [errorState, setErrorState] = useState<"not_found" | "api_unavailable" | null>(null);
  const [loading, setLoading] = useState(true);

  const absoluteRecapImageUrl = shareCode ? `https://thecortes.ru/v1/public/recaps/${shareCode}/image` : undefined;

  useSEO({
    title: payload ? `${payload.title} — Архив Cortes` : "Архив Cortes",
    description: payload?.summary || "Cortes Memory Dump.",
    canonical: match ? `/recap/${shareCode}` : "/recap",
    ogImage: absoluteRecapImageUrl,
  });

  useEffect(() => {
    if (!shareCode) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    async function loadRecap() {
      try {
        const response = await fetch(`/v1/public/recaps/${shareCode}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error("not_found");
          throw new Error("api_unavailable");
        }

        const data = await response.json();
        if (!cancelled) {
          setPayload(normalizeRecapPayload(data));
          setErrorState(null);
        }
      } catch (error) {
        if (!cancelled) {
          setPayload(null);
          setErrorState(error instanceof Error && error.message === "not_found" ? "not_found" : "api_unavailable");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadRecap();
    return () => { cancelled = true; };
  }, [shareCode]);

  const topicCards = payload ? buildTopicCards(payload) : [];
  const eventCards = payload ? buildEventCards(payload.notable_events) : [];
  const participants = payload?.active_participants.slice(0, 5) || [];
  const maxMessages = participants.length > 0 ? Math.max(...participants.map((item) => item.message_count || 0), 1) : 1;
  const chatTitle = payload ? deriveChatTitle(payload.title) : "чата";
  const summarySentences = payload ? splitIntoSentences(payload.summary) : [];
  const leadSentence = summarySentences[0] || payload?.summary || "";
  const secondarySummary = summarySentences.slice(1).join(" ");
  const dominantTheme = topicCards[0]?.title || "Доминирующий мотив не обнаружен";
  const primaryNarrative = payload
    ? truncateText(findRelevantContexts(dominantTheme, payload.summary, payload.notable_events)[0] || payload.summary, 270)
    : "";
  const periodBreakdown = getPeriodBreakdown(payload?.period_hours || 0);
  const shareValue = payload?.share_code || shareCode;
  const secondaryTopicCards = topicCards.slice(1, 4);

  const insightStats: InsightStat[] = payload
    ? [
        {
          label: "Массив",
          value: formatCount(payload.message_count),
          note: "сообщений внутри выборки",
          icon: MessagesSquare,
          shellClassName: "border-[#8B5CF6]/20 bg-[#8B5CF6]/10",
          iconClassName: "text-[#8B5CF6]",
        },
        {
          label: "Голоса",
          value: formatCount(payload.unique_users),
          note: "оставили заметный след",
          icon: Users,
          shellClassName: "border-[#3B82F6]/20 bg-[#3B82F6]/10",
          iconClassName: "text-[#3B82F6]",
        },
        {
          label: "Линии",
          value: formatCount(topicCards.length || payload.key_topics.length || 0),
          note: "вышли на первый план",
          icon: ScanSearch,
          shellClassName: "border-white/10 bg-white/5",
          iconClassName: "text-white",
        },
      ]
    : [];

  return (
    <SiteFrame>
      <SiteHeader showDashboard={false} />

      <main className="relative pt-32 pb-40 cortes-shell z-10">
        {loading && <LoadingView />}

        {!loading && !payload && <ErrorView apiUnavailable={errorState === "api_unavailable"} />}

        {!loading && payload && (
          <div className="relative">
            {/* Header Hero */}
            <header className="mb-20 text-center flex flex-col items-center">
               <div className="absolute top-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 mb-8">
                 <Sparkles className="w-3 h-3 text-[#3B82F6]" />
                 <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Аналитика Дампа</span>
               </div>
               
               <h1 className="font-cortes-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.85] tracking-[-0.06em] text-white text-balance">
                 «{chatTitle}»
               </h1>
               
               <div className="mt-8 flex items-center justify-center gap-4 text-[#3B82F6]">
                  <span className="font-cortes-mono text-xs uppercase tracking-[0.3em] border border-[#3B82F6]/20 bg-[#3B82F6]/10 px-4 py-2 rounded-full">
                    {formatPeriod(payload.period_hours)}
                  </span>
                  <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    ID: {shareValue}
                  </span>
               </div>
            </header>

            {/* Main Stats Bento */}
            <div className="grid lg:grid-cols-[2fr_1fr] gap-4 mb-20">
               {/* Lead Story */}
               <div className="rounded-[40px] border border-white/5 bg-[#09090b]/80 p-8 md:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-center">
                  <SectionEyebrow className="text-[#8B5CF6]">Сводка</SectionEyebrow>
                  <p className="mt-6 font-cortes-display text-4xl md:text-5xl leading-tight tracking-tight text-white">
                    {truncateText(leadSentence || payload.summary, 210)}
                  </p>
               </div>

               {/* Quick Stats Column */}
               <div className="grid gap-4">
                 {insightStats.map(({ icon: Icon, label, note, value, shellClassName, iconClassName }) => (
                   <div key={label} className={`rounded-3xl border p-6 flex items-start justify-between ${shellClassName}`}>
                      <div>
                        <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
                           {label}
                        </p>
                        <p className="font-cortes-display text-4xl text-white mb-2">{value}</p>
                        <p className="text-xs text-white/30">{note}</p>
                      </div>
                      <div className={`rounded-2xl bg-black border border-white/10 p-3 h-12 w-12 flex items-center justify-center ${iconClassName}`}>
                         <Icon className="w-5 h-5" />
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Dominant Theme & Secondary Topics */}
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4 mb-20">
               <div className="rounded-[40px] border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-8 md:p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#3B82F6]/20 blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                 <div className="relative z-10">
                   <SectionEyebrow className="text-[#3B82F6]">Доминирующий мотив</SectionEyebrow>
                   <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
                     {dominantTheme}
                   </h2>
                   <p className="mt-6 text-xl leading-relaxed text-white/50 max-w-2xl">
                     {primaryNarrative}
                   </p>
                 </div>
               </div>

               <div className="grid gap-4">
                  {secondaryTopicCards.length > 0 ? secondaryTopicCards.map((topic, index) => (
                    <div key={index} className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                         <span className="font-cortes-mono text-[10px] text-[#8B5CF6] uppercase tracking-[0.2em]">
                           {topic.index}
                         </span>
                         <div className="h-px bg-white/10 flex-1" />
                      </div>
                      <p className="text-lg leading-relaxed text-white font-cortes-display tracking-wide">{topic.title}</p>
                    </div>
                  )) : (
                    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6">
                      <p className="text-lg leading-relaxed text-white/60">
                        {secondarySummary ? truncateText(secondarySummary, 180) : truncateText(payload.summary, 180)}
                      </p>
                    </div>
                  )}
               </div>
            </div>

            {/* Top Participants Graph */}
            <div className="rounded-[40px] border border-white/5 bg-[#09090b]/80 p-8 md:p-12 mb-20">
               <div className="flex items-center justify-between mb-10">
                 <SectionEyebrow className="text-[#8B5CF6]">Активность Голосов</SectionEyebrow>
                 <Radio className="w-5 h-5 text-white/20" />
               </div>

               <div className="grid gap-6">
                  {participants.length > 0 ? participants.map((participant, index) => {
                     const ratio = Math.max(8, Math.round((participant.message_count / maxMessages) * 100));
                     return (
                       <div key={index} className="relative rounded-2xl border border-white/5 bg-black p-5 overflow-hidden flex items-center justify-between">
                          <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3B82F6]/20 to-transparent" 
                            style={{ width: `${ratio}%` }}
                          />
                          <div className="relative z-10 flex items-center gap-4">
                             <span className="font-cortes-mono text-[10px] uppercase text-[#3B82F6] tracking-[0.2em]">
                               {String(index + 1).padStart(2, '0')}
                             </span>
                             <div>
                                <h4 className="font-cortes-display text-xl text-white tracking-wide">{participant.display_name}</h4>
                             </div>
                          </div>
                          <div className="relative z-10 font-cortes-mono text-xl text-[#3B82F6]">
                             {formatCount(participant.message_count)}
                          </div>
                       </div>
                     );
                  }) : <p className="text-white/40">Массив данных слишком мал для выделения лидеров.</p>}
               </div>
            </div>

            {/* Timeline / Events */}
            <div className="grid gap-4 lg:grid-cols-2">
               {eventCards.map((event, index) => (
                  <div key={index} className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex gap-6 items-start hover:bg-white/[0.04] transition-colors">
                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 font-cortes-mono text-[10px] text-white">
                        {event.index}
                     </div>
                     <div>
                        <h4 className="font-cortes-display text-2xl text-white mb-3">{event.title}</h4>
                        <p className="text-sm leading-relaxed text-white/50">{event.blurb}</p>
                     </div>
                  </div>
               ))}
            </div>

            {/* Bottom CTA to add bot */}
            <div className="mt-20 rounded-[40px] border border-white/5 bg-[radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.1),transparent_60%)] p-12 text-center flex flex-col items-center">
               <SectionEyebrow className="text-[#8B5CF6]">Инициализация</SectionEyebrow>
               <h2 className="mt-6 font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] text-white tracking-tight">Включить память в своей группе</h2>
               <p className="mt-4 text-white/40 mb-10 max-w-xl line-clamp-2">Получайте подобные выжимки из диалогов автоматически.</p>
               <a
                  href="https://t.me/thecortesbot?startgroup=add&admin=delete_messages+restrict_members+invite_users+pin_messages+manage_topics+manage_chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 font-cortes-mono text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
                >
                  Установить Cortes
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </a>
            </div>

          </div>
        )}
      </main>
    </SiteFrame>
  );
}
