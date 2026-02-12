import { TaskStatus } from '../types';

// ============================================
// STATUS ORDER - Definir ordem de progresso das tarefas
// ============================================
export const StatusOrder: TaskStatus[] = [
  TaskStatus.PENDENTE,
  TaskStatus.EM_ANDAMENTO,
  TaskStatus.EM_REVISAO,
  TaskStatus.TERMINADO,
  TaskStatus.FECHADO,
  TaskStatus.ARQUIVADO,
  TaskStatus.ATRASADA,
  TaskStatus.CANCELADA
];

// ============================================
// STATUS COLORS - Cores para cada status
// ============================================
export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.PENDENTE]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  [TaskStatus.EM_ANDAMENTO]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [TaskStatus.EM_REVISAO]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  [TaskStatus.TERMINADO]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [TaskStatus.FECHADO]: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  [TaskStatus.ARQUIVADO]: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  [TaskStatus.ATRASADA]: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  [TaskStatus.CANCELADA]: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

// ============================================
// TRANSLATIONS - Traduções PT/EN
// ============================================
export const TRANSLATIONS = {
  pt: {
    // Navegação
    dashboard: 'Dashboard',
    tasks: 'Tarefas',
    users: 'Utilizadores',
    profile: 'Perfil',
    reports: 'Relatórios',
    logout: 'Sair',
    
    // Ações
    createTask: 'Nova Tarefa',
    editTask: 'Editar Tarefa',
    deleteTask: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    search: 'Pesquisar...',
    addUser: 'Adicionar Utilizador',
    editUser: 'Editar Utilizador',
    
    // Campos
    title: 'Título',
    description: 'Descrição',
    startDate: 'Data Início',
    deliveryDate: 'Data Entrega',
    responsibles: 'Responsáveis',
    status: 'Estado',
    priority: 'Prioridade',
    comments: 'Comentários',
    name: 'Nome',
    email: 'Email',
    position: 'Cargo',
    department: 'Departamento',
    phone: 'Telefone',
    
    // Status
    allStatuses: 'Todos os Estados',
    activeTasks: 'Tarefas Ativas',
    overdueTasks: 'Em Atraso',
    completedTasks: 'Concluídas',
    noTasks: 'Nenhuma tarefa encontrada',
    
    // Landing Page
    landingTitle: 'Gestão de Workflow profissional, simples e eficaz',
    landingDesc: 'Plataforma completa para gestão de tarefas, equipas e fluxos de trabalho. Aumente a produtividade da sua equipa com o GESTORA.',
    
    // Tempo
    days: 'Dias',
    hours: 'Horas',
    
    // Perfil
    myProfile: 'Meu Perfil',
    changePassword: 'Alterar Senha',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Senha',
    
    // Notificações
    notifications: 'Notificações',
    markAllRead: 'Marcar todas',
    noNotifications: 'Sem notificações',
    
    // Activity
    latestUpdates: 'Últimas Atualizações',
    activityLog: 'Log de Actividades',
    noActivities: 'Nenhuma actividade registada.',
    
    // Reports
    employeeReport: 'Relatório de Cumprimento das Tarefas por Funcionário',
    employee: 'Funcionário',
    total: 'Total',
    completed: 'Concluídas',
    overdue: 'Em atraso',
    complianceRate: 'Taxa cumprimento'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    users: 'Users',
    profile: 'Profile',
    reports: 'Reports',
    logout: 'Logout',
    
    // Actions
    createTask: 'New Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search...',
    addUser: 'Add User',
    editUser: 'Edit User',
    
    // Fields
    title: 'Title',
    description: 'Description',
    startDate: 'Start Date',
    deliveryDate: 'Delivery Date',
    responsibles: 'Responsibles',
    status: 'Status',
    priority: 'Priority',
    comments: 'Comments',
    name: 'Name',
    email: 'Email',
    position: 'Position',
    department: 'Department',
    phone: 'Phone',
    
    // Status
    allStatuses: 'All Statuses',
    activeTasks: 'Active Tasks',
    overdueTasks: 'Overdue',
    completedTasks: 'Completed',
    noTasks: 'No tasks found',
    
    // Landing Page
    landingTitle: 'Professional Workflow management, simple and effective',
    landingDesc: 'Complete platform for task management, teams and workflows. Boost your team\'s productivity with GESTORA.',
    
    // Time
    days: 'Days',
    hours: 'Hours',
    
    // Profile
    myProfile: 'My Profile',
    changePassword: 'Change Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    
    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications',
    
    // Activity
    latestUpdates: 'Latest Updates',
    activityLog: 'Activity Log',
    noActivities: 'No activities recorded.',
    
    // Reports
    employeeReport: 'Task Compliance Report by Employee',
    employee: 'Employee',
    total: 'Total',
    completed: 'Completed',
    overdue: 'Overdue',
    complianceRate: 'Compliance Rate'
  }
};

