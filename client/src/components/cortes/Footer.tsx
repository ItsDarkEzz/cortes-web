import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import {
  supportEmail,
  telegramAddUrl,
  telegramChannelUrl,
} from "@/components/cortes/SiteChrome";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-black pt-32 pb-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="cortes-shell">
        <div className="flex flex-col items-center text-center">
          <p className="font-cortes-mono text-[10px] uppercase tracking-[0.3em] text-[#3B82F6]">
            Финальный Этап
          </p>
          
          <h2 className="mt-8 font-cortes-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.85] tracking-[-0.08em] text-white">
            Инициализация<br />
            <span className="text-white/30">Cortes AI.</span>
          </h2>
          
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
            Передайте рутину боту, который понимает контекст, поддерживает память 
            и не генерирует шум. Строгая модерация включена.
          </p>
          
          <div className="mt-12">
            <a
              href={telegramAddUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-16 items-center justify-center rounded-full bg-white px-8 font-cortes-mono text-[12px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Добавить в группу
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-32 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2">
          <div>
            <Link
              href="/"
              className="font-cortes-display text-[2rem] leading-none tracking-[-0.06em] text-white no-underline"
            >
              Cortes
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Архитектура модерации и памяти для Telegram. Не просто чат-бот, а инструмент владельца группы.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 text-sm md:items-end">
            <div className="flex flex-wrap gap-x-8 gap-y-4 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <a href="/#protocol" className="transition-colors hover:text-white">
                Протокол
              </a>
              <Link href="/about" className="transition-colors hover:text-white">
                О проекте
              </Link>
              <Link href="/documentation" className="transition-colors hover:text-white">
                Документация
              </Link>
              <Link href="/rp" className="transition-colors hover:text-white">
                RP-гид
              </Link>
              <Link href="/dashboard" className="transition-colors hover:text-white">
                Дашборд
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
               <Link href="/support" className="transition-colors hover:text-white">
                Поддержка
              </Link>
              <a href={telegramChannelUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                Telegram
              </a>
              <span>© {year}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
