/**
 * API Service para comunicação com o backend
 * Base URL: https://ilungigestoraapi-production.up.railway.app/
 */

// Base URL configurable via Vite env `VITE_API_BASE_URL`.
// Default points to production Railway app. Ensure single `/api` context-path.
const RAW_BASE = (typeof process !== 'undefined' && (process as any).env && (process as any).env.VITE_API_BASE_URL) || (typeof window !== 'undefined' && (window as any).VITE_API_BASE_URL) || 'https://ilungigestoraapi-production.up.railway.app';
const API_BASE = RAW_BASE.replace(/\/$/, '') + '/api';

// Tipo para armazenar token de autenticação
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('gestora_api_token', token);
  } else {
    localStorage.removeItem('gestora_api_token');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('gestora_api_token');
  }
  return authToken;
};

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro HTTP ${response.status}`);
  }
  return response.json();
};

// ============ AUTENTICAÇÃO ============
export const apiAuth = {
  login: async (email: string, password?: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password: password || '' }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: async () => {
    setAuthToken(null);
    return { success: true };
  },

  register: async (email: string, name: string, password?: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, name, password: password || '' }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============ TAREFAS ============
export const apiTasks = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (taskData: any) => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  update: async (id: string, taskData: any) => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// ============ UTILIZADORES ============
export const apiUsers = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (userData: any) => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  update: async (id: string, userData: any) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateAvatar: async (id: string, avatarData: string) => {
    const response = await fetch(`${API_BASE}/users/${id}/avatar`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ avatar: avatarData }),
    });
    return handleResponse(response);
  },
};

// ============ COMENTÁRIOS ============
export const apiComments = {
  getByTaskId: async (taskId: string) => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (taskId: string, text: string) => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },

  delete: async (taskId: string, commentId: string) => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============ ATIVIDADES DO SISTEMA ============
export const apiActivities = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/activities`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getByTaskId: async (taskId: string) => {
    const response = await fetch(`${API_BASE}/activities/task/${taskId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============ NOTIFICAÇÕES ============
export const apiNotifications = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  markAsRead: async (notificationId: string) => {
    const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============ DASHBOARD / RELATÓRIOS ============
export const apiReports = {
  getStats: async () => {
    const response = await fetch(`${API_BASE}/reports/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUserPerformance: async () => {
    const response = await fetch(`${API_BASE}/reports/user-performance`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getTaskStats: async () => {
    const response = await fetch(`${API_BASE}/reports/task-stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============ HEALTH / PING ============
export const apiHealth = {
  ping: async () => {
    const response = await fetch(`${API_BASE}/actuator/health`, {
      method: 'GET',
      headers: getHeaders(),
    });
    // actuator may return non-JSON text on some setups — guard with try/catch
    try {
      return await handleResponse(response);
    } catch (e) {
      // if actuator returns non-JSON but 200, return status text
      if (response.ok) return { status: 'UP' };
      throw e;
    }
  },
  pingSimple: async () => {
    const response = await fetch(`${API_BASE}/ping`, { method: 'GET', headers: getHeaders() });
    if (!response.ok) throw new Error(`Ping failed ${response.status}`);
    return response.text();
  },
};
