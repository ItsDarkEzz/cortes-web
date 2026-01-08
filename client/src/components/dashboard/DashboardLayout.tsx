import { Link, useLocation } from "wouter";
import { 
  Settings, BarChart3, MessageCircle, Shield
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

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
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display font-bold text-lg tracking-tight text-gradient">
              CORTES
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.labelKey} href={item.href}>
                  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location === item.href
                      ? "bg-primary text-white" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}>
                    <item.icon size={16} />
                    {t(item.labelKey)}
                  </button>
                </Link>
              ))}
              {/* Owner Panel - только для владельца */}
              {isOwner && (
                <Link href="/dashboard/owner">
                  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.startsWith("/dashboard/owner")
                      ? "bg-red-500 text-white" 
                      : "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  }`}>
                    <Shield size={16} />
                    Owner
                  </button>
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications - временно отключено
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full text-[9px] flex items-center justify-center">3</span>
              </Button>
            </Link>
            */}
            <Link href="/dashboard/profile">
              <div className="flex items-center gap-2 pl-3 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm overflow-hidden">
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
                    <span>👤</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 h-full flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile nav */}
      <nav className="md:hidden shrink-0 bg-background/90 backdrop-blur-xl border-t border-white/10 px-2 py-1">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link key={item.labelKey} href={item.href}>
              <button className={`flex flex-col items-center gap-0.5 p-2 ${
                location === item.href ? "text-primary" : "text-muted-foreground"
              }`}>
                <item.icon size={18} />
                <span className="text-[10px]">{t(item.labelKey)}</span>
              </button>
            </Link>
          ))}
          {/* Owner Panel - мобильная версия */}
          {isOwner && (
            <Link href="/dashboard/owner">
              <button className={`flex flex-col items-center gap-0.5 p-2 ${
                location.startsWith("/dashboard/owner") ? "text-red-400" : "text-red-400/60"
              }`}>
                <Shield size={18} />
                <span className="text-[10px]">Owner</span>
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
