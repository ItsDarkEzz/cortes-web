import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Settings, BarChart3, Gamepad2, MessageCircle, Trophy, Bell
} from "lucide-react";

const mockUser = {
  name: "Шахриёр",
  avatar: "🧑‍💻",
  level: 42,
};

const navItems = [
  { icon: BarChart3, label: "Обзор", href: "/dashboard" },
  { icon: MessageCircle, label: "Чаты", href: "/dashboard/chats" },
  { icon: Gamepad2, label: "RPG", href: "/dashboard/rpg" },
  { icon: Trophy, label: "Достижения", href: "/dashboard/achievements" },
  { icon: Settings, label: "Настройки", href: "/dashboard/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

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
                <Link key={item.label} href={item.href}>
                  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location === item.href
                      ? "bg-white/10 text-white" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}>
                    <item.icon size={16} />
                    {item.label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full text-[9px] flex items-center justify-center">3</span>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <div className="flex items-center gap-2 pl-3 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">Lvl {mockUser.level}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
                  {mockUser.avatar}
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
            <Link key={item.label} href={item.href}>
              <button className={`flex flex-col items-center gap-0.5 p-2 ${
                location === item.href ? "text-primary" : "text-muted-foreground"
              }`}>
                <item.icon size={18} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
