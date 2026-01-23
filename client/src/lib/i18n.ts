export type Language = "ru" | "en";

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

const ru = {
  // Navigation
  "nav.overview": "Обзор",
  "nav.chats": "Чаты",
  "nav.settings": "Настройки",
  
  // Settings page
  "settings.title": "Настройки",
  "settings.subtitle": "Управление аккаунтом и предпочтениями",
  "settings.profile": "Профиль",
  "settings.edit": "Изменить",
  "settings.language": "Язык",
  "settings.theme": "Тема",
  "settings.theme.dark": "Тёмная",
  "settings.theme.light": "Светлая",
  "settings.danger": "Опасная зона",
  "settings.logout": "Выйти из аккаунта",
  "settings.logout.desc": "Завершить текущую сессию",
  
  // Dashboard
  "dashboard.welcome": "Добро пожаловать",
  "dashboard.stats.chats": "Активных чатов",
  "dashboard.stats.messages": "Сообщений",
  "dashboard.stats.users": "Пользователей",
  
  // Chats
  "chats.title": "Ваши чаты",
  "chats.empty": "У вас пока нет чатов",
  "chats.members": "участников",
  "chats.messages": "сообщений",
  
  // Profile
  "profile.title": "Профиль",
  "profile.member.since": "Участник с",
  "profile.activity": "Дней активности",
  
  // Common
  "common.loading": "Загрузка...",
  "common.save": "Сохранить",
  "common.cancel": "Отмена",
  "common.delete": "Удалить",
  "common.edit": "Редактировать",
  "common.back": "Назад",
  "common.id": "ID",
} as const;

const en: Record<keyof typeof ru, string> = {
  // Navigation
  "nav.overview": "Overview",
  "nav.chats": "Chats",
  "nav.settings": "Settings",
  
  // Settings page
  "settings.title": "Settings",
  "settings.subtitle": "Manage your account and preferences",
  "settings.profile": "Profile",
  "settings.edit": "Edit",
  "settings.language": "Language",
  "settings.theme": "Theme",
  "settings.theme.dark": "Dark",
  "settings.theme.light": "Light",
  "settings.danger": "Danger Zone",
  "settings.logout": "Log out",
  "settings.logout.desc": "End current session",
  
  // Dashboard
  "dashboard.welcome": "Welcome",
  "dashboard.stats.chats": "Active chats",
  "dashboard.stats.messages": "Messages",
  "dashboard.stats.users": "Users",
  
  // Chats
  "chats.title": "Your chats",
  "chats.empty": "You don't have any chats yet",
  "chats.members": "members",
  "chats.messages": "messages",
  
  // Profile
  "profile.title": "Profile",
  "profile.member.since": "Member since",
  "profile.activity": "Days active",
  
  // Common
  "common.loading": "Loading...",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.back": "Back",
  "common.id": "ID",
};

export const translations = { ru, en };

export type TranslationKey = keyof typeof ru;
