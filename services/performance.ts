/**
 * Configurações de Cache e Performance
 * Otimizações para testes de carga
 */

// Cache em memória para dados frequentemente acessados
export const memCache = {
  store: new Map<string, { data: any; timestamp: number }>(),
  
  set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    memCache.store.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  },
  
  get: (key: string) => {
    const cached = memCache.store.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.timestamp) {
      memCache.store.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  clear: () => memCache.store.clear(),
  
  // Atalhos para dados comuns
  setUsers: (users: any) => memCache.set('users', users, 10 * 60 * 1000),
  getUsers: () => memCache.get('users'),
  setTasks: (tasks: any) => memCache.set('tasks', tasks, 5 * 60 * 1000),
  getTasks: () => memCache.get('tasks'),
};

// Deduplicação de requisições
export const requestDeduplicator = {
  pending: new Map<string, Promise<any>>(),
  
  async execute(key: string, fn: () => Promise<any>) {
    // Se requisição já está pendente, aguardar
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }
    
    // Criar nova promessa
    const promise = fn()
      .then(result => {
        this.pending.delete(key);
        return result;
      })
      .catch(error => {
        this.pending.delete(key);
        throw error;
      });
    
    this.pending.set(key, promise);
    return promise;
  },
};

// Retry com exponential backoff
export const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  maxDelay: number = 10000
) => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(
          initialDelay * Math.pow(2, attempt),
          maxDelay
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Throttle função para eventos frequentes
export const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Debounce função para operações custosas
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Lazy load para componentes pesados
export const lazyLoad = async (
  component: () => Promise<any>,
  fallback?: any
) => {
  try {
    return await component();
  } catch (error) {
    console.error('Erro ao carregar componente:', error);
    return fallback;
  }
};

export default {
  memCache,
  requestDeduplicator,
  retryWithBackoff,
  throttle,
  debounce,
  lazyLoad,
};
