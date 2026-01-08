import { apiClient } from './client';
import type {
  Chat,
  ChatDetails,
  ChatSettings,
  ChatMember,
  LogEntry,
  Message,
  BrainConfig,
  ChatPlan,
  PaginatedResponse,
  PaginationParams,
  SettingsLogEntry,
  Opinion,
  OpinionCreate,
  OpinionUpdate,
  OpinionsListResponse,
} from './types';

export const chatsApi = {
  /**
   * Получить список чатов пользователя
   */
  list: () => apiClient.get<{ chats: Chat[] }>('/chats'),

  /**
   * Получить информацию о чате
   */
  get: (chatId: string) => apiClient.get<ChatDetails>(`/chats/${chatId}`),

  /**
   * Обновить информацию о чате
   */
  update: (chatId: string, data: { name?: string; description?: string; rules?: string }) =>
    apiClient.patch<{ success: boolean }>(`/chats/${chatId}`, data),

  // Settings
  settings: {
    get: (chatId: string) => apiClient.get<ChatSettings>(`/chats/${chatId}/settings`),
    update: (chatId: string, settings: Partial<ChatSettings>) =>
      apiClient.patch<ChatSettings>(`/chats/${chatId}/settings`, settings),
  },

  // Members
  members: {
    list: (chatId: string, params?: PaginationParams & { search?: string; role?: string }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.search) query.set('search', params.search);
      if (params?.role) query.set('role', params.role);
      const qs = query.toString();
      return apiClient.get<{ members: ChatMember[]; total: number; warning_limit: number }>(`/chats/${chatId}/members${qs ? `?${qs}` : ''}`);
    },
    updateRole: (chatId: string, userId: number, role: string) =>
      apiClient.patch(`/chats/${chatId}/members/${userId}/role`, { role }),
    removeWarning: (chatId: string, userId: number) =>
      apiClient.delete<{ success: boolean; warnings_left: number; message: string }>(`/chats/${chatId}/members/${userId}/warning`),
  },


  // Logs
  logs: {
    list: (chatId: string, params?: PaginationParams & { type?: string; from_date?: string; to_date?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.type) query.set('type', params.type);
      if (params?.from_date) query.set('from_date', params.from_date);
      if (params?.to_date) query.set('to_date', params.to_date);
      const qs = query.toString();
      return apiClient.get<{ logs: LogEntry[]; pagination: { total: number; page: number; limit: number; pages: number } }>(`/chats/${chatId}/logs${qs ? `?${qs}` : ''}`);
    },
  },

  // Messages
  messages: {
    list: (chatId: string, params?: PaginationParams & { deleted?: boolean; user_id?: number }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.deleted !== undefined) query.set('deleted', String(params.deleted));
      if (params?.user_id) query.set('user_id', String(params.user_id));
      const qs = query.toString();
      return apiClient.get<{ messages: Message[]; pagination: { total: number; page: number; limit: number; pages: number } }>(`/chats/${chatId}/messages${qs ? `?${qs}` : ''}`);
    },
  },

  // Settings Logs
  settingsLogs: {
    list: (chatId: string, params?: PaginationParams) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      const qs = query.toString();
      return apiClient.get<{ logs: SettingsLogEntry[]; pagination: { total: number; page: number; limit: number; pages: number } }>(`/chats/${chatId}/settings-logs${qs ? `?${qs}` : ''}`);
    },
  },

  // Brain
  brain: {
    get: (chatId: string) => apiClient.get<BrainConfig>(`/chats/${chatId}/brain`),
    updateInstructions: (chatId: string, instructions: string) =>
      apiClient.patch<{ success: boolean }>(`/chats/${chatId}/brain/instructions`, { instructions }),
  },

  // Opinions
  opinions: {
    list: (chatId: string, includeDefaults: boolean = true) =>
      apiClient.get<OpinionsListResponse>(`/chats/${chatId}/brain/opinions?include_defaults=${includeDefaults}`),
    create: (chatId: string, data: OpinionCreate) =>
      apiClient.post<Opinion>(`/chats/${chatId}/brain/opinions`, data),
    update: (chatId: string, opinionId: number, data: OpinionUpdate) =>
      apiClient.patch<Opinion>(`/chats/${chatId}/brain/opinions/${opinionId}`, data),
    delete: (chatId: string, opinionId: number) =>
      apiClient.delete<{ success: boolean }>(`/chats/${chatId}/brain/opinions/${opinionId}`),
  },

  // Plan
  plan: {
    get: (chatId: string) => apiClient.get<ChatPlan>(`/chats/${chatId}/plan`),
  },
};
