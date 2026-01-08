import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Settings, User, Palette, LogOut, Moon, Sun, Globe, Loader2, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/lib/i18n";
import { Link } from "wouter";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || '';

function SettingItem({ icon: Icon, title, description, action, color = "text-primary", onClick }: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/[0.07] transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  useSEO({
    title: `${t("settings.title")} | Cortes AI`,
    description: t("settings.subtitle"),
    canonical: "/dashboard/settings",
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const displayName = user?.name || user?.username || "Пользователь";
  const username = user?.username ? `@${user.username}` : null;
  const avatarUrl = user?.id ? `${API_BASE}/user/avatar/${user.id}` : null;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const currentLang = languages.find(l => l.code === language);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          {t("settings.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" />
              {t("settings.profile")}
            </h2>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
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
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{displayName}</h3>
                {username && <p className="text-sm text-muted-foreground">{username}</p>}
                <p className="text-xs text-muted-foreground mt-1">{t("common.id")}: {user?.id}</p>
              </div>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm" className="border-white/10">
                  {t("settings.edit")}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Palette size={18} className="text-purple-400" />
              {language === "ru" ? "Внешний вид" : "Appearance"}
            </h2>
            
            <div className="space-y-2">
              {/* Language selector */}
              <div className="relative">
                <SettingItem 
                  icon={Globe} 
                  title={t("settings.language")}
                  description={`${currentLang?.flag} ${currentLang?.name}`}
                  color="text-blue-400"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  action={
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{currentLang?.flag}</span>
                    </div>
                  }
                />
                
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 z-10 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="flex-1 text-left">{lang.name}</span>
                        {language === lang.code && (
                          <Check size={16} className="text-primary" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* Theme selector */}
              <SettingItem 
                icon={theme === "dark" ? Moon : Sun} 
                title={t("settings.theme")}
                description={theme === "dark" ? t("settings.theme.dark") : t("settings.theme.light")}
                color={theme === "dark" ? "text-yellow-400" : "text-orange-400"}
                action={
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme("light");
                      }}
                      className={`p-2 rounded-md transition-all ${
                        theme === "light" 
                          ? "bg-orange-500/20 text-orange-400" 
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      <Sun size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme("dark");
                      }}
                      className={`p-2 rounded-md transition-all ${
                        theme === "dark" 
                          ? "bg-yellow-500/20 text-yellow-400" 
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      <Moon size={16} />
                    </button>
                  </div>
                }
              />
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-red-500/5 border border-red-500/20"
          >
            <h2 className="font-semibold mb-4 text-red-400">{t("settings.danger")}</h2>
            
            <div className="space-y-2">
              <SettingItem 
                icon={LogOut} 
                title={t("settings.logout")}
                description={t("settings.logout.desc")}
                color="text-red-400"
                onClick={handleLogout}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
