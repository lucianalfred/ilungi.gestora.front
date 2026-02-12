import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useNavigation = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useNavigation must be used within AppProvider');
  }
  
  return {
    view: context.view,
    setView: context.setView,
    activeTab: context.activeTab,
    setActiveTab: context.setActiveTab
  };
};