import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export const telegramAddUrl =
  "https://t.me/thecortesbot?startgroup=add&admin=delete_messages+restrict_members+invite_users+pin_messages+manage_topics+manage_chat";
export const telegramSupportUrl = "https://t.me/ItsDarkEz";
export const telegramChannelUrl = "https://t.me/TheCortes";
export const supportEmail = "support@thecortes.ru";

const navItems = [
  { label: "Протокол", href: "/#protocol" },
  { label: "Сценарии", href: "/#scenarios" },
  { label: "RP", href: "/rp" },
  { label: "Доки", href: "/documentation" },
  { label: "Поддержка", href: "/support" },
];

export const revealTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

function NavAnchor({ href, label }: { href: string; label: string }) {
  const className = "transition-colors hover:text-white";

  if (href.includes("#")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function SiteFrame({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "cortes-site relative min-h-screen overflow-x-hidden selection:bg-[#3B82F6] selection:text-white bg-black",
        className,
      )}
    >
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-screen"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      />
      
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.12),transparent_60%),radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.15),transparent_60%)]"
      />
      {children}
    </div>
  );
}

export function SiteHeader({
  className,
  showDashboard = true,
}: {
  className?: string;
  showDashboard?: boolean;
}) {
  return (
    <header
      className={cn(
        "fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4",
        className,
      )}
    >
      <div className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 rounded-full border border-white/10 bg-[#09090b]/60 px-2 py-2 pr-6 backdrop-blur-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-[1.02]">
        <Link href="/" className="flex items-center gap-2 pl-2 no-underline group">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-cortes-display text-[14px] leading-none transition-transform group-hover:rotate-12">
            C
          </span>
          <span className="hidden sm:block font-cortes-display text-[1rem] leading-none tracking-[-0.04em] text-white">
            Cortes
          </span>
        </Link>

        <nav className="hidden items-center gap-5 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/50 md:flex">
          {navItems.map((item) => (
            <NavAnchor key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {showDashboard ? (
            <Link href="/dashboard" className="hidden text-[10px] font-cortes-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors sm:block mr-2">
              Кабинет
            </Link>
          ) : null}
          <a
            href={telegramAddUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 items-center justify-center rounded-full bg-white px-4 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
          >
            Установить
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}

export function SectionKicker({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <p className={cn("font-cortes-mono text-[10px] uppercase tracking-[0.3em] text-[#3B82F6]", className)}>{children}</p>;
}

export function Reveal({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ ...revealTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
