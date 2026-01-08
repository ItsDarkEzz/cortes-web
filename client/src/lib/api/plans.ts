import { apiClient } from './client';
import type { Plan } from './types';

export const plansApi = {
  /**
   * Получить список доступных планов (публичный эндпоинт)
   */
  list: () => apiClient.get<Plan[]>('/plans', false),
};
