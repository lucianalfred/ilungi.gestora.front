import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useAuth = () => {
  const context = useContext(AppContext);
  
  // ✅ IMPORTANTE: Verificar se o contexto existe
  if (!context) {
    throw new Error('useAuth must be used within AppProvider');
  }
  
  // ✅ VERIFICAR SE TODAS AS FUNÇÕES EXISTEM
  console.log('🔍 useAuth - contexto carregado:', {
    hasUser: !!context.user,
    hasLogin: !!context.login,
    hasLogout: !!context.logout,
    hasRegister: !!context.register
  });

  return {
    user: context.user,
    setUser: context.setUser,
    login: context.login,           // ✅ DEVE EXISTIR
    logout: context.logout,         // ✅ DEVE EXISTIR
    register: context.register,     // ✅ DEVE EXISTIR
    isLoading: context.isLoading,
    setIsLoading: context.setIsLoading,
    validateSetupToken: context.validateSetupToken,
    setupPassword: context.setupPassword,
    validateResetToken: context.validateResetToken,
    resetPassword: context.resetPassword
  };
};