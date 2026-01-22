/**
 * Owner Panel API
 * API для панели владельца бота
 */

import { apiClient } from './client';

// ============ Types ============

export interface BotStats {
  total_users: number;
  active_users_24h: number;
  active_users_7d: number;
  total_chats: number;
  active_chats: number;
  total_messages_24h: number;
  total_messages_7d: number;
  llm_calls_24h: number;
  llm_tokens_24h: number;
  llm_cost_24h: number;
  global_bans_count: number;
  uptime_seconds: number;
}

export interface OwnerLogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  source: 'bot' | 'observer' | 'core' | 'api' | 'scheduler' | 'moderation' | 'memory';
  message: string;
  chat_id?: number;
  user_id?: number;
  extra?: Record<string, unknown>;
}

export interface LogsResponse {
  logs: OwnerLogEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface GlobalBan {
  id: number;
  telegram_user_id: number;
  username?: string;
  first_name?: string;
  reason: 'spam' | 'abuse' | 'nsfw' | 'scam' | 'flood' | 'other';
  reason_text?: string;
  banned_by: number;
  banned_at: string;
  expires_at?: string;
  is_permanent: boolean;
}

export interface GlobalBansResponse {
  bans: GlobalBan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BotChat {
  id: number;
  telegram_chat_id: number;
  chat_uuid?: string;  // UUID чата для API
  title: string;
  chat_type: 'private' | 'group' | 'supergroup' | 'channel';
  username?: string;
  members_count: number;
  messages_count: number;
  messages_today: number;
  is_active: boolean;
  is_enabled?: boolean;
  joined_at: string;
  last_activity?: string;
  avatar_url?: string;
}

export interface ChatMember {
  telegram_user_id: number;
  username?: string;
  first_name?: string;
  display_name?: string;
  messages_count: number;
  last_message_at?: string;
  joined_at?: string;
  avatar_url?: string;
}

export interface ChatDetailedStats {
  messages_total: number;
  messages_24h: number;
  messages_7d: number;
  messages_30d: number;
  unique_users_24h: number;
  unique_users_7d: number;
  llm_calls_total: number;
  llm_calls_24h: number;
  llm_tokens_total: number;
  llm_cost_total: number;
  observer_calls_total: number;
  observer_activations: number;
  avg_messages_per_day: number;
}

export interface ChatSettings {
  is_enabled: boolean;
  bot_mode: 'normal' | 'passive' | 'muted' | 'admins';
  language: string;
  nsfw_filter: boolean;
  auto_moderation: boolean;
}

export interface ChatDetailedResponse {
  chat: BotChat;
  stats: ChatDetailedStats;
  settings: ChatSettings;
  subscription?: UserSubscription;
  members: ChatMember[];
  recent_logs: OwnerLogEntry[];
}

export interface BotChatsResponse {
  chats: BotChat[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  total_chats: number;
  active_chats: number;
  private_chats: number;
  group_chats: number;
}

export interface LLMUsageEntry {
  provider: string;
  model: string;
  calls_count: number;
  tokens_input: number;
  tokens_output: number;
  cost: number;
  avg_latency_ms: number;
}

export interface LLMUsageResponse {
  period: string;
  entries: LLMUsageEntry[];
  total_cost: number;
  total_tokens: number;
}

export interface LLMModelEntry {
  provider: string;
  model: string;
  enabled: boolean;
}

export interface LLMChainsResponse {
  response: LLMModelEntry[];
  observer: LLMModelEntry[];
  background: LLMModelEntry[];
}

export interface UserSubscription {
  id: number;
  telegram_user_id: number;
  username?: string;
  first_name?: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  started_at: string;
  expires_at?: string;
  auto_renew: boolean;
}

export interface SubscriptionsResponse {
  subscriptions: UserSubscription[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  total_revenue: number;
}

export interface BroadcastResponse {
  task_id: string;
  target_count: number;
  status: string;
}

// Context Debug Types
export interface ContextClusterMessage {
  id: string;
  content: string;
  role: string;
  user: string;
  created_at?: string;
}

export interface ContextClusterInfo {
  cluster_id: number;
  size: number;
  confidence: number;
  is_dominant: boolean;
  is_active: boolean;
  messages: ContextClusterMessage[];
}

export interface ContextDebugResponse {
  chat_id: number;
  total_messages: number;
  clustering_applied: boolean;
  clustering_reason: string;
  active_cluster?: ContextClusterInfo;
  all_clusters: ContextClusterInfo[];
  unclustered_count: number;
  rolling_summary?: string;
  recent_context: string;
  dynamic_context_quality?: string;
}

export interface TopChatLLMStats {
  chat_id: number;
  title?: string;
  username?: string;
  first_name?: string;
  calls_count: number;
  tokens_total: number;
  cost_total: number;
}

export interface TopChatsLLMResponse {
  period: string;
  chats: TopChatLLMStats[];
}

export interface CustomLLMProvider {
  id: number;
  name: string;
  base_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomLLMProviderCreate {
  name: string;
  base_url: string;
  api_key: string;
  is_active?: boolean;
}

export interface CustomLLMProviderUpdate {
  name?: string;
  base_url?: string;
  api_key?: string;
  is_active?: boolean;
}

// ============ API Functions ============

export const ownerApi = {
  // Статистика
  getStats: () => apiClient.get<BotStats>('/owner/stats'),
  
  getLLMUsage: (period: '24h' | '7d' | '30d' | 'all' = '24h') => 
    apiClient.get<LLMUsageResponse>(`/owner/llm-usage?period=${period}`),
    
  getTopLLMChats: (limit: number = 5, period: '24h' | '7d' | '30d' | 'all' = '7d') =>
    apiClient.get<TopChatsLLMResponse>(`/owner/stats/top-llm-chats?limit=${limit}&period=${period}`),
  
  // Логи
  getLogs: (params: {
    page?: number;
    limit?: number;
    level?: string;
    source?: string;
    chat_id?: number;
    user_id?: number;
    search?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.level) searchParams.set('level', params.level);
    if (params.source) searchParams.set('source', params.source);
    if (params.chat_id) searchParams.set('chat_id', String(params.chat_id));
    if (params.user_id) searchParams.set('user_id', String(params.user_id));
    if (params.search) searchParams.set('search', params.search);
    
    return apiClient.get<LogsResponse>(`/owner/logs?${searchParams.toString()}`);
  },
  
  // Чаты
  getChats: (params: {
    page?: number;
    limit?: number;
    search?: string;
    active_only?: boolean;
    chat_type?: 'private' | 'group' | 'all';
  } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.active_only) searchParams.set('active_only', 'true');
    if (params.chat_type && params.chat_type !== 'all') searchParams.set('chat_type', params.chat_type);
    
    return apiClient.get<BotChatsResponse>(`/owner/chats?${searchParams.toString()}`);
  },
  
