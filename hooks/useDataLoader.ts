import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useDataLoader = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useDataLoader must be used within AppProvider');
  }
  
  return {
    loadDataFromAPI: context.loadDataFromAPI,
    isLoading: context.isLoading,
    setIsLoading: context.setIsLoading
  };
};