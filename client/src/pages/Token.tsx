import { useSEO } from "@/hooks/use-seo";
import { TokenPageSchemas } from "@/components/SEOSchema";
import { TokenHero } from "@/components/token/TokenHero";
import { TokenomicsSection } from "@/components/token/TokenomicsSection";
import { AirdropSection } from "@/components/token/AirdropSection";
import { TokenCTA } from "@/components/token/TokenCTA";
import { TokenFooter } from "@/components/token/TokenFooter";

export default function Token() {
  useSEO({
    title: "$CORTES Token — Мем-токен комьюнити Cortes | Airdrop Season 1",
    description: "Официальная страница токена $CORTES на блокчейне Solana. Участвуйте в Airdrop Season 1, получайте награды за активность. Токеномика, roadmap и правила участия.",
    canonical: "/token",
    favicon: "/token.png",
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      <TokenPageSchemas />
      <TokenHero />
      <TokenomicsSection />
      <AirdropSection />
      <TokenCTA />
      <TokenFooter />
    </div>
  );
}
