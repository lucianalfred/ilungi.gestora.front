// ============================================
// USER TYPES
// ============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// TASK STATUS ENUM
// ============================================

export enum TaskStatus {
  PENDENTE = 'PENDENTE',
  EM_PROGRESSO = 'EM_PROGRESSO', 
  ATRASADA = 'ATRASADA',
  TERMINADO = 'TERMINADO',
  FECHADO = 'FECHADO'
}

// Mapa de compatibilidade para versões antigas
export const TaskStatusAliases = {
  'EM_ANDAMENTO': TaskStatus.EM_PROGRESSO,
  'EM ANDAMENTO': TaskStatus.EM_PROGRESSO,
  'EM_EXECUCAO': TaskStatus.EM_PROGRESSO,
  'EM EXECUCAO': TaskStatus.EM_PROGRESSO,
  'EM_REVISAO': TaskStatus.EM_PROGRESSO, // Mapear revisão para progresso
  'EM REVISAO': TaskStatus.EM_PROGRESSO,
  'REVISAO': TaskStatus.EM_PROGRESSO,
  'CONCLUIDA': TaskStatus.TERMINADO,
  'CONCLUÍDA': TaskStatus.TERMINADO,
  'CONCLUIDO': TaskStatus.TERMINADO,
  'CONCLUÍDO': TaskStatus.TERMINADO,
  'ARQUIVADO': TaskStatus.FECHADO, // Mapear arquivado para fechado
  'ARQUIVADA': TaskStatus.FECHADO,
  'CANCELADA': TaskStatus.FECHADO, // Mapear cancelada para fechado
  'ABERTO': TaskStatus.PENDENTE,
  'ABERTA': TaskStatus.PENDENTE
};
// ============================================
// TASK PRIORITY ENUM
// ============================================

export enum TaskPriority {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  taskId: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// TASK TYPES
// ============================================

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus | string; // Aceita string para compatibilidade com backend
  priority?: TaskPriority;
  
  // Datas
  startDate: string;
  deliveryDate: string;
  completedAt?: string;
  
  // Responsáveis
  responsibleId: string;
  intervenientes?: string[]; // IDs dos intervenientes adicionais
  
  // Métricas de prazo
  deadlineValue?: number;
  deadlineType?: 'days' | 'hours';
  daysToFinish?: number;
  
  // Comentários
  comments?: Comment[];
  
  // Metadados
  createdById: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  
  // Campos opcionais adicionais
  isOverdue?: boolean;
  progress?: number;
  tags?: string[];
}

// ============================================
// TASK FILTERS
// ============================================

export interface TaskFilters {
  status?: TaskStatus | string;
  priority?: TaskPriority;
  responsibleId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
  position?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface SetupPasswordData {
  token: string;
  password: string;
  passwordConfirmation: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  userId: string;
  taskId?: string;
  createdAt: string;
}

// ============================================
// ACTIVITY LOG TYPES
// ============================================

export interface Activity {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'status_changed' | 'comment_added' | 'user_added' | 'user_updated';
  userId: string;
  userName: string;
  taskId?: string;
  taskTitle?: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// ============================================
// REPORT TYPES
// ============================================

export interface EmployeeReport {
  userId: string;
  userName: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  complianceRate: number;
}

export interface TaskStatusReport {
  status: TaskStatus;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalTasks: number;
  activeTasks: number;
  overdueTasks: number;
  completedTasks: number;
  complianceRate: number;
  tasksByStatus: TaskStatusReport[];
  recentActivities: Activity[];
}

// ============================================
// FORM TYPES
// ============================================

export interface TaskFormData {
  title: string;
  description: string;
  startDate: string;
  deadlineValue: number;
  deadlineType: 'days' | 'hours';
  responsibleId: string;
  intervenientes?: string[];
  priority?: TaskPriority;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  position?: string;
  phone?: string;
  password?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string | number;

// ============================================
// CONSTANTS
// ============================================

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDENTE]: 'Pendente',
  [TaskStatus.EM_ANDAMENTO]: 'Em Andamento',
  [TaskStatus.EM_REVISAO]: 'Em Revisão',
  [TaskStatus.TERMINADO]: 'Terminado',
  [TaskStatus.FECHADO]: 'Fechado',
  [TaskStatus.ARQUIVADO]: 'Arquivado',
  [TaskStatus.ATRASADA]: 'Atrasada',
  [TaskStatus.CANCELADA]: 'Cancelada'
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.BAIXA]: 'Baixa',
  [TaskPriority.MEDIA]: 'Média',
  [TaskPriority.ALTA]: 'Alta',
  [TaskPriority.URGENTE]: 'Urgente'
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gestor',
  [UserRole.USER]: 'Utilizador'
};