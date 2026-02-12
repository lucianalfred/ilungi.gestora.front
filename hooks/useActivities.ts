import { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { UserRole } from '../types';

export const useActivities = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useActivities must be used within AppProvider');
  }
  
  const visibleActivities = useMemo(() => {
    if (!context.user) return [];
    if (context.user.role === UserRole.ADMIN) return context.systemActivities;
    
    const myTaskIds = new Set(
      context.tasks
        .filter(t => t.responsibleId === context.user?.id || t.intervenientes?.includes(context.user?.id))
        .map(t => t.id)
    );
    
    return context.systemActivities.filter(a => myTaskIds.has(a.entityId));
  }, [context.systemActivities, context.tasks, context.user]);
  
  return {
    systemActivities: context.systemActivities,
    setSystemActivities: context.setSystemActivities,
    addSystemActivity: context.addSystemActivity,
    visibleActivities
  };
};