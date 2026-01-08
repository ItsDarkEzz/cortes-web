import { Hero } from "@/components/cortes/Hero";
import { Philosophy } from "@/components/cortes/Philosophy";
import { Architecture } from "@/components/cortes/Architecture";
import { ChatDemo } from "@/components/cortes/ChatDemo";
import { UseCases } from "@/components/cortes/UseCases";
import { Features } from "@/components/cortes/Features";
import { FAQ } from "@/components/cortes/FAQ";
import { Footer } from "@/components/cortes/Footer";
import { useSEO } from "@/hooks/use-seo";
import { LandingPageSchemas } from "@/components/SEOSchema";

export default function LandingPage() {
  useSEO({
    title: "Умный AI-бот для Telegram | Бесплатно",
    description: "Cortes — интеллектуальный Telegram-бот с AI. Понимает контекст, не спамит, имеет характер и собственное мнение. Добавьте бесплатно за 30 секунд.",
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
      <FAQ />
      <Footer />
    </div>
  );
}
