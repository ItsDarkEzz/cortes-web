import { useEffect } from "react";

interface SchemaProps {
  type: "website" | "software" | "faq" | "organization" | "howto";
  data?: Record<string, unknown>;
}

const schemas = {
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cortes",
    "url": "https://thecortes.ru",
    "description": "Умный AI-бот для Telegram с RPG-системой",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thecortes.ru/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  software: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Cortes",
    "applicationCategory": "CommunicationApplication",
    "operatingSystem": "Telegram",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "RUB"
    },
    "description": "Умный AI-бот для Telegram с RPG-системой, который понимает контекст и не спамит. Геймификация, квесты, достижения.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150"
    },
    "author": {
      "@type": "Person",
      "name": "Шахриёр"
    },
    "downloadUrl": "https://t.me/thecortesbot",
    "screenshot": "https://thecortes.ru/opengraph.jpg"
  },
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cortes AI",
    "url": "https://thecortes.ru",
    "logo": "https://thecortes.ru/cortes.webp",
    "sameAs": [
      "https://t.me/thecortesbot",
      "https://t.me/TheCortesChat"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@thecortes.ru",
      "contactType": "customer support",
      "availableLanguage": ["Russian", "English"]
    }
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Cortes бесплатный?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, Cortes полностью бесплатен. Мы в бета-тестировании и предоставляем полный доступ всем функциям без ограничений. В будущем будет подписка Pro с расширенными возможностями, но базовая версия останется бесплатной."
        }
      },
      {
        "@type": "Question",
        "name": "Безопасны ли мои данные в Cortes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, все сообщения шифруются end-to-end. Мы не храним историю ваших чатов и не передаем данные третьим лицам. Cortes анализирует сообщения в момент их поступления, а затем они забываются."
        }
      },
      {
        "@type": "Question",
        "name": "Как добавить Cortes в Telegram-чат?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Нажмите кнопку 'Добавить в чат' на сайте, выберите группу в Telegram и дайте боту права на чтение сообщений. Никаких сложных настроек — бот сразу начнет работать."
        }
      },
      {
        "@type": "Question",
        "name": "Cortes отвечает на каждое сообщение?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Нет, в этом вся суть Cortes. Он не спамит и не вмешивается без причины. Cortes отвечает только тогда, когда это действительно нужно — когда его называют по имени или когда разговор требует его вмешательства."
        }
      },
      {
        "@type": "Question",
        "name": "Какие функции есть у Cortes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cortes предлагает: контекстное понимание сообщений, RPG-систему с XP и достижениями, квесты и дуэли, автоматическую адаптацию к культуре чата, модерацию без спама, молниеносную реакцию менее 50ms."
        }
      }
    ]
  },
  howto: {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Как добавить Cortes в Telegram-чат",
    "description": "Пошаговая инструкция по добавлению AI-бота Cortes в вашу Telegram-группу",
    "totalTime": "PT1M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Откройте сайт",
        "text": "Перейдите на thecortes.ru и нажмите кнопку 'Добавить в чат'"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Выберите группу",
        "text": "В открывшемся окне Telegram выберите группу, куда хотите добавить бота"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Дайте права",
        "text": "Предоставьте боту права на чтение сообщений в группе"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Готово",
        "text": "Cortes начнет анализировать ваш чат и встраиваться в его жизнь"
      }
    ]
  }
};

export function SEOSchema({ type, data }: SchemaProps) {
  useEffect(() => {
    const schema = data ? { ...schemas[type], ...data } : schemas[type];
    
    // Remove existing schema of same type
    const existingScript = document.querySelector(`script[data-schema="${type}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-schema", type);
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [type, data]);

  return null;
}

// Combined schemas for landing page
export function LandingPageSchemas() {
  return (
    <>
      <SEOSchema type="website" />
      <SEOSchema type="software" />
      <SEOSchema type="organization" />
      <SEOSchema type="faq" />
      <SEOSchema type="howto" />
    </>
  );
}
