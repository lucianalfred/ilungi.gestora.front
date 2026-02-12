/**
 * Utility for handling authentication error messages
 * Centralizes error message formatting and user-friendly translations
 */

/**
 * Maps API error responses to user-friendly error messages
 * @param error - The error object from API call
 * @returns User-friendly error message string
 */
export const getAuthErrorMessage = (error: any): string => {
  // If error is null/undefined
  if (!error) {
    return 'Ocorreu um erro desconhecido. Tente novamente.';
  }

  // Extract message from error object
  const errorMessage = 
    error?.response?.data?.message || 
    error?.response?.data?.error || 
    error?.message || 
    error?.toString() || 
    '';

  const lowerMsg = errorMessage.toLowerCase();

  // === CREDENTIALS ERRORS ===
  if (
    lowerMsg.includes('bad credentials') ||
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('forbidden') ||
    lowerMsg.includes('senha') ||
    lowerMsg.includes('password') ||
    lowerMsg.includes('credenciais') ||
    lowerMsg.includes('invalid credentials') ||
    lowerMsg.includes('invalid email or password') ||
    lowerMsg.includes('email ou senha inválidos')
  ) {
    return 'Email ou palavra-passe incorretos.';
  }

  // === USER NOT FOUND ===
  if (
    lowerMsg.includes('user not found') ||
    lowerMsg.includes('utilizador não encontrado') ||
    lowerMsg.includes('email não encontrado') ||
    lowerMsg.includes('email not found') ||
    lowerMsg.includes('no user found')
  ) {
    return 'Este email não está registado no sistema.';
  }

  // === ACCOUNT LOCKED / DISABLED ===
  if (
    lowerMsg.includes('locked') ||
    lowerMsg.includes('blocked') ||
    lowerMsg.includes('disabled') ||
    lowerMsg.includes('desativado') ||
    lowerMsg.includes('bloqueado')
  ) {
    return 'A sua conta está bloqueada. Contacte o administrador.';
  }

  // === TOKEN ERRORS ===
  if (
    lowerMsg.includes('token') ||
    lowerMsg.includes('jwt') ||
    lowerMsg.includes('session expired') ||
    lowerMsg.includes('sessão expirada')
  ) {
    if (lowerMsg.includes('invalid')) {
      return 'Token de autenticação inválido. Faça login novamente.';
    }
    if (lowerMsg.includes('expired')) {
      return 'A sua sessão expirou. Faça login novamente.';
    }
    return 'Erro de autenticação. Faça login novamente.';
  }

  // === NETWORK / CONNECTION ERRORS ===
  if (
    lowerMsg.includes('network') ||
    lowerMsg.includes('connection') ||
    lowerMsg.includes('internet') ||
    lowerMsg.includes('failed to fetch') ||
    lowerMsg.includes('econnrefused') ||
    lowerMsg.includes('econnreset') ||
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('cors') ||
    error?.name === 'NetworkError' ||
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'ETIMEDOUT'
  ) {
    return 'Não foi possível conectar ao servidor. Verifique a sua ligação à internet.';
  }

  // === RATE LIMITING ===
  if (
    lowerMsg.includes('too many requests') ||
    lowerMsg.includes('rate limit') ||
    lowerMsg.includes('many attempts') ||
    error?.status === 429
  ) {
    return 'Demasiadas tentativas. Por favor, aguarde alguns minutos e tente novamente.';
  }

  // === SERVER ERRORS ===
  if (
    lowerMsg.includes('internal server error') ||
    lowerMsg.includes('500') ||
    error?.status === 500 ||
    error?.status === 502 ||
    error?.status === 503
  ) {
    return 'Erro no servidor. Por favor, tente novamente mais tarde.';
  }

  // === VALIDATION ERRORS ===
  if (
    lowerMsg.includes('validation') ||
    lowerMsg.includes('valid') ||
    lowerMsg.includes('formato') ||
    lowerMsg.includes('invalid')
  ) {
    if (lowerMsg.includes('email')) {
      return 'Por favor, insira um email válido.';
    }
    if (lowerMsg.includes('password') || lowerMsg.includes('senha')) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
  }

  // === EMAIL ALREADY EXISTS ===
  if (
    lowerMsg.includes('email already exists') ||
    lowerMsg.includes('email já existe') ||
    lowerMsg.includes('duplicate') ||
    lowerMsg.includes('409') ||
    lowerMsg.includes('conflict')
  ) {
    return 'Este email já está registado. Faça login ou use outro email.';
  }

  // === PASSWORD REQUIREMENTS ===
  if (
    lowerMsg.includes('password must') ||
    lowerMsg.includes('senha deve')
  ) {
    if (lowerMsg.includes('6')) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (lowerMsg.includes('uppercase')) {
      return 'A senha deve conter pelo menos uma letra maiúscula.';
    }
    if (lowerMsg.includes('number')) {
      return 'A senha deve conter pelo menos um número.';
    }
    if (lowerMsg.includes('special')) {
      return 'A senha deve conter pelo menos um caractere especial.';
    }
    return 'A senha não atende aos requisitos de segurança.';
  }

  // === MAINTENANCE MODE ===
  if (
    lowerMsg.includes('maintenance') ||
    lowerMsg.includes('manutenção')
  ) {
    return 'O sistema está em manutenção. Tente novamente mais tarde.';
  }

  // === DEFAULT / FALLBACK ===
  // If we have a specific error message, use it
  if (errorMessage && !errorMessage.includes('[object') && errorMessage.length < 100) {
    return errorMessage;
  }

  // Generic fallback
  return 'Falha na autenticação. Por favor, tente novamente.';
};

