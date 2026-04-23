import { Link, useLocation } from "wouter";
import { 
  Settings, BarChart3, MessageCircle, Shield
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";
import { SiteFrame } from "@/components/cortes/SiteChrome";

const API_BASE = import.meta.env.VITE_API_URL || '';

// ID владельца бота (можно вынести в env)
const OWNER_ID = import.meta.env.VITE_OWNER_ID ? parseInt(import.meta.env.VITE_OWNER_ID) : null;

const navItems: { icon: typeof BarChart3; labelKey: TranslationKey; href: string }[] = [
  { icon: BarChart3, labelKey: "nav.overview", href: "/dashboard" },
  { icon: MessageCircle, labelKey: "nav.chats", href: "/dashboard/chats" },
  { icon: Settings, labelKey: "nav.settings", href: "/dashboard/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  const avatarUrl = user?.avatar ? `${API_BASE}${user.avatar}` : null;
  const displayName = user?.name || user?.username || "User";
  
  // Проверяем, является ли пользователь владельцем
  const isOwner = OWNER_ID && user?.id === OWNER_ID;

  return (
    <SiteFrame className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-[32px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-6 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group cursor-pointer no-underline">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-cortes-display text-[14px] leading-none transition-transform group-hover:rotate-12 hover:scale-105">
                C
              </span>
              <span className="hidden sm:block font-cortes-display text-[1rem] leading-none tracking-[-0.04em] text-white">
                Cortes
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 min-w-0 font-cortes-mono text-[10px] uppercase tracking-[0.2em]">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.labelKey} href={item.href}>
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      isActive
                        ? "bg-white/10 text-white border border-white/10" 
                        : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}>
                      <item.icon size={12} className={isActive ? "text-[#3B82F6]" : ""} />
                      {t(item.labelKey)}
                    </button>
                  </Link>
                );
              })}
              
              {/* Owner Panel - только для владельца */}
              {isOwner && (
                <Link href="/dashboard/owner">
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    location.startsWith("/dashboard/owner")
                      ? "bg-red-500/20 text-red-500 border border-red-500/30" 
                      : "text-red-500/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent"
                  }`}>
                    <Shield size={12} />
                    Owner
                  </button>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/dashboard/profile">
              <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">{displayName}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-sm overflow-hidden ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>C</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 cortes-shell">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-8 pb-32 md:pb-12 h-full min-h-0 flex flex-col relative">
          {children}
        </div>
      </main>

      {/* Mobile nav (Floating Dock Style) */}
      <nav className="md:hidden fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-around gap-2 w-full max-w-sm rounded-full border border-white/10 bg-[#09090b]/80 px-2 py-2 backdrop-blur-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.labelKey} href={item.href}>
                <button className={`flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all ${
                  isActive ? "bg-white/10 text-white shadow-inner" : "text-white/40 hover:text-white"
                }`}>
                  <item.icon size={16} className={isActive ? "text-[#3B82F6]" : ""} />
                </button>
              </Link>
            );
          })}
          {/* Owner Panel - мобильная версия */}
          {isOwner && (
            <Link href="/dashboard/owner">
              <button className={`flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all ${
                location.startsWith("/dashboard/owner") ? "bg-red-500/20 text-red-500 shadow-inner border border-red-500/20" : "text-red-500/50 hover:text-red-400"
              }`}>
                <Shield size={16} />
              </button>
            </Link>
          )}
        </div>
      </nav>
    </SiteFrame>
  );
}