// ============================================
// TASK PRIORITIES
// ============================================
export const TASK_PRIORITIES = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  URGENTE: 'Urgente'
} as const;

// ============================================
// TASK PRIORITY COLORS
// ============================================
export const PRIORITY_COLORS = {
  BAIXA: 'bg-slate-100 text-slate-700',
  MEDIA: 'bg-blue-100 text-blue-700',
  ALTA: 'bg-amber-100 text-amber-700',
  URGENTE: 'bg-rose-100 text-rose-700'
} as const;

// ============================================
// API ENDPOINTS
// ============================================
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VALIDATE_TOKEN: '/auth/validate-token',
  SETUP_PASSWORD: '/auth/setup-password',
  CURRENT_USER: '/auth/me',
  
  // Tasks
  TASKS: '/tasks',
  TASKS_MY: '/tasks/my',
  TASKS_STATUS: (id: string) => `/tasks/${id}/status`,
  
  // Admin Tasks
  ADMIN_TASKS: '/admin/tasks',
  ADMIN_TASKS_WITH_RESPONSIBLES: '/admin/tasks/with-responsibles',
  
  // Users
  USERS: '/users',
  USERS_PROFILE: (id: string) => `/users/${id}/profile`,
  USERS_PASSWORD: (id: string) => `/users/${id}/password`,
  
  // Admin Users
  ADMIN_USERS: '/admin/users',
  ADMIN_USERS_ROLE: (id: string) => `/admin/users/${id}/role`,
  
  // Comments
  COMMENTS: '/comments',
  TASK_COMMENTS: (taskId: string) => `/tasks/${taskId}/comments`
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'gestora_api_token',
  REMEMBER_EMAIL: 'gestora_remember_email',
  AVATAR_PREFIX: 'gestora_avatar_',
  ACTIVITIES: 'gestora_activities',
  THEME: 'gestora_theme',
  LANGUAGE: 'gestora_language'
} as const;

// ============================================
// NOTIFICATION TYPES
// ============================================
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

// ============================================
// DATE FORMATS
// ============================================
export const DATE_FORMATS = {
  FULL: 'dd/MM/yyyy HH:mm',
  DATE_ONLY: 'dd/MM/yyyy',
  TIME_ONLY: 'HH:mm',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss'
} as const;

// ============================================
// PASSWORD REQUIREMENTS
// ============================================
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 6,
  REQUIRE_UPPERCASE: false,
  REQUIRE_NUMBER: false,
  REQUIRE_SPECIAL: false
} as const;

// ============================================
// PAGINATION DEFAULTS
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
} as const;

// ============================================
// VALIDATION REGEX
// ============================================
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^.{6,}$/,
  NAME: /^.{2,}$/,
  PHONE: /^[0-9+\-\s()]{9,}$/
} as const;

// ============================================
// ERROR MESSAGES
// ============================================
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório.',
  INVALID_EMAIL: 'Por favor, insira um email válido.',
  PASSWORD_MIN_LENGTH: `A senha deve ter pelo menos ${PASSWORD_REQUIREMENTS.MIN_LENGTH} caracteres.`,
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem.',
  INVALID_PHONE: 'Por favor, insira um número de telefone válido.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  UNAUTHORIZED: 'Acesso não autorizado. Faça login novamente.',
  FORBIDDEN: 'Não tem permissão para realizar esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  CONFLICT: 'Conflito de dados. Verifique as informações.'
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login efetuado com sucesso!',
  LOGOUT: 'Logout efetuado com sucesso!',
  TASK_CREATED: 'Tarefa criada com sucesso!',
  TASK_UPDATED: 'Tarefa atualizada com sucesso!',
  TASK_DELETED: 'Tarefa eliminada com sucesso!',
  USER_CREATED: 'Utilizador criado com sucesso!',
  USER_UPDATED: 'Utilizador atualizado com sucesso!',
  USER_DELETED: 'Utilizador eliminado com sucesso!',
  PASSWORD_CHANGED: 'Senha alterada com sucesso!',
  COMMENT_ADDED: 'Comentário adicionado com sucesso!',
  EMAIL_SENT: 'Email enviado com sucesso! Verifique sua caixa de entrada.'
} as const;