/**
 * Formats validation errors from form submissions
 * @param errors - Object containing validation errors
 * @returns Formatted error string
 */
export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  const messages: string[] = [];
  
  Object.entries(errors).forEach(([field, fieldErrors]) => {
    fieldErrors.forEach(error => {
      const fieldName = 
        field === 'email' ? 'Email' :
        field === 'password' ? 'Senha' :
        field === 'name' ? 'Nome' :
        field === 'confirmPassword' ? 'Confirmação de senha' :
        field.charAt(0).toUpperCase() + field.slice(1);
      
      messages.push(`${fieldName}: ${error}`);
    });
  });

  return messages.join('\n');
};

/**
 * Checks if error is related to authentication
 * @param error - Error object to check
 * @returns Boolean indicating if error is auth-related
 */
export const isAuthError = (error: any): boolean => {
  const msg = (error?.message || error?.toString() || '').toLowerCase();
  
  return (
    msg.includes('unauthorized') ||
    msg.includes('unauthenticated') ||
    msg.includes('forbidden') ||
    msg.includes('401') ||
    msg.includes('403') ||
    msg.includes('login') ||
    msg.includes('token') ||
    msg.includes('jwt') ||
    msg.includes('session') ||
    msg.includes('credentials')
  );
};

/**
 * Gets HTTP status code from error
 * @param error - Error object
 * @returns HTTP status code or undefined
 */
export const getHttpStatus = (error: any): number | undefined => {
  return error?.response?.status || error?.status || error?.code;
};

/**
 * Checks if error is a network error
 * @param error - Error object
 * @returns Boolean indicating if error is network-related
 */
export const isNetworkError = (error: any): boolean => {
  const msg = (error?.message || '').toLowerCase();
  
  return (
    msg.includes('network') ||
    msg.includes('connection') ||
    msg.includes('failed to fetch') ||
    msg.includes('econnrefused') ||
    msg.includes('econnreset') ||
    msg.includes('timeout') ||
    error?.name === 'NetworkError' ||
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'ETIMEDOUT'
  );
};

/**
 * Creates a user-friendly error message for password reset flow
 * @param error - Error object
 * @returns Formatted error message
 */
export const getPasswordResetErrorMessage = (error: any): string => {
  const msg = (error?.message || error?.toString() || '').toLowerCase();
  
  if (msg.includes('token')) {
    if (msg.includes('expired')) {
      return 'O link de recuperação expirou. Solicite um novo.';
    }
    if (msg.includes('invalid')) {
      return 'O link de recuperação é inválido. Solicite um novo.';
    }
    if (msg.includes('used')) {
      return 'Este link já foi utilizado. Solicite um novo se necessário.';
    }
  }
  
  if (msg.includes('email')) {
    if (msg.includes('not found')) {
      return 'Email não encontrado. Verifique se digitou corretamente.';
    }
  }
  
  return getAuthErrorMessage(error);
};

/**
 * Creates a user-friendly error message for registration flow
 * @param error - Error object
 * @returns Formatted error message
 */
export const getRegistrationErrorMessage = (error: any): string => {
  const msg = (error?.message || error?.toString() || '').toLowerCase();
  
  if (msg.includes('email')) {
    if (msg.includes('already exists') || msg.includes('já existe')) {
      return 'Este email já está registado. Faça login ou use outro email.';
    }
    if (msg.includes('invalid')) {
      return 'Por favor, insira um email válido.';
    }
  }
  
  if (msg.includes('password')) {
    if (msg.includes('6')) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (msg.includes('match') || msg.includes('coincidem')) {
      return 'As senhas não coincidem.';
    }
  }
  
  return getAuthErrorMessage(error);
};