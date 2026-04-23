import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuthInit, useAuthStatus, useLogin } from "@/hooks/use-auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { SiteFrame } from "@/components/cortes/SiteChrome";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

type AuthStep = "idle" | "waiting" | "confirmed" | "error" | "expired";

export default function Login() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuthContext();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [step, setStep] = useState<AuthStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const authInit = useAuthInit();
  const login = useLogin();
  const { data: statusData } = useAuthStatus(authToken, { enabled: step === "waiting" });

  useSEO({
    title: "Идентификация | Cortes AI",
    description: "Войдите в личный кабинет Cortes через Telegram для настройки бота.",
    canonical: "/login",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!statusData || step === "confirmed") return;

    if (statusData.status === "success" || statusData.status === "confirmed") {
      setAuthToken(null);
      setStep("confirmed");
      
      if (statusData.access_token && statusData.refresh_token) {
        login.mutate(
          { access_token: statusData.access_token, refresh_token: statusData.refresh_token },
          {
            onSuccess: () => {
              setTimeout(() => navigate("/dashboard"), 1000);
            },
            onError: () => {
              setError("Не удалось завершить авторизацию");
              setStep("error");
            }
          }
        );
      } else {
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } else if (statusData.status === "expired") {
      setStep("expired");
      setAuthToken(null);
    }
  }, [statusData, login, navigate, step]);

  const startAuth = useCallback(async () => {
    setError(null);
    setStep("idle");
    
    try {
      const result = await authInit.mutateAsync();
      setAuthToken(result.auth_token);
      setStep("waiting");
      
      const botUrl = `https://t.me/TheCortesBot?start=auth_${result.auth_token}`;
      const newWindow = window.open(botUrl, "_blank", "noopener,noreferrer");
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = botUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      setError("Не удалось начать авторизацию. Попробуйте позже.");
      setStep("error");
    }
  }, [authInit]);

  const resetAuth = () => {
    setAuthToken(null);
    setStep("idle");
    setError(null);
  };

  const renderAuthState = () => {
    switch (step) {
      case "waiting":
        return (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-[2rem] bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/30 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <TelegramIcon className="w-10 h-10 text-[#3B82F6]" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              </div>
            </div>
            
            <h3 className="font-cortes-display text-[2rem] text-center text-white mb-2 tracking-[-0.04em]">Ожидание</h3>
            <p className="text-base text-white/50 text-center mb-10 max-w-xs leading-relaxed">
              Откройте Telegram и нажмите «Старт» в боте @TheCortesBot
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-sm">
              <Button
                variant="outline"
                asChild
                className="h-14 flex-1 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-cortes-mono text-[10px] uppercase tracking-[0.2em]"
              >
                <a href={`https://t.me/TheCortesBot?start=auth_${authToken}`}>
                  <TelegramIcon className="w-4 h-4 mr-2" />
                  Открыть бота
                </a>
              </Button>
              <Button variant="ghost" onClick={resetAuth} className="h-14 px-6 rounded-full font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white">
                Отмена
              </Button>
            </div>
          </motion.div>
        );

      case "confirmed":
        return (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-20 h-20 rounded-[2rem] bg-[#3B82F6]/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-[#3B82F6]" />
            </div>
            <h3 className="font-cortes-display text-[2rem] text-center text-white mb-2 tracking-[-0.04em]">Успешно</h3>
            <p className="text-base text-white/50 text-center">
              Подтверждено. Вход в систему...
            </p>
          </motion.div>
        );

      case "expired":
        return (
          <motion.div
            key="expired"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 mb-8">
              <RefreshCw className="w-10 h-10 text-white/50" />
            </div>
            <h3 className="font-cortes-display text-[2rem] text-center text-white mb-2 tracking-[-0.04em]">Сессия истекла</h3>
            <p className="text-base text-white/50 text-center mb-10">
              Время ожидания авторизации вышло.
            </p>

            <Button onClick={startAuth} className="h-14 px-10 rounded-full bg-white text-black font-cortes-mono text-[12px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <RefreshCw className="w-4 h-4 mr-3" />
              Попробовать снова
            </Button>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-8">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="font-cortes-display text-[2rem] text-center text-white mb-2 tracking-[-0.04em]">Сбой</h3>
            <p className="text-base text-red-400/80 text-center mb-10 max-w-xs">
              {error || "Не удалось завершить идентификацию"}
            </p>

            <Button onClick={startAuth} className="h-14 px-10 rounded-full bg-white text-black font-cortes-mono text-[12px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <RefreshCw className="w-4 h-4 mr-3" />
              Повторить
            </Button>
          </motion.div>
        );

      default:
        return (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#3B82F6]/20 bg-[#3B82F6]/10 mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <Sparkles className="w-3 h-3 text-[#3B82F6]" />
              <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#3B82F6]">Вход в панель</span>
            </div>

            <h1 className="font-cortes-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.06em] text-white text-center mb-6">
              Идентификация
            </h1>
            
            <p className="text-lg text-white/40 text-center max-w-md leading-relaxed mb-12">
              Доступ к управлению памятью и правилами бота осуществляется только через ваш Telegram-аккаунт.
            </p>

            <Button
              onClick={startAuth}
              disabled={authInit.isPending}
              className="h-14 px-10 rounded-full bg-white text-black focus:outline-none hover:bg-white/90 font-cortes-mono text-[12px] uppercase tracking-[0.2em] transition-transform hover:scale-105 disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {authInit.isPending ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <TelegramIcon className="w-5 h-5 mr-3" />
              )}
              Войти через Telegram
            </Button>
          </motion.div>
        );
    }
  };


  return (
    <SiteFrame>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 cortes-shell">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 left-0 -mt-24 sm:-mt-32"
          >
            <Link href="/">
              <span className="group inline-flex items-center text-white/40 hover:text-white transition-colors cursor-pointer font-cortes-mono text-[10px] uppercase tracking-[0.2em]">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                На главную
              </span>
            </Link>
          </motion.div>

          {/* Absolute minimal glass container matching the brutalist theme */}
          <div className="w-full rounded-[40px] border border-white/10 bg-[#09090b]/60 backdrop-blur-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] p-8 sm:p-12 min-h-[460px] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {renderAuthState()}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
