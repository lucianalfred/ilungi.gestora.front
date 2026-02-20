// src/context/AppContext.tsx
import React, { createContext, useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, Task, Notification, SystemActivity, 
  UserRole, TaskStatus 
} from '../types';
import { apiAuth, apiTasks, apiAdminTasks, apiUsers, apiAdminUsers, apiComments } from '../services/apiService';
import { setAuthToken as setGlobalAuthToken } from '../services/apiService';
import { getSmartNotification } from '../services/geminiService';
import { logger } from '../services/logger';
import { mapUserFromAPI, mapTaskFromAPI, mapCommentFromAPI } from '../services/apiService';
import { StatusOrder } from '../constants/index';

// ============================================
// TIPO DO CONTEXTO
// ============================================
interface AppContextType {
  // State
  user: User | null;
  setUser: (user: User | null) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  systemActivities: SystemActivity[];
  setSystemActivities: (activities: SystemActivity[]) => void;
  view: string;
  setView: (view: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: string;
  setLang: (lang: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Auth
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  validateSetupToken: (token: string) => Promise<any>;
  setupPassword: (token: string, password: string, confirmPassword: string) => Promise<any>;
  validateResetToken: (token: string) => Promise<any>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<any>;
  
  // Tasks
  createTask: (taskData: any) => Promise<void>;
  updateTask: (taskId: string, taskData: any) => Promise<void>;
  deleteTask: (task: Task) => Promise<void>;
  handleAdvanceStatus: (task: Task) => Promise<void>;
  handleRegressStatus: (task: Task) => Promise<void>;
  handleDeleteTask: (task: Task) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  filterTasks: (filters: { search?: string; status?: string }) => void;
  filteredTasks: Task[];
  
  // Users
  loadUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (userId: string, userData: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Notifications
  addNotification: (userId: string, message: string, type?: 'info' | 'success' | 'error') => Promise<void>;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (notificationId: string) => void;
  
  // Activities
  addSystemActivity: (activity: Omit<SystemActivity, 'id' | 'timestamp'>) => void;
  
  // Data
  loadDataFromAPI: (currentUser?: User | null) => Promise<void>;
  
  // Utils
  getAvatarUrl: (u: User) => string | null;
  saveAvatar: (userId: string, dataUrl: string) => void;
  openAvatarUpload: (userId: string) => void;
}

// ============================================
// CHAVES PARA REACT QUERY
// ============================================
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: any) => [...taskKeys.lists(), filters] as const,
};

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
};

// ============================================
// FUNÇÕES AUXILIARES PARA STATUS
// ============================================
const statusFlow: TaskStatus[] = [
  TaskStatus.PENDENTE,
  TaskStatus.EM_PROGRESSO,
  TaskStatus.TERMINADO,
  TaskStatus.FECHADO
];

const getNextStatus = (currentStatus: TaskStatus | string): string => {
  const index = statusFlow.indexOf(currentStatus as TaskStatus);
  if (index === -1 || index === statusFlow.length - 1) return currentStatus as string;
  return statusFlow[index + 1];
};

const getPreviousStatus = (currentStatus: TaskStatus | string): string => {
  const index = statusFlow.indexOf(currentStatus as TaskStatus);
  if (index <= 0) return currentStatus as string;
  return statusFlow[index - 1];
};

