/**
 * API Service para comunicação com o backend ILUNGI GESTORA API
 * Configure VITE_API_BASE_URL no seu .env
 */

type Json = Record<string, any>;

// Obter URL base da API
function getApiBase(): string {
  // Usar variável de ambiente do Vite ou fallback para localhost
  //const viteBase = import.meta.env.VITE_API_BASE_URL;
  const base = "http://213.199.62.60:8083";
  return String(base || "").replace(/\/+$/, "");
}

const API_BASE = getApiBase();

console.log('API Base URL:', API_BASE);

// =================== AUTH TOKEN ===================
let authToken: string | null = null;

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  GUEST = 'GUEST'
}

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    sessionStorage.setItem("gestora_api_token", token);
  } else {
    sessionStorage.removeItem("gestora_api_token");
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = sessionStorage.getItem("gestora_api_token");
  }
  return authToken;
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 
    "Content-Type": "application/json"
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// =================== RESPONSE HANDLER ===================
async function handleResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  let data: any = raw;
  
  try {
    if (raw && (contentType.includes("application/json") || raw.startsWith("{"))) {
      data = JSON.parse(raw);
    }
  } catch {
    // Se não for JSON válido, mantém como string
    data = raw || null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.detail)) ||
      (typeof data === "string" && data) ||
      res.statusText ||
      `HTTP ${res.status}`;

    console.error("API Error:", {
      url: res.url,
      status: res.status,
      body: data,
    });

    throw new Error(msg);
  }

  return data;
}

// =================== AUTH ===================
export const apiAuth = {
  login: async (email: string, password: string) => {
    const url = `${API_BASE}/auth/login`;
    console.log('Login URL:', url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    if (data?.token) {
      setAuthToken(data.token);
    } else if (data?.jwt) {
      setAuthToken(data.jwt);
    }

    return data;
  },

  logout: async () => {
    setAuthToken(null);
    return { success: true };
  },

  register: async (email: string, name: string, password: string, phone?: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        name, 
        password,
        phone: phone || ""
      }),
    });

    const data = await handleResponse(response);

    if (data?.token) setAuthToken(data.token);
    else if (data?.jwt) setAuthToken(data.jwt);

    return data;
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    
    if (res.status === 404 || res.status === 401) {
      return null;
    }
    
    return handleResponse(res);
  },

  validateSetupToken: async (token: string) => {
    const response = await fetch(`${API_BASE}/auth/validate-setup-token/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  setupPassword: async (token: string, password: string, confirmPassword: string) => {
    const response = await fetch(`${API_BASE}/auth/setup-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    });
    return handleResponse(response);
  },

  // ✅ NOVOS MÉTODOS PARA RECUPERAÇÃO DE SENHA
  forgotPassword: async (email: string) => {
    const url = `${API_BASE}/auth/forgot-password`;
    console.log('📤 Forgot Password URL:', url, 'Email:', email);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await handleResponse(response);
      console.log('📥 Resposta forgot-password:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro no forgot-password:', error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string, confirmPassword: string) => {
    const url = `${API_BASE}/auth/reset-password`;
    console.log('📤 Reset Password URL:', url);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token, 
          newPassword, 
          confirmPassword 
        }),
      });

      const data = await handleResponse(response);
      console.log('📥 Resposta reset-password:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro no reset-password:', error);
      throw error;
    }
  },

  validateResetToken: async (token: string) => {
    const url = `${API_BASE}/auth/validate-reset-token/${token}`;
    console.log('📤 Validate Reset Token URL:', url);
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await handleResponse(response);
      console.log('📥 Resposta validate-reset-token:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao validar token:', error);
      throw error;
    }
  },
};

