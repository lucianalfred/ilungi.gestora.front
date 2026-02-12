import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';

export const useLanguage = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within AppProvider');
  }
  
  const t = TRANSLATIONS[context.lang];
  
  return {
    lang: context.lang,
    setLang: context.setLang,
    t
  };
};