// ============================================
// CRIAÇÃO DO CONTEXTO
// ============================================
export const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  
  // ============ STATE DECLARATIONS ============
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [view, setView] = useState<'landing' | 'login' | 'app' | 'set-password' | 'reset-password'>('login');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemActivities, setSystemActivities] = useState<SystemActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [uploadingAvatarFor, setUploadingAvatarFor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const lastNotificationRef = useRef<Map<string, number>>(new Map());

  // ============ REACT QUERY HOOKS ============
  
  // Query para buscar tasks automaticamente
  const { data: queryTasks = [], refetch: refetchTasks } = useQuery({
    queryKey: taskKeys.list({}),
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const isAdmin = user?.role === UserRole.ADMIN;
        const response = isAdmin 
          ? await apiAdminTasks.getAll()
          : await apiTasks.getMyTasks();
        
        const tasksList = Array.isArray(response) 
          ? response 
          : (response.data || response.tasks || []);
        
        return tasksList.map((t: any) => mapTaskFromAPI(t));
      } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        return [];
      }
    },
    // ATUALIZAÇÃO AUTOMÁTICA - chave para o que você quer
    refetchInterval: 1000, // Atualiza a cada 30 segundos
    staleTime: 1000, // 10 segundos
    enabled: !!user, // Só executa se tiver usuário logado
  });

  // Query para buscar usuários automaticamente
  const { data: queryUsers = [], refetch: refetchUsers } = useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      if (!user || user.role !== UserRole.ADMIN) return [];
      
      try {
        const response = await apiAdminUsers.getAll();
        const usersList = Array.isArray(response) ? response : (response.data || response.users || []);
        return usersList.map((u: any) => mapUserFromAPI(u));
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
      }
    },
    enabled: user?.role === UserRole.ADMIN,
    refetchInterval: 60000, // Atualiza a cada minuto
  });

  // Mutation para avançar status
  const advanceMutation = useMutation({
    mutationFn: async (task: Task) => {
      const nextStatus = getNextStatus(task.status);
      return apiTasks.updateStatus(task.id, nextStatus);
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      queryClient.setQueryData(taskKeys.lists(), (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((t: Task) => 
          t.id === task.id 
            ? { ...t, status: getNextStatus(t.status) }
            : t
        );
      });

      return { previousTasks };
    },
    onError: (err, task, context) => {
      queryClient.setQueryData(taskKeys.lists(), context?.previousTasks);
      addNotification(user!.id, 'Erro ao avançar status', 'error');
    },
    onSuccess: (data, task) => {
      addNotification(user!.id, `Tarefa avançada com sucesso`, 'success');
      addSystemActivity({
        userId: user!.id,
        userName: user!.name,
        action: 'status_changed',
        entityType: 'task',
        entityId: task.id,
        entityTitle: task.title,
        fromStatus: task.status,
        toStatus: getNextStatus(task.status)
      });
    },
  });

  // Mutation para recuar status
  const regressMutation = useMutation({
    mutationFn: async (task: Task) => {
      const prevStatus = getPreviousStatus(task.status);
      return apiTasks.updateStatus(task.id, prevStatus);
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      queryClient.setQueryData(taskKeys.lists(), (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((t: Task) => 
          t.id === task.id 
            ? { ...t, status: getPreviousStatus(t.status) }
            : t
        );
      });

      return { previousTasks };
    },
    onError: (err, task, context) => {
      queryClient.setQueryData(taskKeys.lists(), context?.previousTasks);
      addNotification(user!.id, 'Erro ao recuar status', 'error');
    },
    onSuccess: (data, task) => {
      addNotification(user!.id, `Tarefa recuada com sucesso`, 'info');
    },
  });

  // Mutation para deletar task
  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => apiTasks.delete(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      queryClient.setQueryData(taskKeys.lists(), (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.filter((t: Task) => t.id !== taskId);
      });

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(taskKeys.lists(), context?.previousTasks);
      addNotification(user!.id, 'Erro ao deletar tarefa', 'error');
    },
    onSuccess: (data, taskId) => {
      addNotification(user!.id, 'Tarefa deletada com sucesso', 'success');
    },
  });

  // Mutation para adicionar comentário
  const commentMutation = useMutation({
    mutationFn: ({ taskId, text }: { taskId: string; text: string }) => 
      apiComments.create(taskId, text),
    onSuccess: async (response, { taskId, text }) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      addNotification(user!.id, 'Comentário adicionado', 'success');
    },
  });

  // Sincroniza o estado do contexto com o React Query
  useEffect(() => {
    if (queryTasks.length > 0) {
      setTasks(queryTasks);
    }
  }, [queryTasks]);

  useEffect(() => {
    if (queryUsers.length > 0) {
      setUsers(queryUsers);
    }
  }, [queryUsers]);

  // ============ FILTERED TASKS ============
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (searchQuery) {
      result = result.filter(tk => 
        tk.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(tk => tk.status === statusFilter);
    }
    if (user?.role === UserRole.EMPLOYEE) {
      result = result.filter(tk => 
        tk.responsibleId === user.id || tk.intervenientes?.includes(user.id)
      );
    }
    return result;
  }, [tasks, searchQuery, statusFilter, user]);

  // ============ FILTER TASKS ============
  const filterTasks = (filters: { search?: string; status?: string }) => {
    if (filters.search !== undefined) setSearchQuery(filters.search);
    if (filters.status !== undefined) setStatusFilter(filters.status);
  };

  // ============ AUTH METHODS ============
  const login = async (email: string, password: string, rememberMe?: boolean) => {
    console.log('🔐 [AppContext] Iniciando login para:', email);
    
    setIsLoading(true);
    try {
      const apiResponse = await apiAuth.login(email, password);
      console.log('📥 [AppContext] Resposta da API:', apiResponse);
      
      const token = apiResponse.token || apiResponse.jwt;
      if (!token) {
        throw new Error('Resposta de login sem token.');
      }

      setGlobalAuthToken(token);
      if (rememberMe) {
        localStorage.setItem('gestora_remember_email', email);
      }
      
      const apiUser = apiResponse.user || apiResponse;
      const normalizedUser = {
        ...apiUser,
        id: apiUser?.id ?? apiUser?.userId,
        email: apiUser?.email ?? email,
        name: apiUser?.name ?? apiUser?.username,
        role: apiUser?.role ?? UserRole.EMPLOYEE
      };
      
      const mappedUser = mapUserFromAPI(normalizedUser);
      console.log('👤 [AppContext] Usuário mapeado:', mappedUser);
      
      setUser(mappedUser);
      
      // Força o recarregamento das queries
      await refetchTasks();
      if (mappedUser.role === UserRole.ADMIN) {
        await refetchUsers();
      }
      
      if (mappedUser.mustChangePassword) {
        setView('app');
        setActiveTab('profile');
      } else {
        setView('app');
      }
      
      console.log('✅ [AppContext] Login concluído com sucesso');
      
    } catch (error: any) {
      console.error('❌ [AppContext] Erro no login:', error);
      setGlobalAuthToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 [AppContext] Fazendo logout');
    setGlobalAuthToken(null);
    setUser(null);
    setTasks([]);
    setUsers([]);
    setSystemActivities([]);
    setNotifications([]);
    setView('login');
    setActiveTab('dashboard');
    localStorage.removeItem('gestora_remember_email');
    
    // Limpa o cache do React Query
    queryClient.clear();
  };

  const register = async (email: string, name: string, password: string) => {
    console.log('📝 [AppContext] Registrando:', email);
    setIsLoading(true);
    try {
      const response = await apiAuth.register(email, name, password);
      console.log('✅ [AppContext] Registro bem-sucedido:', response);
      
      // Auto login após 2 segundos
      setTimeout(async () => {
        try {
          await login(email, password);
        } catch (loginError) {
          console.error('Auto-login after registration failed:', loginError);
        }
      }, 2000);
      
      return response;
    } catch (error: any) {
      console.error('❌ [AppContext] Erro no registro:', error);
      throw new Error(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateSetupToken = async (token: string) => {
    try {
      const data = await apiAuth.validateSetupToken(token);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao validar token.');
    }
  };

  const setupPassword = async (token: string, password: string, confirmPassword: string) => {
    try {
      const data = await apiAuth.setupPassword(token, password, confirmPassword);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao definir senha.');
    }
  };

  const validateResetToken = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/validate-token/${token}`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao validar token.');
    }
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch('http://localhost:8080/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao redefinir senha.');
    }
  };

  // ============ TASK METHODS ============
  const createTask = async (taskData: any) => {
    console.log('📋 [AppContext] Criando tarefa:', taskData);
    try {
      const numericIds = taskData.responsibles.map((id: string) => Number(id));
      const payload = { 
        title: taskData.title, 
        description: taskData.description, 
        daysToFinish: taskData.daysToFinish,
        status: 'PENDENTE',
        responsibles: numericIds
      };
      
      const apiResponse = await apiAdminTasks.createWithResponsibles(payload);
      
      if (!apiResponse || !apiResponse.task) {
        throw new Error('Resposta inválida da API.');
      }
      
      // Força o recarregamento das tasks
      await refetchTasks();
      
      addSystemActivity({ 
        userId: user!.id, 
        userName: user!.name, 
        action: 'created', 
        entityType: 'task', 
        entityId: apiResponse.task.id, 
        entityTitle: taskData.title 
      });
      
      addNotification(user!.id, 'Tarefa criada com sucesso.', 'success');
      
    } catch (error) {
      logger.error('Task', 'Erro ao criar tarefa na API', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, taskData: any) => {
    console.log('✏️ [AppContext] Atualizando tarefa:', taskId, taskData);
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId)!;
      const apiResponse = await apiTasks.update(taskId, { ...taskToUpdate, ...taskData });
      
      // Força o recarregamento das tasks
      await refetchTasks();
      
      addNotification(user!.id, 'Tarefa atualizada com sucesso.', 'success');
      
      addSystemActivity({ 
        userId: user!.id, 
        userName: user!.name, 
        action: 'updated', 
        entityType: 'task', 
        entityId: taskId, 
        entityTitle: taskData.title 
      });
      
    } catch (error) {
      logger.warn('Task', 'Erro ao atualizar na API', error);
      throw error;
    }
  };

  const deleteTask = async (task: Task) => {
    console.log('🗑️ [AppContext] Deletando tarefa:', task.id);
    try {
      await apiTasks.delete(task.id);
      
      // Força o recarregamento das tasks
      await refetchTasks();
      
      addSystemActivity({ 
        userId: user!.id, 
        userName: user!.name, 
        action: 'deleted', 
        entityType: 'task', 
        entityId: task.id, 
        entityTitle: task.title 
      });
      
      addNotification(user!.id, `Tarefa "${task.title}" eliminada com sucesso.`, 'success');
      
    } catch (apiError) {
      logger.warn('Task', 'Erro ao deletar na API', apiError);
      addNotification(user!.id, 'Não foi possível eliminar a tarefa na API.', 'error');
      throw apiError;
    }
  };

  // ============ STATUS HANDLERS (USANDO REACT QUERY) ============
  const handleAdvanceStatus = async (task: Task) => {
    console.log('🔄 handleAdvanceStatus chamado:', {
      taskId: task.id,
      currentStatus: task.status,
      userRole: user?.role,
    });

    // Verificar permissões
    const isTaskMember = task.responsibleId === user?.id || task.intervenientes?.includes(user?.id as string);
    
    if (user?.role === UserRole.EMPLOYEE && !isTaskMember) {
      addNotification(user!.id, 'Você não é membro desta tarefa.', 'error');
      return;
    }
    
    if (task.status === TaskStatus.TERMINADO && user?.role !== UserRole.ADMIN) {
      addNotification(user!.id, 'Apenas administradores podem avançar tarefas finalizadas.', 'error');
      return;
    }

    advanceMutation.mutate(task);
  };

  const handleRegressStatus = async (task: Task) => {
    console.log('🔙 handleRegressStatus chamado:', {
      taskId: task.id,
      currentStatus: task.status,
      userRole: user?.role
    });

    // Verificar permissões
    const isTaskMember = task.responsibleId === user?.id || task.intervenientes?.includes(user?.id as string);
    
    if (user?.role === UserRole.EMPLOYEE && !isTaskMember) {
      addNotification(user!.id, 'Você não tem permissão para recuar esta tarefa.', 'error');
      return;
    }

    if (task.status === TaskStatus.TERMINADO && user?.role !== UserRole.ADMIN) {
      addNotification(user!.id, 'Apenas administradores podem recuar tarefas finalizadas.', 'error');
      return;
    }

    regressMutation.mutate(task);
  };

  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`Deseja eliminar a tarefa "${task.title}"?`)) return;
    deleteMutation.mutate(task.id);
  };

  const addComment = async (taskId: string, text: string) => {
    if (!user) return;
    console.log('💬 [AppContext] Adicionando comentário:', { taskId, text });
    commentMutation.mutate({ taskId, text });
  };

  // ============ USER METHODS ============
  const loadUsers = async () => {
    if (user?.role === UserRole.ADMIN) {
      await refetchUsers();
    }
  };

  const createUser = async (userData: any) => {
    console.log('👤 [AppContext] Criando usuário:', userData);
    try {
      const apiResponse = await apiAdminUsers.create({
        name: userData.name,
        email: userData.email,
        role: userData.role === UserRole.ADMIN ? 'ADMIN' : 'USER',
        phone: userData.phone || ''
      });

      // Força o recarregamento dos usuários
      await refetchUsers();
      
      users.filter(u => u.role === UserRole.ADMIN).forEach(u => {
        addNotification(u.id, `Novo utilizador criado: ${userData.name} (${userData.email})`, 'info');
      });
      
      addNotification(user!.id, `Utilizador ${userData.name} criado com sucesso.`, 'success');
      
    } catch (error: any) {
      if (error.message?.includes('409') || error.message?.includes('Conflict') || 
          error.message?.toLowerCase().includes('email') || error.message?.toLowerCase().includes('duplicate')) {
        throw new Error('Este email já está cadastrado no sistema. Use um email diferente.');
      }
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: any) => {
    console.log('✏️ [AppContext] Atualizando usuário:', userId, userData);
    try {
      await apiUsers.update(userId, userData);
      
      // Força o recarregamento dos usuários
      await refetchUsers();
      
      users.filter(u => u.role === UserRole.ADMIN).forEach(u => {
        addNotification(u.id, `Utilizador atualizado: ${userData.name} (${userData.email})`, 'info');
      });
      
      addNotification(user!.id, `Utilizador ${userData.name} atualizado com sucesso.`, 'success');
      
    } catch (error) {
      logger.warn('User', 'Erro ao atualizar na API', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;
    
    if (!window.confirm(`Tem certeza que deseja eliminar o utilizador "${userToDelete.name}"?`)) {
      return;
    }
    
    console.log('🗑️ [AppContext] Deletando usuário:', userId);
    try {
      await apiAdminUsers.delete(userId);
      
      // Força o recarregamento dos usuários
      await refetchUsers();
      
      addNotification(user!.id, `Utilizador ${userToDelete.name} eliminado com sucesso.`, 'success');
      
    } catch (apiError) {
      logger.warn('User', 'Erro ao eliminar na API', apiError);
      addNotification(user!.id, `Não foi possível eliminar ${userToDelete.name} na API.`, 'error');
      throw apiError;
    }
  };

  // ============ NOTIFICATION METHODS ============
  const addNotification = async (userId: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const now = Date.now();
    const key = `${userId}|${type}|${message}`;
    const lastAt = lastNotificationRef.current.get(key) || 0;
    
    if (now - lastAt < 5000) return;
    lastNotificationRef.current.set(key, now);
    
    const n: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications(prev => {
      const exists = prev.some(p => 
        p.userId === userId && 
        p.message === message && 
        p.type === type && 
        Math.abs(new Date(p.timestamp).getTime() - now) < 10000
      );
      if (exists) return prev;
      return [n, ...prev];
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(n => n.userId === user?.id ? { ...n, read: true } : n)
    );
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // ============ ACTIVITY METHODS ============
  const addSystemActivity = (a: Omit<SystemActivity, 'id' | 'timestamp'>) => {
    const full: SystemActivity = { 
      ...a, 
      id: 'A-' + Math.random().toString(36).substr(2, 9), 
      timestamp: new Date().toISOString() 
    };
    
    setSystemActivities(prev => {
      const exists = prev.some(p => 
        p.userId === full.userId && 
        p.action === full.action && 
        p.entityId === full.entityId && 
        p.fromStatus === full.fromStatus && 
        p.toStatus === full.toStatus
      );
      if (exists) return prev;
      
      const next = [full, ...prev].slice(0, 200);
      localStorage.setItem('gestora_activities', JSON.stringify(next));
      return next;
    });

    const message = (() => {
      if (a.action === 'created') return `Criou tarefa: ${a.entityTitle || a.entityId}`;
      if (a.action === 'updated') return `Atualizou tarefa: ${a.entityTitle || a.entityId}`;
      if (a.action === 'deleted') return `Eliminou tarefa: ${a.entityTitle || a.entityId}`;
      if (a.action === 'status_changed') return `Mudou estado: ${a.entityTitle || a.entityId} (${a.fromStatus} → ${a.toStatus})`;
      if (a.action === 'commented') return `Comentou na tarefa: ${a.entityTitle || a.entityId}`;
      return `Atividade: ${a.entityTitle || a.entityId}`;
    })();
    
    users.filter(u => u.role === UserRole.ADMIN).forEach(u => {
      addNotification(u.id, message, 'info');
    });
  };

  // ============ DATA LOADING ============
  const loadDataFromAPI = async (currentUser?: User | null) => {
    const activeUser = currentUser ?? user;
    if (!activeUser) return;
    
    try {
      await refetchTasks();
      if (activeUser.role === UserRole.ADMIN) {
        await refetchUsers();
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // ============ AVATAR METHODS ============
  const getAvatarUrl = (u: User) => {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(`gestora_avatar_${u.id}`);
  };
  
  const saveAvatar = (userId: string, dataUrl: string) => {
    localStorage.setItem(`gestora_avatar_${userId}`, dataUrl);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, avatar: dataUrl } : u));
  };

  const openAvatarUpload = (userId: string) => {
    setUploadingAvatarFor(userId);
    setTimeout(() => avatarInputRef.current?.click(), 0);
  };

  // ============ EFFECTS ============
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('gestora_api_token');
    if (savedToken) {
      setGlobalAuthToken(savedToken);
      
      (async () => {
        try {
          const apiUser = await apiAuth.getCurrentUser();
          if (!apiUser) {
            setGlobalAuthToken(null);
            setUser(null);
            setView('login');
            return;
          }
          
          const normalizedUser = {
            ...apiUser,
            id: apiUser?.id ?? apiUser?.userId,
            email: apiUser?.email,
            name: apiUser?.name ?? apiUser?.username,
            role: apiUser?.role ?? UserRole.EMPLOYEE
          };
          
          const mapped = mapUserFromAPI(normalizedUser);
          setUser(mapped);
          await loadDataFromAPI(mapped);
          
          if (mapped.mustChangePassword) {
            setView('app');
            setActiveTab('profile');
          } else {
            setView('app');
          }
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          setGlobalAuthToken(null);
          setUser(null);
          setView('login');
        }
      })();
    } else {
      setUser(null);
      setView('login');
    }
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const contextValue: AppContextType = {
    // State
    user,
    setUser,
    tasks,
    setTasks,
    users,
    setUsers,
    notifications,
    setNotifications,
    systemActivities,
    setSystemActivities,
    view,
    setView,
    activeTab,
    setActiveTab,
    lang,
    setLang,
    theme,
    setTheme,
    isLoading,
    setIsLoading,
    
    // Auth
    login,
    logout,
    register,
    validateSetupToken,
    setupPassword,
    validateResetToken,
    resetPassword,
    
    // Tasks (usando as mutations do React Query)
    createTask,
    updateTask,
    deleteTask,
    handleAdvanceStatus,
    handleRegressStatus,
    handleDeleteTask,
    addComment,
    filterTasks,
    filteredTasks,
    
    // Users
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    
    // Notifications
    addNotification,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    
    // Activities
    addSystemActivity,
    
    // Data
    loadDataFromAPI,
    
    // Utils
    getAvatarUrl,
    saveAvatar,
    openAvatarUpload
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <input 
        ref={avatarInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && uploadingAvatarFor) { 
            const reader = new FileReader(); 
            reader.onload = () => { 
              saveAvatar(uploadingAvatarFor, reader.result as string); 
              setUploadingAvatarFor(null); 
            }; 
            reader.readAsDataURL(f); 
          }
          e.target.value = '';
        }} 
      />
    </AppContext.Provider>
  );
};