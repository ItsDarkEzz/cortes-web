import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Это платно?",
    answer: "Cortes полностью бесплатен прямо сейчас! Мы в бета-тестировании и предоставляем полный доступ всем функциям без ограничений. В будущем будет подписка Pro с расширенными возможностями, но базовая версия останется бесплатной."
  },
  {
    question: "Что с моей приватностью?",
    answer: "Cortes хранит часть истории и извлечённых фактов, чтобы помнить контекст чата и отвечать лучше. Поэтому данные не 'забываются мгновенно'. При этом памятью можно управлять: есть команда /forget и настройки через Dashboard. Cortes не публикует историю чата наружу и не делает её публичной."
  },
  {
    question: "Он будет отвечать на каждое сообщение?",
    answer: "Нет! В этом вся суть Cortes. Он не спамит и не вмешивается без причины. Cortes отвечает только тогда, когда это действительно нужно — когда его называют по имени или когда разговор требует его вмешательства. Он наблюдает и помогает в нужный момент."
  },
  {
    question: "Какая модель используется?",
    answer: "Под капотом у Cortes несколько AI-компонентов и специализированных моделей под разные задачи: ответы, память, обработка голосовых и изображений. Важнее не название одной модели, а то, что бот удерживает контекст, не спамит и остаётся управляемым."
  },
  {
    question: "Какие есть функции модерации?",
    answer: "Cortes предоставляет команды модерации (/ban, /mute, /kick, /warn) и автоматические фильтры контента. Фильтры стоп-слов, блокировка репостов из каналов, фильтрация нежелательных символов, медиа и ссылок. NSFW фильтр для изображений и видео. Всё настраивается через Dashboard."
  },
  {
    question: "Как добавить Cortes в свой чат?",
    answer: "Просто нажмите кнопку 'Добавить в чат' и выберите группу в Telegram. Дайте Cortes права на чтение сообщений — и всё готово. Для настройки модерации и других функций войдите в Dashboard через Telegram."
  }
];

export function FAQ() {
  return (
    <section className="py-32 relative max-w-3xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Частые вопросы о <span className="text-gradient-primary">Cortes</span></h2>
        <p className="text-muted-foreground">Ответы на популярные вопросы об AI-боте для Telegram</p>
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
    </section>
  );
}
