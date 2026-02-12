import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within AppProvider');
  }
  return {
    user: context.user,
    setUser: context.setUser,
    login: context.login,
    logout: context.logout,
    register: context.register,
    isLoading: context.isLoading,
    setIsLoading: context.setIsLoading,
    validateSetupToken: context.validateSetupToken,
    setupPassword: context.setupPassword,
    validateResetToken: context.validateResetToken,
    resetPassword: context.resetPassword
  };
};