  leaveChat: (telegram_chat_id: number, notify = true, message?: string) =>
    apiClient.post<{ success: boolean }>('/owner/chats/leave', {
      telegram_chat_id,
      notify,
      message,
    }),
  
  // Детальная информация о чате
  getChatDetails: (telegram_chat_id: number) =>
    apiClient.get<ChatDetailedResponse>(`/owner/chats/${telegram_chat_id}`),
  
  // Отладка контекста чата
  getChatContextDebug: (telegram_chat_id: number) =>
    apiClient.get<ContextDebugResponse>(`/owner/chats/${telegram_chat_id}/context`),
  
  updateChatSettings: (telegram_chat_id: number, settings: Partial<ChatSettings>) =>
    apiClient.patch<{ success: boolean }>(`/owner/chats/${telegram_chat_id}/settings`, settings),
  
  // Аватарки
  getChatAvatarUrl: (telegram_chat_id: number) => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const token = apiClient.getAccessToken();
    return `${apiUrl}/owner/chats/${telegram_chat_id}/avatar${token ? `?token=${token}` : ''}`;
  },
  
  getUserAvatarUrl: (telegram_user_id: number) => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const token = apiClient.getAccessToken();
    return `${apiUrl}/owner/users/${telegram_user_id}/avatar${token ? `?token=${token}` : ''}`;
  },
  
  // Глобальные баны
  getBans: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    
    return apiClient.get<GlobalBansResponse>(`/owner/bans?${searchParams.toString()}`);
  },
  
  createBan: (data: {
    telegram_user_id: number;
    reason: GlobalBan['reason'];
    reason_text?: string;
    duration_days?: number;
  }) => apiClient.post<GlobalBan>('/owner/bans', data),
  
