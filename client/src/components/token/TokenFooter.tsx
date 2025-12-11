import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Что такое $CORTES?",
    answer: "Это мем-токен на блокчейне Solana, созданный для комьюнити бота Cortes. Это не инвестиционный инструмент — просто фан-валюта для награждения активных участников сообщества."
  },
  {
    question: "Как получить токены?",
    answer: "Подключите Solana-кошелёк, выполните задания (добавьте бота в группу, взаимодействуйте с ним, пригласите друзей) и получите награду в рамках сезонного airdrop."
  },
  {
    question: "Какой кошелёк нужен?",
    answer: "Любой Solana-кошелёк: Phantom, Solflare или Slope. Можно использовать расширение для браузера или мобильное приложение."
  },
  {
    question: "Когда будет листинг на бирже?",
    answer: "Листинг на DEX (Raydium/Orca) запланирован в Phase 3 дорожной карты. Следите за анонсами в наших социальных сетях."
  },
  {
    question: "Сколько токенов можно получить?",
    answer: "В Season 1 максимальная награда — 50,000 $CORTES на участника. Базовый claim даёт 1,000 токенов, дополнительные награды за активность, рефералов и контент."
  },
  {
    question: "Нужен ли KYC?",
    answer: "Для базового airdrop KYC не требуется. Дополнительная верификация может быть запрошена только при подозрении на манипуляции."
  },
];

export function TokenFooter() {
  return (
    <>
      {/* FAQ Section */}
      <section className="py-32 relative max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Частые вопросы о <span className="text-gradient-primary">$CORTES</span>
          </h2>
          <p className="text-muted-foreground">Ответы на популярные вопросы о токене</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-white/10 rounded-2xl bg-white/[0.02] px-6 overflow-hidden data-[state=open]:bg-white/[0.05] data-[state=open]:border-primary/20 transition-all duration-300"
            >
              <AccordionTrigger className="text-lg font-medium text-white hover:text-primary hover:no-underline py-6 cursor-pointer">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Disclaimer */}
        <div className="mt-16 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500/70 shrink-0 mt-0.5" />
            <div className="text-sm text-white/40 leading-relaxed">
              <span className="text-red-400 font-medium">Дисклеймер:</span> $CORTES — мем-токен исключительно для развлечения. 
              Это не финансовая рекомендация. Стоимость не гарантирована. Участвуйте на свой страх и риск. 
              Перед любыми действиями с криптовалютами проконсультируйтесь со специалистами.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center relative z-10">
          <Link href="/">
            <a className="text-5xl md:text-8xl font-bold tracking-tighter mb-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 cursor-pointer hover:text-gradient-primary transition-all block">
              CORTES
            </a>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <Link href="/about">
              <a className="text-muted-foreground hover:text-white transition-colors">О проекте</a>
            </Link>
            <Link href="/documentation">
              <a className="text-muted-foreground hover:text-white transition-colors">Документация</a>
            </Link>
            <Link href="/token">
              <a className="text-muted-foreground hover:text-primary transition-colors font-medium">$CORTES</a>
            </Link>
            <Link href="/support">
              <a className="text-muted-foreground hover:text-white transition-colors">Поддержка</a>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground/50 font-mono">
            © 2025 CORTES AI.
          </p>
        </div>
      </footer>
    </>
  );
}
