import { apiClient } from './client';
import type { AuthInitResponse, AuthStatusResponse, AuthTokensResponse } from './types';

export const authApi = {
  /**
   * Инициализация авторизации - получение auth_token для QR/deeplink
   */
  init: () => 
    apiClient.post<AuthInitResponse>('/auth/init', undefined, false),

  /**
   * Проверка статуса авторизации по auth_token
   */
  status: (authToken: string) =>
    apiClient.get<AuthStatusResponse>(`/auth/status/${authToken}`, false),

  /**
   * Подтверждение авторизации (вызывается ботом)
   */
  confirm: (authToken: string, userId: number, botSecret: string) =>
    apiClient.request<AuthTokensResponse>('POST', `/auth/confirm/${authToken}?user_id=${userId}`, {
      headers: { 'X-Bot-Secret': botSecret },
      auth: false,
    }),

  /**
   * Обновление access_token через refresh_token
   */
  refresh: (refreshToken: string) =>
    apiClient.post<AuthTokensResponse>('/auth/refresh', { refresh_token: refreshToken }, false),

  /**
   * Выход из системы
   */
  logout: () => {
    const result = apiClient.post('/auth/logout');
    apiClient.clearTokens();
    return result;
  },
};
