import { apiClient } from './client';
import type { User, UserStats } from './types';

export const userApi = {
  /**
   * Получить текущего пользователя
   */
  me: () => apiClient.get<User>('/user/me'),

  /**
   * Получить статистику пользователя
   */
  stats: () => apiClient.get<UserStats>('/user/stats'),

  /**
   * Обновить отображаемое имя
   */
  updateName: (displayName: string) =>
    apiClient.patch<User>('/user/profile/name', { display_name: displayName }),
};
