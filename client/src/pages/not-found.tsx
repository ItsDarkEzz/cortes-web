import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { SiteFrame, SiteHeader, Reveal, SectionKicker } from "@/components/cortes/SiteChrome";
import { useSEO } from "@/hooks/use-seo";

export default function NotFound() {
  useSEO({
    title: "404 — Сигнал Потерян",
    description: "Эта страница не существует. Возвращайтесь на базу Cortes.",
    canonical: "/404",
  });

  return (
    <SiteFrame>
      <SiteHeader />
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 cortes-shell">
        {/* Red orbital glow for error state */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />

        <Reveal className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          <SectionKicker className="text-red-500">Ошибка</SectionKicker>
          
          <h1 className="mt-8 font-cortes-display text-[clamp(6rem,15vw,12rem)] leading-[0.85] tracking-[-0.08em] text-white">
            4<span className="text-white/20">0</span>4
          </h1>
          
          <h2 className="mt-6 font-cortes-display text-[clamp(2rem,4vw,3rem)] leading-[0.9] tracking-[-0.04em] text-white">
            Сигнал потерян.
          </h2>
          
          <p className="mt-6 text-xl text-white/40 max-w-md leading-relaxed">
            Похоже, этой страницы никогда не существовало, или она была удалена за создание лишнего шума.
          </p>

          <Link href="/">
            <span className="mt-12 inline-flex h-14 items-center justify-center rounded-full bg-white px-10 font-cortes-mono text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на базу
            </span>
          </Link>
        </Reveal>
      </section>
    </SiteFrame>
  );
}