// =================== TASKS ===================
export const apiTasks = {
  // Listar todas as tarefas (para admin)
  getAll: async () => {
    const res = await fetch(`${API_BASE}/admin/tasks`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  // Minhas tarefas
  getMyTasks: async () => {
    const res = await fetch(`${API_BASE}/tasks/my-tasks`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  // Criar tarefa (usuário comum cria para si mesmo)
  create: async (taskData: any) => {
    // Se for admin, cria com múltiplos responsáveis
    const res = await fetch(`${API_BASE}/admin/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description,
        daysToFinish: taskData.deadlineType === 'days' ? taskData.deadlineValue : Math.ceil(taskData.deadlineValue / 24),
        responsibles: [taskData.responsibleId, ...(taskData.intervenientes || [])].map(id => Number(id))
      }),
    });
    return handleResponse(res);
  },

  update: async (id: string, taskData: any) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { 
      method: "DELETE", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  updateStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  // Minhas estatísticas
  getMyStats: async () => {
    const res = await fetch(`${API_BASE}/tasks/my-stats`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },
};

// =================== ADMIN TASKS ===================
export const apiAdminTasks = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/admin/tasks`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  getByUserId: async (userId: string) => {
    const res = await fetch(`${API_BASE}/admin/tasks/user/${userId}`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  assignUser: async (taskId: string, userId: string) => {
    const res = await fetch(`${API_BASE}/admin/tasks/${taskId}/assign/${userId}`, { 
      method: "POST", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  createWithResponsibles: async (taskData: {
    title: string;
    description?: string;
    daysToFinish?: number;
    status?: string;
    responsibles: Array<number>;
  }) => {
    // Garantir que responsibles sejam números
    const processedData = {
      ...taskData,
      responsibles: taskData.responsibles.map(r => 
        typeof r === 'string' ? parseInt(r, 10) : r
      ).filter(r => !isNaN(r as number))
    };
    
    console.log('📤 Enviando dados para /admin/tasks:', processedData);
    
    const res = await fetch(`${API_BASE}/admin/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(processedData),
    });
    return handleResponse(res);
  },
};

// =================== ADMIN USERS ===================
export const apiAdminUsers = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  getByRole: async (role: string) => {
    const res = await fetch(`${API_BASE}/admin/users/by-role/${role}`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  create: async (data: { name: string; email: string; phone?: string; role?: string }) => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        role: data.role || "USER"
      }),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: { name?: string; phone?: string; role?: string }) => {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, { 
      method: "DELETE", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  changeRole: async (id: string, role: string) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role?role=${encodeURIComponent(role)}`, { 
      method: "PATCH", 
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// =================== ADMIN STATS ===================
export const apiAdmin = {
  getStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },
};

// =================== USER PROFILE ===================
export const apiUsers = {
  // Método para buscar todos os usuários (com opções de paginação/filtro)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => {
    // Construir query string a partir dos parâmetros
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.order) queryParams.append('order', params.order);
    }
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_BASE}/users?${queryString}`
      : `${API_BASE}/users`;
    
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    
    return handleResponse(res);
  },

  // Alternativa mais simples (sem parâmetros)
  getAllSimple: async () => {
    const res = await fetch(`${API_BASE}/users`, {
      method: "GET",
      headers: getHeaders(),
    });
    
    return handleResponse(res);
  },

  // Método para buscar um usuário específico por ID
  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    
    return handleResponse(res);
  },

  updateProfile: async (id: string, data: { name?: string; phone?: string }) => {
    const res = await fetch(`${API_BASE}/users/${id}/profile`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  update: async (id: string, data: { name?: string; email?: string }) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  changePassword: async (id: string, password: string, oldPassword?: string) => {
    const res = await fetch(`${API_BASE}/users/${id}/password`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ password, oldPassword }),
    });
    return handleResponse(res);
  },
};

// =================== COMMENTS ===================
export const apiComments = {
  create: async (taskId: string, text: string) => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    return handleResponse(res);
  },

  getByTaskId: async (taskId: string) => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, { 
      method: "GET", 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },
};

// =================== MAPPERS ===================
export const mapUserFromAPI = (apiUser: any) => {
  return {
    id: String(apiUser.id || apiUser.userId || ""),
    email: apiUser.email || "",
    name: apiUser.name || apiUser.username || "Utilizador",
    phone: apiUser.phone || null,
    role: apiUser.role === "ADMIN" ? UserRole.ADMIN : UserRole.EMPLOYEE,
    position: apiUser.position || apiUser.role || "",
    department: apiUser.department || "",
    avatar: apiUser.avatar || null,
    mustChangePassword: apiUser.mustChangePassword ?? false,
    createdAt: apiUser.createdAt || new Date().toISOString(),
    updatedAt: apiUser.updatedAt || new Date().toISOString(),
  };
};

export const mapTaskFromAPI = (apiTask: any) => {
  // IMPORTANTE: Manter o status original do backend
  // Não mapear 'PENDENTE' para 'ABERTO'
  
  return {
    id: String(apiTask.id || ""),
    title: apiTask.title || "",
    description: apiTask.description || "",
    // Manter o status exatamente como vem do backend
    status: apiTask.status || "PENDENTE",
    priority: apiTask.priority || "MEDIUM",
    responsibleId: String(apiTask.responsibleId || (apiTask.responsibles && apiTask.responsibles[0]?.id) || ""),
    responsibleName: apiTask.responsibleName || (apiTask.responsibles && apiTask.responsibles[0]?.name) || "",
    deliveryDate: apiTask.endDate || apiTask.deliveryDate || new Date().toISOString(),
    startDate: apiTask.createAt || apiTask.startDate || new Date().toISOString(),
    intervenientes: Array.isArray(apiTask.responsibles) ? 
      apiTask.responsibles.slice(1).map((r: any) => String(r.id)) : 
      (apiTask.intervenientes || []),
    comments: Array.isArray(apiTask.comments) ? apiTask.comments.map(mapCommentFromAPI) : [],
    createdAt: apiTask.createdAt || apiTask.createAt || new Date().toISOString(),
    updatedAt: apiTask.updatedAt || new Date().toISOString(),
    // Campos para formulário
    deadlineValue: apiTask.daysToFinish || 1,
    deadlineType: 'days' // Default para backend Spring
  };
};

export const mapCommentFromAPI = (apiComment: any) => {
  return {
    id: String(apiComment.id || ""),
    text: apiComment.text || apiComment.content || "",
    userId: String(apiComment.userId || apiComment.user?.id || apiComment.authorId || ""),
    userName: apiComment.userName || apiComment.user?.name || apiComment.authorName || "Anônimo",
    timestamp: apiComment.timestamp || apiComment.createdAt || new Date().toISOString(),
    taskId: String(apiComment.taskId || apiComment.task?.id || "")
  };
};

// =================== HEALTH CHECK ===================
export const apiHealth = {
  ping: async () => {
    try {
      const res = await fetch(`${API_BASE}/actuator/health`, { method: "GET" });
      return handleResponse(res);
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },
};

// =================== DEFAULT EXPORT ===================
export default {
  apiAuth,
  apiTasks,
  apiUsers,
  apiComments,
  apiAdminUsers,
  apiAdminTasks,
  apiAdmin,
  apiHealth,
};