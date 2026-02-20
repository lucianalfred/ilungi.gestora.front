import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useNotifications = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within AppProvider');
  }
  
  return {
    notifications: context.notifications,
    setNotifications: context.setNotifications,
    addNotification: context.addNotification,
    markAllNotificationsAsRead: context.markAllNotificationsAsRead,
    markNotificationAsRead: context.markNotificationAsRead
  };
};