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
    "description": "Умный AI-бот для Telegram с характером",
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
    "description": "Умный AI-бот для Telegram с характером, который понимает контекст и не спамит. Модерация, память, собственное мнение.",
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
    "logo": "https://thecortes.ru/favicon.webp",
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
          "text": "Cortes предлагает: контекстное понимание сообщений, память о разговорах, собственное мнение по темам, автоматическую адаптацию к культуре чата, модерацию без спама, молниеносную реакцию."
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

// Token page schemas
const tokenSchemas = {
  token: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "$CORTES Token — Мем-токен комьюнити Cortes",
    "description": "Официальная страница токена $CORTES на Solana. Участвуйте в Airdrop Season 1, получайте награды за активность.",
    "url": "https://thecortes.ru/token",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Cortes",
      "url": "https://thecortes.ru"
    },
    "about": {
      "@type": "DigitalDocument",
      "name": "$CORTES",
      "description": "Мем-токен на блокчейне Solana для комьюнити бота Cortes"
    }
  },
  tokenFaq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Что такое $CORTES?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Это мем-токен на блокчейне Solana, созданный для комьюнити бота Cortes. Это не инвестиционный инструмент — просто фан-валюта для награждения активных участников сообщества."
        }
      },
      {
        "@type": "Question",
        "name": "Как получить токены $CORTES?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Подключите Solana-кошелёк, выполните задания (добавьте бота в группу, взаимодействуйте с ним, пригласите друзей) и получите награду в рамках сезонного airdrop."
        }
      },
      {
        "@type": "Question",
        "name": "Какой кошелёк нужен для $CORTES?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Любой Solana-кошелёк: Phantom, Solflare или Slope. Можно использовать расширение для браузера или мобильное приложение."
        }
      },
      {
        "@type": "Question",
        "name": "Сколько токенов $CORTES можно получить?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "В Season 1 максимальная награда — 50,000 $CORTES на участника. Базовый claim даёт 1,000 токенов, дополнительные награды за активность, рефералов и контент."
        }
      },
      {
        "@type": "Question",
        "name": "Когда будет листинг $CORTES на бирже?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Листинг на DEX (Raydium/Orca) запланирован в Phase 3 дорожной карты. Следите за анонсами в социальных сетях проекта."
        }
      }
    ]
  }
};

export function TokenPageSchemas() {
  useEffect(() => {
    // Add token page schema
    const tokenScript = document.createElement("script");
    tokenScript.type = "application/ld+json";
    tokenScript.setAttribute("data-schema", "token");
    tokenScript.textContent = JSON.stringify(tokenSchemas.token);
    document.head.appendChild(tokenScript);

    // Add token FAQ schema
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.setAttribute("data-schema", "tokenFaq");
    faqScript.textContent = JSON.stringify(tokenSchemas.tokenFaq);
    document.head.appendChild(faqScript);

    return () => {
      tokenScript.remove();
      faqScript.remove();
    };
  }, []);

  return null;
}
