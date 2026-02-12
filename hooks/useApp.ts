import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  
  return {
    // State
    user: context.user,
    setUser: context.setUser,
    tasks: context.tasks,
    setTasks: context.setTasks,
    users: context.users,
    setUsers: context.setUsers,
    notifications: context.notifications,
    setNotifications: context.setNotifications,
    systemActivities: context.systemActivities,
    setSystemActivities: context.setSystemActivities,
    view: context.view,
    setView: context.setView,
    activeTab: context.activeTab,
    setActiveTab: context.setActiveTab,
    lang: context.lang,
    setLang: context.setLang,
    theme: context.theme,
    setTheme: context.setTheme,
    isLoading: context.isLoading,
    setIsLoading: context.setIsLoading,
    
    // Auth
    login: context.login,
    logout: context.logout,
    register: context.register,
    validateSetupToken: context.validateSetupToken,
    setupPassword: context.setupPassword,
    validateResetToken: context.validateResetToken,
    resetPassword: context.resetPassword,
    
    // Tasks
    createTask: context.createTask,
    updateTask: context.updateTask,
    deleteTask: context.deleteTask,
    handleAdvanceStatus: context.handleAdvanceStatus,
    handleDeleteTask: context.handleDeleteTask,
    addComment: context.addComment,
    filterTasks: context.filterTasks,
    filteredTasks: context.filteredTasks,
    
    // Users
    loadUsers: context.loadUsers,
    createUser: context.createUser,
    updateUser: context.updateUser,
    deleteUser: context.deleteUser,
    
    // Notifications
    addNotification: context.addNotification,
    markAllNotificationsAsRead: context.markAllNotificationsAsRead,
    
    // Activities
    addSystemActivity: context.addSystemActivity,
    
    // Data
    loadDataFromAPI: context.loadDataFromAPI,
    
    // Utils
    getAvatarUrl: context.getAvatarUrl,
    saveAvatar: context.saveAvatar,
    openAvatarUpload: context.openAvatarUpload
  };
};