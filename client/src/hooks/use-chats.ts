import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatsApi } from '@/lib/api';
import type { ChatSettings, PaginationParams } from '@/lib/api';

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsApi.list(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useChat(chatId: string | undefined) {
  return useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => chatsApi.get(chatId!),
    enabled: !!chatId,
    staleTime: 30 * 1000,
  });
}

export function useUpdateChat(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; description?: string; rules?: string }) => 
      chatsApi.update(chatId, data),
    onSuccess: (_result, variables) => {
      // Обновляем кэш с новыми данными
      queryClient.setQueryData(['chats', chatId], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, ...variables };
      });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

export function useChatSettings(chatId: string | undefined) {
  return useQuery({
    queryKey: ['chats', chatId, 'settings'],
    queryFn: () => chatsApi.settings.get(chatId!),
    enabled: !!chatId,
    staleTime: 60 * 1000,
  });
}

export function useUpdateChatSettings(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<ChatSettings>) => 
      chatsApi.settings.update(chatId, settings),
    onSuccess: (settings) => {
      queryClient.setQueryData(['chats', chatId, 'settings'], settings);
    },
  });
}


export function useChatMembers(
  chatId: string | undefined,
  params?: PaginationParams & { search?: string; role?: string }
) {
  return useQuery({
    queryKey: ['chats', chatId, 'members', params],
    queryFn: () => chatsApi.members.list(chatId!, params),
    enabled: !!chatId,
    staleTime: 30 * 1000,
  });
}

export function useUpdateMemberRole(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      chatsApi.members.updateRole(chatId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'members'] });
    },
  });
}

export function useRemoveWarning(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) =>
      chatsApi.members.removeWarning(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'members'] });
    },
  });
}

export function useChatLogs(
  chatId: string | undefined,
  params?: PaginationParams & { type?: string; from_date?: string; to_date?: string }
) {
  return useQuery({
    queryKey: ['chats', chatId, 'logs', params],
    queryFn: () => chatsApi.logs.list(chatId!, params),
    enabled: !!chatId,
    staleTime: 30 * 1000,
  });
}

export function useChatMessages(
  chatId: string | undefined,
  params?: PaginationParams & { deleted?: boolean; user_id?: number }
) {
  return useQuery({
    queryKey: ['chats', chatId, 'messages', params],
    queryFn: () => chatsApi.messages.list(chatId!, params),
    enabled: !!chatId,
    staleTime: 30 * 1000,
  });
}

export function useChatSettingsLogs(
  chatId: string | undefined,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: ['chats', chatId, 'settings-logs', params],
    queryFn: () => chatsApi.settingsLogs.list(chatId!, params),
    enabled: !!chatId,
    staleTime: 30 * 1000,
  });
}

export function useChatBrain(chatId: string | undefined) {
  return useQuery({
    queryKey: ['chats', chatId, 'brain'],
    queryFn: () => chatsApi.brain.get(chatId!),
    enabled: !!chatId,
    staleTime: 60 * 1000,
  });
}

export function useUpdateChatBrain(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instructions: string) => 
      chatsApi.brain.updateInstructions(chatId, instructions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'brain'] });
    },
  });
}

export function useChatPlan(chatId: string | undefined) {
  return useQuery({
    queryKey: ['chats', chatId, 'plan'],
    queryFn: () => chatsApi.plan.get(chatId!),
    enabled: !!chatId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============== Opinions ==============

export function useChatOpinions(chatId: string | undefined, includeDefaults: boolean = true) {
  return useQuery({
    queryKey: ['chats', chatId, 'opinions', includeDefaults],
    queryFn: () => chatsApi.opinions.list(chatId!, includeDefaults),
    enabled: !!chatId,
    staleTime: 60 * 1000,
  });
}

export function useCreateOpinion(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { topic: string; stance: string; reasoning: string; strength?: number; can_change?: boolean }) =>
      chatsApi.opinions.create(chatId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'opinions'] });
    },
  });
}

export function useUpdateOpinion(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ opinionId, data }: { opinionId: number; data: { stance?: string; reasoning?: string; strength?: number; can_change?: boolean } }) =>
      chatsApi.opinions.update(chatId, opinionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'opinions'] });
    },
  });
}

export function useDeleteOpinion(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opinionId: number) =>
      chatsApi.opinions.delete(chatId, opinionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'opinions'] });
    },
  });
}
