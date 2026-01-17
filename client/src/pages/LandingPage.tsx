import { Hero } from "@/components/cortes/Hero";
import { Philosophy } from "@/components/cortes/Philosophy";
import { Architecture } from "@/components/cortes/Architecture";
import { ChatDemo } from "@/components/cortes/ChatDemo";
import { UseCases } from "@/components/cortes/UseCases";
import { Features } from "@/components/cortes/Features";
import { DashboardCTA } from "@/components/cortes/DashboardCTA";
import { FAQ } from "@/components/cortes/FAQ";
import { Footer } from "@/components/cortes/Footer";
import { useSEO } from "@/hooks/use-seo";
import { LandingPageSchemas } from "@/components/SEOSchema";

export default function LandingPage() {
  useSEO({
    title: "Cortes AI — Умный бот для Telegram на GPT-5.2 | Модерация через команды",
    description: "Cortes — интеллектуальный Telegram-бот на GPT-5.2. Команды модерации (ban, mute, kick, warn) и автоматические фильтры контента. Блокировка стоп-слов, репостов, нежелательных символов и медиа. Добавьте бесплатно за 30 секунд.",
    canonical: "/",
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      <LandingPageSchemas />
      <Hero />
      <Philosophy />
      <Architecture />
      <ChatDemo />
      <UseCases />
      <Features />
      <DashboardCTA />
      <FAQ />
      <Footer />
    </div>
  );
}
