// src/hooks/useUsersQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiAdminUsers } from '../services/apiService';
import { User } from '../types';
import { mapUserFromAPI } from '../services/apiService';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
};

export const useUsersQuery = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      try {
        const response = await apiAdminUsers.getAll();
        return Array.isArray(response) 
          ? response.map(mapUserFromAPI)
          : [];
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
      }
    },
    refetchInterval: 60000, // Atualiza a cada minuto
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiAdminUsers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => apiAdminUsers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  return {
    users,
    isLoading,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
  };
};