import { apiClient } from './client';
import type { Notification, PaginatedResponse, PaginationParams } from './types';

export const notificationsApi = {
  /**
   * Получить список уведомлений
   */
  list: (params?: PaginationParams & { unread?: boolean; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.unread !== undefined) query.set('unread', String(params.unread));
    if (params?.type) query.set('type', params.type);
    const qs = query.toString();
    return apiClient.get<PaginatedResponse<Notification>>(`/notifications${qs ? `?${qs}` : ''}`);
  },

  /**
   * Отметить уведомление как прочитанное
   */
  markRead: (id: string) => apiClient.post(`/notifications/${id}/read`),

  /**
   * Отметить все уведомления как прочитанные
   */
  markAllRead: () => apiClient.post('/notifications/read-all'),
};
