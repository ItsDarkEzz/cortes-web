import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Home, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { useState, useEffect } from "react";

const cortesMessages = [
  "Хм... Эта страница куда-то пропала. Даже я не могу её найти.",
  "404? Серьёзно? Кто-то явно ошибся с URL.",
  "Я проанализировал все возможные варианты. Этой страницы не существует.",
  "Может, ты искал что-то другое? Я могу помочь!",
  "Эта страница ушла в закат. Как и мои надежды её найти.",
  "Ошибка 404. Но не переживай, я всё ещё здесь.",
];

const reactions = [
  { emoji: "🤔", text: "Странно..." },
  { emoji: "😅", text: "Упс!" },
  { emoji: "🔍", text: "Ищу..." },
  { emoji: "💀", text: "RIP страница" },
  { emoji: "🚀", text: "Улетела!" },
];

export default function NotFound() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [currentReaction, setCurrentReaction] = useState(reactions[0]);

  useSEO({
    title: "404 — Страница не найдена",
    description: "Запрашиваемая страница не существует. Вернитесь на главную страницу Cortes.",
    canonical: "/404",
  });

  // Typewriter effect
  useEffect(() => {
    const message = cortesMessages[messageIndex];
    let index = 0;
    setDisplayedText("");
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [messageIndex]);

  const handleAvatarClick = () => {
    setClickCount((prev) => prev + 1);
    setCurrentReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    
    if (clickCount > 0 && clickCount % 3 === 0) {
      setMessageIndex((prev) => (prev + 1) % cortesMessages.length);
    }
  };

  const nextMessage = () => {
    setMessageIndex((prev) => (prev + 1) % cortesMessages.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Floating 404 particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [-20, -200],
              x: Math.sin(i) * 50,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            className="absolute text-6xl font-bold text-white/5 select-none"
            style={{ left: `${15 + i * 15}%`, bottom: "10%" }}
          >
            404
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Cortes Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAvatarClick}
          className="relative mx-auto mb-8 cursor-pointer group"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1 shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <img 
                src="/favicon.webp" 
                alt="Cortes AI бот" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Reaction bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReaction.emoji}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl"
            >
              {currentReaction.emoji}
            </motion.div>
          </AnimatePresence>

          {/* Click hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          >
            нажми на меня
          </motion.div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500">
            404
          </span>
        </motion.div>

        {/* Chat Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative">
            {/* Chat bubble arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/5 border-l border-t border-white/10 rotate-45" />
            
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="text-left">
                <p className="text-lg text-white leading-relaxed min-h-[3.5rem]">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-2 h-5 bg-primary ml-1 align-middle"
                    />
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Next message button */}
          {!isTyping && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={nextMessage}
              className="absolute -bottom-3 right-4 px-3 py-1 text-xs bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-full text-primary transition-colors"
            >
              другая фраза →
            </motion.button>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 font-medium text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 cursor-pointer"
            >
              <Home className="mr-2 h-5 w-5" />
              На главную
            </Button>
          </Link>
          <a
            href="https://t.me/thecortesbot?startgroup=add"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-full border-white/20 bg-transparent hover:bg-white/5 hover:border-white/40 text-lg transition-all cursor-pointer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Добавить в чат
            </Button>
          </a>
        </motion.div>

        {/* Easter egg counter */}
        {clickCount >= 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-xs text-muted-foreground/50"
          >
            Ты нажал на меня {clickCount} раз. Зачем? 🤨
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
