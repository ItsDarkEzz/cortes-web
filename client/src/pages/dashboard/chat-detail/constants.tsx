/**
 * Константы и моки для ChatDetail
 */

export type TabType = "overview" | "bot" | "moderation" | "filters" | "members" | "logs" | "brain" | "plan";
export type UserRole = "owner" | "admin" | "moderator" | "member";

export const roleLabels: Record<UserRole, string> = { 
  owner: "Владелец", 
  admin: "Админ", 
  moderator: "Модератор", 
  member: "Участник" 
};

export const roleColors: Record<UserRole, string> = { 
  owner: "text-yellow-400 bg-yellow-400/10", 
  admin: "text-red-400 bg-red-400/10", 
  moderator: "text-blue-400 bg-blue-400/10", 
  member: "text-muted-foreground bg-white/5" 
};

export const mockPlan = {
  current: "pro",
  name: "Pro",
  expiresAt: "15 января 2025",
  daysLeft: 28,
  features: ["Безлимитные сообщения", "Все функции модерации", "Приоритетная поддержка", "API доступ"],
};

export const plans = [
  { id: "free", name: "Free", price: "0", period: "", features: ["100 сообщений/день", "Базовая модерация", "Память бота"], color: "text-muted-foreground", popular: false },
  { id: "pro", name: "Pro", price: "990", period: "/мес", features: ["Безлимит сообщений", "Все функции модерации", "Приоритетная поддержка", "API доступ"], color: "text-primary", popular: true },
  { id: "business", name: "Business", price: "2990", period: "/мес", features: ["Всё из Pro", "Несколько чатов", "Выделенный сервер", "SLA 99.9%"], color: "text-yellow-400", popular: false },
];

export const API_BASE = import.meta.env.VITE_API_URL || '';
