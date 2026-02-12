import React, { createContext, useState, useEffect, useMemo, useRef } from 'react';
import { 
  User, Task, Notification, SystemActivity, 
  UserRole, TaskStatus 
} from '../types';
import { apiAuth, apiTasks, apiAdminTasks, apiUsers, apiAdminUsers, apiComments } from '../services/apiService';
import { setAuthToken as setGlobalAuthToken } from '../services/apiService';
import { getSmartNotification } from '../services/geminiService';
import { logger } from '../services/logger';
import { mapUserFromAPI, mapTaskFromAPI, mapCommentFromAPI } from '../services/apiService';

import { StatusOrder, TRANSLATIONS, STORAGE_KEYS } from '../constants/index';

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
  
  // Activities
  addSystemActivity: (activity: Omit<SystemActivity, 'id' | 'timestamp'>) => void;
  
  // Data
  loadDataFromAPI: (currentUser?: User | null) => Promise<void>;
  
  // Utils
  getAvatarUrl: (u: User) => string | null;
  saveAvatar: (userId: string, dataUrl: string) => void;
  openAvatarUpload: (userId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
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
    setIsLoading(true);
    try {
      const apiResponse = await apiAuth.login(email, password);
      const token = apiResponse.token || apiResponse.jwt;

      if (!token) {
        throw new Error('Resposta de login sem token.');
      }

      setGlobalAuthToken(token);
      
      const apiUser = apiResponse.user || apiResponse;
      const normalizedUser = {
        ...apiUser,
        id: apiUser?.id ?? apiUser?.userId,
        email: apiUser?.email ?? email,
        name: apiUser?.name ?? apiUser?.username,
        role: apiUser?.role ?? UserRole.EMPLOYEE
      };
      
      const mappedUser = mapUserFromAPI(normalizedUser);
      setUser(mappedUser);
      
      await loadDataFromAPI(mappedUser);
      
      if (mappedUser.mustChangePassword) {
        setView('app');
        setActiveTab('profile');
      } else {
        setView('app');
      }
    } catch (error: any) {
      logger.error('Auth', 'Login na API falhou', error);
      setGlobalAuthToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setGlobalAuthToken(null);
    setUser(null);
    setTasks([]);
    setUsers([]);
    setSystemActivities([]);
    setView('login');
  };

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiAuth.register(email, name, password);
      
      // Auto login after registration
      setTimeout(async () => {
        try {
          await login(email, password);
        } catch (loginError) {
          console.error('Auto-login after registration failed:', loginError);
        }
      }, 2000);
      
      return response;
    } catch (error: any) {
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
      
      const mappedTask = mapTaskFromAPI(apiResponse.task);
      setTasks([mappedTask, ...tasks]);
      
      addSystemActivity({ 
        userId: user!.id, 
        userName: user!.name, 
        action: 'created', 
        entityType: 'task', 
        entityId: mappedTask.id, 
        entityTitle: mappedTask.title 
      });
      
      addNotification(user!.id, 'Tarefa criada com sucesso.', 'success');
      
    } catch (error) {
      logger.error('Task', 'Erro ao criar tarefa na API', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, taskData: any) => {
    try {
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { 
          ...t, 
          ...taskData,
          updatedAt: new Date().toISOString() 
        } : t
      );
      
      const taskToUpdate = updatedTasks.find(t => t.id === taskId)!;
      const apiResponse = await apiTasks.update(taskId, taskToUpdate);
      
      if (apiResponse && apiResponse.id) {
        const mappedTask = mapTaskFromAPI(apiResponse);
        setTasks(updatedTasks.map(t => t.id === taskId ? mappedTask : t));
      } else {
        setTasks(updatedTasks);
      }
      
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
    try {
      await apiTasks.delete(task.id);
      setTasks(tasks.filter(t => t.id !== task.id));
      
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

  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`Deseja eliminar a tarefa "${task.title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    await deleteTask(task);
  };

  const handleAdvanceStatus = async (task: Task) => {
    let currentStatus: TaskStatus;
    
    if (task.status === 'ABERTO' as any) {
      currentStatus = TaskStatus.PENDENTE;
    } else {
      const validStatus = Object.values(TaskStatus).includes(task.status as TaskStatus);
      if (!validStatus) {
        addNotification(user!.id, `Status inválido: ${task.status}`, 'error');
        return;
      }
      currentStatus = task.status as TaskStatus;
    }
    
    const currentIndex = StatusOrder.indexOf(currentStatus);
    const nextStatus = StatusOrder[currentIndex + 1];
    
    if (!nextStatus) return;
    
    const isTaskMember = task.responsibleId === user?.id || task.intervenientes?.includes(user?.id as string);
    
    if (user?.role === UserRole.EMPLOYEE && !isTaskMember) return;
    
    if (task.status === TaskStatus.TERMINADO && user?.role !== UserRole.ADMIN) return;

    try {
      const backendStatus = nextStatus;
      const response = await apiTasks.updateStatus(task.id, backendStatus);
      
      const updatedTask = response ? mapTaskFromAPI(response) : { 
        ...task, 
        status: nextStatus, 
        updatedAt: new Date().toISOString(),
        closedAt: nextStatus === TaskStatus.TERMINADO ? new Date().toISOString() : task.closedAt
      };
      
      setTasks(tasks.map(tk => tk.id === task.id ? { ...tk, ...updatedTask } : tk));
      
      if (user?.role === UserRole.EMPLOYEE) {
        try {
          await apiComments.create(task.id, `Avançou o estado para ${nextStatus}`);
        } catch (commentError) {
          logger.warn('Comment', 'Erro ao criar comentário automático na API', commentError);
        }
      }
      
      addSystemActivity({ 
        userId: user!.id, 
        userName: user!.name, 
        action: 'status_changed', 
        entityType: 'task', 
        entityId: task.id, 
        entityTitle: task.title, 
        fromStatus: task.status, 
        toStatus: nextStatus 
      });
      
      try {
        const aiMsg = await getSmartNotification(task.title, nextStatus, false, false, lang);
        addNotification(task.responsibleId, aiMsg, nextStatus === TaskStatus.TERMINADO ? 'success' : 'info');
      } catch (aiError) {
        console.error('Erro na notificação AI:', aiError);
      }
      
    } catch (error: any) {
      logger.warn('Task', 'Erro ao atualizar status na API', error);
      
      let errorMessage = 'Não foi possível atualizar o estado na API.';
      if (error.message?.includes('400')) errorMessage = 'Status inválido.';
      if (error.message?.includes('403') || error.message?.includes('401')) errorMessage = 'Sem permissão para atualizar esta tarefa.';
      if (error.message?.includes('404')) errorMessage = 'Tarefa não encontrada.';
      
      addNotification(user!.id, errorMessage, 'error');
    }
  };

  const addComment = async (taskId: string, text: string) => {
    if (!user) return;
    
    try {
      const response = await apiComments.create(taskId, text);
      if (response && response.id) {
        const mappedComment = mapCommentFromAPI(response);
        const updatedTasks = tasks.map(t => 
          t.id === taskId ? { 
            ...t, 
            comments: [...(t.comments || []), mappedComment], 
            updatedAt: new Date().toISOString() 
          } : t
        );
        setTasks(updatedTasks);
        logger.debug('Comment', 'Comentário criado na API com sucesso');
        
        addSystemActivity({ 
          userId: user.id, 
          userName: user.name, 
          action: 'commented', 
          entityType: 'task', 
          entityId: taskId, 
          entityTitle: tasks.find(x => x.id === taskId)?.title 
        });
      }
    } catch (apiError) {
      logger.warn('Comment', 'API comentário falhou', apiError);
      addNotification(user.id, 'Não foi possível adicionar o comentário. Tente novamente.', 'error');
    }
  };

  // ============ USER METHODS ============
  const loadUsers = async () => {
    if (user?.role === UserRole.ADMIN) {
      try {
        const usersResponse = await apiAdminUsers.getAll();
        if (usersResponse) {
          const usersList = Array.isArray(usersResponse) ? usersResponse : (usersResponse.data || usersResponse.users || []);
          const mappedUsers = usersList.map((u: any) => mapUserFromAPI(u));
          if (mappedUsers.length > 0) {
            setUsers(mappedUsers);
          }
        }
      } catch (error) {
        logger.debug('API', 'Não foi possível carregar utilizadores da API', error);
      }
    }
  };

  const createUser = async (userData: any) => {
    try {
      const apiResponse = await apiAdminUsers.create({
        name: userData.name,
        email: userData.email,
        role: userData.role === UserRole.ADMIN ? 'ADMIN' : 'USER',
        phone: userData.phone || ''
      });

      let createdUser: User | null = null;
      
      if (apiResponse?.user) {
        createdUser = mapUserFromAPI(apiResponse.user);
      } else if (apiResponse?.id) {
        createdUser = mapUserFromAPI(apiResponse);
      } else if (apiResponse) {
        createdUser = mapUserFromAPI(apiResponse);
      }

      if (!createdUser) {
        throw new Error('Não foi possível obter o utilizador criado na API.');
      }

      setUsers([...users, createdUser]);
      
      users.filter(u => u.role === UserRole.ADMIN).forEach(u => {
        addNotification(u.id, `Novo utilizador criado: ${createdUser!.name} (${createdUser!.email})`, 'info');
      });
      
      addNotification(user!.id, `Utilizador ${createdUser.name} criado com sucesso.`, 'success');
      
    } catch (error: any) {
      if (error.message?.includes('409') || error.message?.includes('Conflict') || 
          error.message?.toLowerCase().includes('email') || error.message?.toLowerCase().includes('duplicate')) {
        throw new Error('Este email já está cadastrado no sistema. Use um email diferente.');
      }
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: any) => {
    try {
      await apiUsers.update(userId, userData);
      setUsers(users.map(x => x.id !== userId ? x : { ...x, ...userData }));
      
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
    
    try {
      await apiAdminUsers.delete(userId);
      logger.debug('User', 'Utilizador eliminado na API', userId);
      
      addNotification(user!.id, `Utilizador ${userToDelete.name} eliminado com sucesso.`, 'success');
      setUsers(users.filter(u => u.id !== userId));
      
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
      prev.map(n => n.userId === user?.id ? { ...n, isRead: true } : n)
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
    try {
      const activeUser = currentUser ?? user;
      const isAdmin = activeUser?.role === UserRole.ADMIN;
      
      // Load tasks
      const tasksResponse = isAdmin ? await apiTasks.getAll() : await apiTasks.getMyTasks();
      if (tasksResponse) {
        const tasksList = Array.isArray(tasksResponse) ? tasksResponse : (tasksResponse.data || tasksResponse.tasks || []);
        const mappedTasks = tasksList.map((t: any) => mapTaskFromAPI(t));
        if (mappedTasks.length > 0) {
          setTasks(mappedTasks);
        } else {
          setTasks([]);
        }
      }

      // Load users (admin only)
      if (isAdmin) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setTasks([]);
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
    // Check for invite token in URL
    const invite = new URLSearchParams(window.location.search).get('invite');
    if (invite) {
      setInviteToken(invite);
      setUser(null);
      setView('set-password');
      return;
    }

    // Restore auth token
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

  // ============ CONTEXT VALUE ============
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
    
    // Tasks
    createTask,
    updateTask,
    deleteTask,
    handleAdvanceStatus,
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
    
    // Activities
    addSystemActivity,
    
    // Data
    loadDataFromAPI,
    
    // Utils
    getAvatarUrl,
    saveAvatar,
    openAvatarUpload
  };

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
            const r = new FileReader(); 
            r.onload = () => { 
              saveAvatar(uploadingAvatarFor, r.result as string); 
              setUploadingAvatarFor(null); 
            }; 
            r.readAsDataURL(f); 
          }
          e.target.value = '';
        }} 
      />
    </AppContext.Provider>
  );
};