  removeBan: (telegram_user_id: number) =>
    apiClient.delete<{ success: boolean }>(`/owner/bans/${telegram_user_id}`),
  
  checkBan: (telegram_user_id: number) =>
    apiClient.get<{ is_banned: boolean; ban_info?: GlobalBan }>(`/owner/bans/check/${telegram_user_id}`),
  
  // Подписки
  getSubscriptions: (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.status) searchParams.set('status', params.status);
    if (params.search) searchParams.set('search', params.search);
    
    return apiClient.get<SubscriptionsResponse>(`/owner/subscriptions?${searchParams.toString()}`);
  },
  
  createSubscription: (data: {
    telegram_user_id: number;
    plan_id: string;
    duration_days?: number;
    auto_renew?: boolean;
  }) => apiClient.post<UserSubscription>('/owner/subscriptions', data),
  
  updateSubscription: (id: number, data: {
    plan_id?: string;
    expires_at?: string;
    status?: string;
    auto_renew?: boolean;
  }) => apiClient.patch<{ success: boolean }>(`/owner/subscriptions/${id}`, data),
  
  // Рассылка
  sendBroadcast: (data: {
    message: string;
    target?: 'all' | 'subscribers' | 'chat_admins';
    chat_ids?: number[];
    user_ids?: number[];
    parse_mode?: string;
  }) => apiClient.post<BroadcastResponse>('/owner/broadcast', data),

  getLLMPriority: () => apiClient.get<LLMChainsResponse>('/owner/llm-priority'),
  updateLLMPriority: (data: Partial<LLMChainsResponse>) =>
    apiClient.patch<{ success: boolean }>('/owner/llm-priority', data),
  llmTest: (data: { provider: string; model: string; with_tools?: boolean }) =>
    apiClient.post<{ success: boolean; latency_ms?: number; error?: string }>('/owner/llm-test', data),

  // Custom Providers
  getCustomProviders: () => apiClient.get<CustomLLMProvider[]>('/owner/llm/providers'),

  createCustomProvider: (data: CustomLLMProviderCreate) => 
    apiClient.post<CustomLLMProvider>('/owner/llm/providers', data),

  updateCustomProvider: (id: number, data: CustomLLMProviderUpdate) =>
    apiClient.patch<boolean>(`/owner/llm/providers/${id}`, data),

  deleteCustomProvider: (id: number) =>
    apiClient.delete<boolean>(`/owner/llm/providers/${id}`),
};

// ============ WebSocket для логов ============

export class LogsWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onMessage: ((log: OwnerLogEntry) => void) | null = null;
  private onStatusChange: ((connected: boolean) => void) | null = null;
  
  connect(token: string) {
    // Определяем URL для WebSocket
    const apiUrl = import.meta.env.VITE_API_URL || '';
    let wsUrl: string;
    
    if (apiUrl.startsWith('http://')) {
      wsUrl = apiUrl.replace('http://', 'ws://');
    } else if (apiUrl.startsWith('https://')) {
      wsUrl = apiUrl.replace('https://', 'wss://');
    } else {
      // Относительный путь - используем текущий хост
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}`;
    }
    
    // Убираем /v1 если есть, т.к. WebSocket endpoint уже включает его
    wsUrl = wsUrl.replace(/\/v1$/, '');
    
    const fullUrl = `${wsUrl}/v1/owner/logs/ws?token=${token}`;
    console.log('Connecting to WebSocket:', fullUrl);
    
    try {
      this.ws = new WebSocket(fullUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.onStatusChange?.(true);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'log' && this.onMessage) {
            this.onMessage(data as OwnerLogEntry);
          } else if (data.type === 'connected') {
            console.log('WebSocket: ', data.message);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.onStatusChange?.(false);
        if (event.code !== 4001 && event.code !== 4003) {
          this.tryReconnect(token);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      this.onStatusChange?.(false);
    }
  }
  
  private tryReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(token), delay);
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  setOnMessage(callback: (log: OwnerLogEntry) => void) {
    this.onMessage = callback;
  }
  
  setOnStatusChange(callback: (connected: boolean) => void) {
    this.onStatusChange = callback;
  }
  
  sendPing() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
    }
  }
}

export const logsWebSocket = new LogsWebSocket();
