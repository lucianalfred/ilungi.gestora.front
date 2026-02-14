// src/hooks/useTasksQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiTasks, apiAdminTasks } from '../services/apiService';
import { Task, TaskStatus } from '../types';
import { useState, useEffect } from 'react';

// Chaves para cache
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: any) => [...taskKeys.lists(), filters] as const,
};

export const useTasksQuery = (filters?: { search?: string; status?: string }) => {
  const queryClient = useQueryClient();

  // Query para buscar tasks
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: taskKeys.list(filters || {}),
    queryFn: async () => {
      try {
        // Tenta buscar todas as tasks
        const response = await apiAdminTasks.getAll();
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        return [];
      }
    },
    // Atualiza automaticamente a cada 30 segundos
    refetchInterval: 30000,
  });

  // Mutation para avançar status
  const advanceMutation = useMutation({
    mutationFn: async (task: Task) => {
      const nextStatus = getNextStatus(task.status);
      return apiTasks.updateStatus(task.id, nextStatus);
    },
    onSuccess: () => {
      // Invalida o cache para forçar recarregamento
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Mutation para recuar status
  const regressMutation = useMutation({
    mutationFn: async (task: Task) => {
      const prevStatus = getPreviousStatus(task.status);
      return apiTasks.updateStatus(task.id, prevStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Mutation para deletar task
  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => apiTasks.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Mutation para adicionar comentário
  const commentMutation = useMutation({
    mutationFn: ({ taskId, text }: { taskId: string; text: string }) => 
      apiComments.create(taskId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Filtragem local
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    let filtered = [...tasks];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, filters]);

  return {
    tasks,
    filteredTasks,
    isLoading,
    handleAdvanceStatus: advanceMutation.mutate,
    handleRegressStatus: regressMutation.mutate,
    handleDeleteTask: deleteMutation.mutate,
    addComment: commentMutation.mutate,
    refetch,
  };
};

// Funções auxiliares
const statusFlow: TaskStatus[] = [
  TaskStatus.PENDENTE,
  TaskStatus.EM_PROGRESSO,
  TaskStatus.TERMINADO,
  TaskStatus.FECHADO
];

function getNextStatus(currentStatus: TaskStatus | string): string {
  const index = statusFlow.indexOf(currentStatus as TaskStatus);
  if (index === -1 || index === statusFlow.length - 1) return currentStatus as string;
  return statusFlow[index + 1];
}

function getPreviousStatus(currentStatus: TaskStatus | string): string {
  const index = statusFlow.indexOf(currentStatus as TaskStatus);
  if (index <= 0) return currentStatus as string;
  return statusFlow[index - 1];
}