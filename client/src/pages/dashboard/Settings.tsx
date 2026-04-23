import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Settings, User, Palette, LogOut, Moon, Sun, Globe, Loader2, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/lib/i18n";
import { Link } from "wouter";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || '';

function SettingItem({ icon: Icon, title, description, action, color = "text-white", onClick }: {
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
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className={`w-12 h-12 rounded-[16px] bg-[#09090b] shadow-inner border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/20 transition-all ${color}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="font-cortes-display text-xl leading-none tracking-tight text-white mb-1.5">{title}</h3>
          <p className="font-cortes-mono text-[10px] uppercase tracking-[0.1em] text-white/40">{description}</p>
        </div>
      </div>
      <div className="self-end sm:self-auto shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">
        {action || (onClick && <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />)}
      </div>
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
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
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
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="font-cortes-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
            {t("settings.title")}.
          </h1>
          <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-3">
            {t("settings.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto w-full min-w-0 max-w-full pb-36 md:pb-10">
        <div className="grid lg:grid-cols-2 gap-6 content-start">
          
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <h2 className="font-cortes-display text-2xl flex items-center gap-3 mb-6 border-b border-white/10 pb-4 text-white">
              <User size={20} className="text-[#3B82F6]" />
              {t("settings.profile")}
            </h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#3B82F6]/20 to-transparent border border-[rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden shadow-lg shrink-0">
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
                    <span className="font-cortes-display text-4xl text-white">C</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-cortes-display text-2xl text-white tracking-[-0.02em]">{displayName}</h3>
                  {username && <p className="font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-[#3B82F6] mt-1">{username}</p>}
                  <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/30 mt-2">{t("common.id")}: {user?.id}</p>
                </div>
              </div>
              
              <Link href="/dashboard/profile">
                <span className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-8 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-black transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {t("settings.edit")}
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="p-8 rounded-[32px] border border-white/10 bg-[#09090b]/80 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <h2 className="font-cortes-display text-2xl flex items-center gap-3 mb-6 border-b border-white/10 pb-4 text-white">
              <Palette size={20} className="text-[#8B5CF6]" />
              {language === "ru" ? "Внешний вид" : "Appearance"}
            </h2>
            
            <div className="space-y-3">
              {/* Language selector */}
              <div className="relative z-20">
                <SettingItem 
                  icon={Globe} 
                  title={t("settings.language")}
                  description={`${currentLang?.name || ''}`}
                  color="text-[#3B82F6]"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  action={
                    <div className="flex items-center gap-2 h-10 px-4 rounded-xl bg-black border border-white/10 group-hover:border-[#3B82F6]/50 transition-colors">
                      <span className="text-lg leading-none">{currentLang?.flag}</span>
                    </div>
                  }
                />
                
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-[calc(100%+4px)] w-[240px] bg-[#09090b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/10 transition-colors text-left"
                      >
                        <span className="text-xl leading-none">{lang.flag}</span>
                        <span className="flex-1 font-cortes-mono text-[10px] uppercase tracking-[0.2em] text-white">{lang.name}</span>
                        {language === lang.code && (
                          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* Theme selector */}
              <div className="relative z-10">
                <SettingItem 
                  icon={theme === "dark" ? Moon : Sun} 
                  title={t("settings.theme")}
                  description={theme === "dark" ? "Dark Mode Absolute" : "Not supported in this version"}
                  color="text-yellow-400"
                  action={
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-black border border-white/10">
                      <button
                        disabled
                        className="p-2.5 rounded-lg transition-all text-white/20 opacity-50 cursor-not-allowed"
                        title="Светлая тема отключена"
                      >
                        <Sun size={14} />
                      </button>
                      <button
                        className="p-2.5 rounded-lg transition-all bg-[#09090b] text-white shadow-inner border border-white/10"
                      >
                        <Moon size={14} />
                      </button>
                    </div>
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 p-8 rounded-[32px] border border-red-500/20 bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.1),transparent_70%)] bg-[#09090b] mt-4"
          >
            <h2 className="font-cortes-display text-xl text-red-500 mb-6">{t("settings.danger")}</h2>
            
            <div className="space-y-3">
              <SettingItem 
                icon={LogOut} 
                title={t("settings.logout")}
                description={t("settings.logout.desc")}
                color="text-red-500"
                onClick={handleLogout}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
