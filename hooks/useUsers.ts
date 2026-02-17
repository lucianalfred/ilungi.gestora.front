import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiAdminUsers, apiUsers, mapUserFromAPI, UserRole } from '../services/apiService';
import { User } from '../types';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const USERS_QUERY_KEY = 'users';

// Converter resposta da API para o formato User
const mapUsersResponse = (data: any): User[] => {
  if (Array.isArray(data)) {
    return data.map(mapUserFromAPI);
  }
  // Se a API retornar { content: [...], totalElements, etc } (paginação)
  if (data?.content && Array.isArray(data.content)) {
    return data.content.map(mapUserFromAPI);
  }
  return [];
};

// Buscar todos os usuários
const fetchUsers = async (): Promise<User[]> => {
  try {
    // Tenta buscar via admin primeiro (mais completo)
    const data = await apiAdminUsers.getAll();
    return mapUsersResponse(data);
  } catch (error) {
    console.error('Erro ao buscar usuários via admin, tentando via users:', error);
    // Fallback para endpoint público
    const data = await apiUsers.getAllSimple();
    return mapUsersResponse(data);
  }
};

// Criar usuário
const createUser = async (userData: Partial<User>): Promise<User> => {
  const data = await apiAdminUsers.create({
    name: userData.name!,
    email: userData.email!,
    phone: userData.phone,
    role: userData.role || UserRole.EMPLOYEE
  });
  return mapUserFromAPI(data);
};

// Atualizar usuário
const updateUser = async ({ id, ...userData }: Partial<User> & { id: string }): Promise<User> => {
  const data = await apiAdminUsers.update(id, {
    name: userData.name,
    phone: userData.phone,
    role: userData.role
  });
  return mapUserFromAPI(data);
};

// Deletar usuário
const deleteUser = async (id: string): Promise<void> => {
  await apiAdminUsers.delete(id);
};

// Atualizar role do usuário
const updateUserRole = async ({ id, role }: { id: string; role: string }): Promise<User> => {
  const data = await apiAdminUsers.changeRole(id, role);
  return mapUserFromAPI(data);
};

export const useUsers = () => {
  const queryClient = useQueryClient();
  
  // ✅ ACESSAR O CONTEXTO PARA OBTER AS FUNÇÕES DE AVATAR
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useUsers must be used within AppProvider');
  }

  // Query principal para buscar todos os usuários
  const { 
    data: users = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutos até considerar dados obsoletos
    gcTime: 1000 * 60 * 10, // 10 minutos no cache
    refetchOnWindowFocus: true, // Atualiza quando a janela ganha foco
    refetchOnMount: true, // Atualiza quando o componente monta
    refetchOnReconnect: true, // Atualiza quando reconecta à internet
    retry: 3,
  });

  // Mutation para criar usuário
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Atualiza o cache adicionando o novo usuário
      queryClient.setQueryData<User[]>([USERS_QUERY_KEY], (old = []) => {
        // Evita duplicatas
        if (old.some(u => u.id === newUser.id)) return old;
        return [...old, newUser];
      });
      
      // Opcional: Invalida para buscar dados frescos do servidor
      // queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
      // Em caso de erro, invalida para garantir consistência
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });

  // Mutation para atualizar usuário
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>([USERS_QUERY_KEY], (old = []) =>
        old.map(user => user.id === updatedUser.id ? updatedUser : user)
      );
    },
    onError: (error, variables) => {
      console.error('Erro ao atualizar usuário:', error);
      // Em caso de erro, invalida para garantir consistência
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });

  // Mutation para deletar usuário
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedUserId) => {
      queryClient.setQueryData<User[]>([USERS_QUERY_KEY], (old = []) =>
        old.filter(user => user.id !== deletedUserId)
      );
    },
    onError: (error) => {
      console.error('Erro ao deletar usuário:', error);
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });

  // Mutation para atualizar role
  const roleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>([USERS_QUERY_KEY], (old = []) =>
        old.map(user => user.id === updatedUser.id ? updatedUser : user)
      );
    },
  });

  // ✅ RETORNAR TUDO: Dados do React Query + Funções do Contexto
  return {
    // Dados do React Query
    users,
    isLoading,
    error,
    refetch,
    
    // CRUD operations do React Query
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    updateUserRole: roleMutation.mutateAsync,
    
    // Loading states do React Query
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdatingRole: roleMutation.isPending,
    
    // Error states do React Query
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    roleError: roleMutation.error,
    
    // ✅ FUNÇÕES DO CONTEXTO (AVATAR)
    user: context.user,
    setUser: context.setUser,
    getAvatarUrl: context.getAvatarUrl,
    saveAvatar: context.saveAvatar,
    openAvatarUpload: context.openAvatarUpload,
    
    // ✅ OUTRAS FUNÇÕES DO CONTEXTO QUE PODEM SER ÚTEIS
    loadUsers: context.loadUsers,
  };
};

// Hook para buscar um único usuário
export const useUser = (userId: string | null) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return null;
      const data = await apiUsers.getById(userId);
      return mapUserFromAPI(data);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook para estatísticas de usuários
export const useUsersStats = () => {
  const { users } = useUsers();
  
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === UserRole.ADMIN).length,
    employees: users.filter(u => u.role === UserRole.EMPLOYEE).length,
  };

  return stats;
};