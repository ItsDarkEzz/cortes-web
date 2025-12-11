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
    answer: "Ваши сообщения в полной безопасности. Все данные шифруются end-to-end. Мы не храним историю ваших чатов и не передаем их никому. Cortes анализирует сообщения в момент их поступления, а затем они забываются. Никто не имеет доступ к вашим данным."
  },
  {
    question: "Он будет отвечать на каждое сообщение?",
    answer: "Нет! В этом вся суть Cortes. Он не спамит и не вмешивается без причины. Cortes отвечает только тогда, когда это действительно нужно — когда его называют по имени или когда разговор требует его вмешательства. Он наблюдает и помогает в нужный момент."
  },
  {
    question: "Можно ли настроить его характер?",
    answer: "Нет, Cortes сам приспосабливается к вашему чату. Он анализирует культуру общения, стиль участников и особенности вашей группы, а затем естественным образом подстраивается под них. Никаких ручных настроек — всё работает автоматически."
  },
  {
    question: "Какие функции появятся в будущем?",
    answer: "В разработке находится режим модератора. Это даст администраторам инструменты для установки AI-фильтров на спам, токсичность и другой нежелательный контент, а также команды модерации, которые Cortes сможет выполнять. Он станет полноценным ассистентом администратора."
  },
  {
    question: "Как добавить Cortes в свой чат?",
    answer: "Просто нажмите кнопку внизу и выберите группу в Telegram. Дайте Cortes права на чтение сообщений — и всё готово. Никаких сложных настроек. Он сразу начнет анализировать ваш чат и встраиваться в его жизнь."
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
