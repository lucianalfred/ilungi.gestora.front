import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useUsers = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useUsers must be used within AppProvider');
  }
  
  return {
    user: context.user,
    setUser: context.setUser,
    users: context.users,
    setUsers: context.setUsers,
    loadUsers: context.loadUsers,
    createUser: context.createUser,
    updateUser: context.updateUser,
    deleteUser: context.deleteUser,
    getAvatarUrl: context.getAvatarUrl,
    saveAvatar: context.saveAvatar,
    openAvatarUpload: context.openAvatarUpload
  };
};