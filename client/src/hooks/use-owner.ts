/**
 * Хуки для Owner Panel
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerApi, type GlobalBan } from '@/lib/api';

// Статистика бота
export function useBotStats() {
  return useQuery({
    queryKey: ['owner', 'stats'],
    queryFn: () => ownerApi.getStats(),
    refetchInterval: 30000, // Обновлять каждые 30 секунд
  });
}

// Использование LLM
export function useLLMUsage(period: '24h' | '7d' | '30d' | 'all' = '24h') {
  return useQuery({
    queryKey: ['owner', 'llm-usage', period],
    queryFn: () => ownerApi.getLLMUsage(period),
  });
}

// Топ чатов по использованию LLM
export function useTopLLMChats(limit: number = 5, period: '24h' | '7d' | '30d' | 'all' = '7d') {
  return useQuery({
    queryKey: ['owner', 'top-llm-chats', limit, period],
    queryFn: () => ownerApi.getTopLLMChats(limit, period),
  });
}

// Логи
export function useOwnerLogs(params: {
  page?: number;
  limit?: number;
  level?: string;
  source?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ['owner', 'logs', params],
    queryFn: () => ownerApi.getLogs(params),
    refetchInterval: 5000, // Обновлять каждые 5 секунд
  });
}

// Чаты бота
export function useBotChats(params: {
  page?: number;
  limit?: number;
  search?: string;
  active_only?: boolean;
  chat_type?: 'private' | 'group' | 'all';
} = {}) {
  return useQuery({
    queryKey: ['owner', 'chats', params],
    queryFn: () => ownerApi.getChats(params),
  });
}

// Детальная информация о чате
export function useChatDetails(telegram_chat_id: number) {
  return useQuery({
    queryKey: ['owner', 'chat', telegram_chat_id],
    queryFn: () => ownerApi.getChatDetails(telegram_chat_id),
    enabled: !!telegram_chat_id,
  });
}

// Отладка контекста чата
export function useChatContextDebug(telegram_chat_id: number, enabled = true) {
  return useQuery({
    queryKey: ['owner', 'chat-context', telegram_chat_id],
    queryFn: () => ownerApi.getChatContextDebug(telegram_chat_id),
    enabled: !!telegram_chat_id && enabled,
    refetchInterval: 10000, // Обновлять каждые 10 секунд
  });
}

// Обновление настроек чата
export function useUpdateChatSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, settings }: { 
      chatId: number; 
      settings: Partial<{
        is_enabled: boolean;
        bot_mode: 'normal' | 'passive' | 'muted' | 'admins';
        language: string;
        nsfw_filter: boolean;
        auto_moderation: boolean;
      }>;
    }) => ownerApi.updateChatSettings(chatId, settings),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'chat', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'chats'] });
    },
  });
}

// Выход из чата
export function useLeaveChat() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, notify, message }: { 
      chatId: number; 
      notify?: boolean; 
      message?: string;
    }) => ownerApi.leaveChat(chatId, notify, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'chats'] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'stats'] });
    },
  });
}

// Глобальные баны
export function useGlobalBans(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ['owner', 'bans', params],
    queryFn: () => ownerApi.getBans(params),
  });
}

// Создание бана
export function useCreateBan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      telegram_user_id: number;
      reason: GlobalBan['reason'];
      reason_text?: string;
      duration_days?: number;
    }) => ownerApi.createBan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'bans'] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'stats'] });
    },
  });
}

// Удаление бана
export function useRemoveBan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (telegram_user_id: number) => ownerApi.removeBan(telegram_user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'bans'] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'stats'] });
    },
  });
}

// Подписки
export function useSubscriptions(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ['owner', 'subscriptions', params],
    queryFn: () => ownerApi.getSubscriptions(params),
  });
}

// Создание подписки
export function useCreateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      telegram_user_id: number;
      plan_id: string;
      duration_days?: number;
      auto_renew?: boolean;
    }) => ownerApi.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'subscriptions'] });
    },
  });
}

// Обновление подписки
export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: {
      id: number;
      data: {
        plan_id?: string;
        expires_at?: string;
        status?: string;
        auto_renew?: boolean;
      };
    }) => ownerApi.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'subscriptions'] });
    },
  });
}

// Рассылка
export function useBroadcast() {
  return useMutation({
    mutationFn: (data: {
      message: string;
      target?: 'all' | 'subscribers' | 'chat_admins';
      chat_ids?: number[];
      user_ids?: number[];
    }) => ownerApi.sendBroadcast(data),
  });
}

export function useLLMPriority() {
  return useQuery({
    queryKey: ['owner', 'llm-priority'],
    queryFn: () => ownerApi.getLLMPriority(),
  });
}

export function useUpdateLLMPriority() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<import('@/lib/api/owner').LLMChainsResponse>) =>
      ownerApi.updateLLMPriority(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'llm-priority'] });
    },
  });
}

// Custom Providers
export function useCustomProviders() {
  return useQuery({
    queryKey: ['owner', 'custom-providers'],
    queryFn: () => ownerApi.getCustomProviders(),
  });
}

export function useCreateCustomProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: import('@/lib/api/owner').CustomLLMProviderCreate) =>
      ownerApi.createCustomProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'custom-providers'] });
    },
  });
}

export function useUpdateCustomProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: import('@/lib/api/owner').CustomLLMProviderUpdate }) =>
      ownerApi.updateCustomProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'custom-providers'] });
    },
  });
}

export function useDeleteCustomProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ownerApi.deleteCustomProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'custom-providers'] });
    },
  });
}
