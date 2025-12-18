import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, Palette, LogOut, ChevronRight, Moon, Globe } from "lucide-react";

const mockUser = {
  name: "Шахриёр",
  username: "@shahriyor_dev",
  email: "shahriyor@example.com",
  avatar: "🧑‍💻",
  telegramId: "123456789",
};

function SettingItem({ icon: Icon, title, description, action, color = "text-primary" }: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action || <ChevronRight size={18} className="text-muted-foreground group-hover:text-white transition-colors" />}
    </div>
  );
}

function ToggleSwitch({ enabled }: { enabled: boolean }) {
  return (
    <div className={`w-11 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-white/20"}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-0.5 ${enabled ? "translate-x-5.5 ml-0.5" : "translate-x-0.5"}`} />
    </div>
  );
}

export default function SettingsPage() {
  useSEO({
    title: "Настройки | Cortes AI",
    description: "Настройки аккаунта Cortes",
    canonical: "/dashboard/settings",
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Настройки
        </h1>
        <p className="text-sm text-muted-foreground">Управление аккаунтом и предпочтениями</p>
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
              Профиль
            </h2>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
                {mockUser.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{mockUser.name}</h3>
                <p className="text-sm text-muted-foreground">{mockUser.username}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {mockUser.telegramId}</p>
              </div>
              <Button variant="outline" size="sm" className="border-white/10">
                Изменить
              </Button>
            </div>

            <div className="space-y-2">
              <SettingItem 
                icon={Globe} 
                title="Язык" 
                description="Русский"
              />
              <SettingItem 
                icon={Palette} 
                title="Тема" 
                description="Тёмная"
                action={<Moon size={18} className="text-primary" />}
              />
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Bell size={18} className="text-yellow-400" />
              Уведомления
            </h2>
            
            <div className="space-y-2">
              <SettingItem 
                icon={Bell} 
                title="Push-уведомления" 
                description="Получать уведомления в браузере"
                action={<ToggleSwitch enabled={true} />}
                color="text-yellow-400"
              />
              <SettingItem 
                icon={Bell} 
                title="Email-уведомления" 
                description="Еженедельная сводка активности"
                action={<ToggleSwitch enabled={false} />}
                color="text-yellow-400"
              />
              <SettingItem 
                icon={Bell} 
                title="Telegram-уведомления" 
                description="Важные события в боте"
                action={<ToggleSwitch enabled={true} />}
                color="text-yellow-400"
              />
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-green-400" />
              Безопасность
            </h2>
            
            <div className="space-y-2">
              <SettingItem 
                icon={Shield} 
                title="Активные сессии" 
                description="2 устройства"
                color="text-green-400"
              />
              <SettingItem 
                icon={Shield} 
                title="История входов" 
                description="Последний: сегодня, 14:32"
                color="text-green-400"
              />
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-xl bg-red-500/5 border border-red-500/20"
          >
            <h2 className="font-semibold mb-4 text-red-400">Опасная зона</h2>
            
            <div className="space-y-2">
              <SettingItem 
                icon={LogOut} 
                title="Выйти из аккаунта" 
                description="Завершить текущую сессию"
                color="text-red-400"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
