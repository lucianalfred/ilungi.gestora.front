/**
 * Sistema de Logging Centralizado
 * Uso em Produção: Apenas INFO e ERROR
 * Uso em Dev: DEBUG, INFO, ERROR, WARN
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const isDev = process.env.NODE_ENV === 'development';
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  'DEBUG': 0,
  'INFO': 1,
  'WARN': 2,
  'ERROR': 3,
};

const currentLogLevel = isDev ? 0 : 1; // DEV=DEBUG, PROD=INFO

const formatTimestamp = (): string => {
  return new Date().toLocaleString('pt-PT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const formatMessage = (level: LogLevel, source: string, message: string): string => {
  return `[${formatTimestamp()}] [${level}] [${source}] ${message}`;
};

const getLogStyle = (level: LogLevel): string => {
  const styles: Record<LogLevel, string> = {
    'DEBUG': 'color: #888; font-style: italic;',
    'INFO': 'color: #10b981;',
    'WARN': 'color: #f59e0b;',
    'ERROR': 'color: #ef4444; font-weight: bold;',
  };
  return styles[level];
};

export const logger = {
  debug: (source: string, message: string, data?: any) => {
    if (LOG_LEVEL_PRIORITY['DEBUG'] >= currentLogLevel) {
      const formatted = formatMessage('DEBUG', source, message);
      console.log(`%c${formatted}`, getLogStyle('DEBUG'), data || '');
    }
  },

  info: (source: string, message: string, data?: any) => {
    if (LOG_LEVEL_PRIORITY['INFO'] >= currentLogLevel) {
      const formatted = formatMessage('INFO', source, message);
      console.log(`%c${formatted}`, getLogStyle('INFO'), data || '');
    }
  },

  warn: (source: string, message: string, data?: any) => {
    if (LOG_LEVEL_PRIORITY['WARN'] >= currentLogLevel) {
      const formatted = formatMessage('WARN', source, message);
      console.warn(`%c${formatted}`, getLogStyle('WARN'), data || '');
    }
  },

  error: (source: string, message: string, error?: Error | any) => {
    if (LOG_LEVEL_PRIORITY['ERROR'] >= currentLogLevel) {
      const formatted = formatMessage('ERROR', source, message);
      console.error(`%c${formatted}`, getLogStyle('ERROR'), error || '');
    }
  },

  // Atalho para operações de API
  apiCall: (method: string, endpoint: string) => {
    logger.debug('API', `${method} ${endpoint}`);
  },

  apiSuccess: (method: string, endpoint: string, statusCode?: number) => {
    logger.info('API', `${method} ${endpoint} ${statusCode || '200'} OK`);
  },

  apiError: (method: string, endpoint: string, error: any) => {
    logger.error('API', `${method} ${endpoint} Falhou`, error);
  },
};

export default logger;
