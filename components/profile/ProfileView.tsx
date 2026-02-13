import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Button } from '../shared/Button';
import { UserIcon, Lock, CheckCircle2, AlertTriangle, Pencil } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { apiUsers, apiAdminUsers } from '../../services/apiService';
import { logger } from '../../services/logger';

interface ProfileViewProps {
  user: User;
  users: User[];
  setUsers: (users: User[]) => void;
  setUser: (user: User | null) => void;
  profilePassword: string;
  setProfilePassword: (password: string) => void;
  profilePasswordConfirm: string;
  setProfilePasswordConfirm: (password: string) => void;
  profilePasswordError: string | null;
  setProfilePasswordError: (error: string | null) => void;
  profilePasswordSuccess: string | null;
  setProfilePasswordSuccess: (success: string | null) => void;
  setActiveTabSafe: (tab: string) => void;
  onAvatarUpload: (userId: string) => void;
  getAvatarUrl: (user: User) => string | null;
  updateUser: (userId: string, userData: any) => Promise<void>;
  addNotification: (userId: string, message: string, type?: 'info' | 'success' | 'error') => Promise<void>;
}

export const ProfileView = ({
  user,
  users,
  setUsers,
  setUser,
  profilePassword,
  setProfilePassword,
  profilePasswordConfirm,
  setProfilePasswordConfirm,
  profilePasswordError,
  setProfilePasswordError,
  profilePasswordSuccess,
  setProfilePasswordSuccess,
  setActiveTabSafe,
  onAvatarUpload,
  getAvatarUrl,
  updateUser,
  addNotification
}: ProfileViewProps) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const updates: Partial<User> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };

    // Apenas admin pode atualizar estes campos
    if (user.role === UserRole.ADMIN) {
      updates.position = formData.get('position') as string;
      updates.department = formData.get('department') as string;
      updates.role = (formData.get('role') as UserRole) || user.role;
    }

    try {
      // Validar se não-admin está tentando alterar email
      if (user.role !== UserRole.ADMIN && updates.email !== user.email) {
        addNotification(user.id, 'O email só pode ser alterado por um administrador.', 'error');
        return;
      }

      // Atualizar perfil
      if (user.role === UserRole.ADMIN) {
        await apiUsers.update(user.id, { name: updates.name, email: updates.email });
      } else {
        await apiUsers.updateProfile(user.id, { name: updates.name });
      }

      // Atualizar role se admin
      if (updates.role && updates.role !== user.role) {
        await apiAdminUsers.changeRole(user.id, updates.role);
      }

      // Atualizar estado local
      const updatedUser = { ...user, ...updates };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      setUser(updatedUser);
      
      addNotification(user.id, 'Perfil atualizado com sucesso.', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      logger.warn('User', 'Erro ao atualizar perfil na API', error);
      addNotification(user.id, 'Não foi possível atualizar o perfil na API.', 'error');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePasswordError(null);
    setProfilePasswordSuccess(null);

    if (!profilePassword.trim()) {
      setProfilePasswordError('Preencha a nova senha.');
      return;
    }

    if (profilePassword.trim().length < 6) {
      setProfilePasswordError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (profilePassword !== profilePasswordConfirm) {
      setProfilePasswordError('As senhas não coincidem.');
      return;
    }

    try {
      await apiUsers.changePassword(user.id, profilePassword);
      
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      
      setProfilePassword('');
      setProfilePasswordConfirm('');
      setProfilePasswordSuccess('Senha atualizada com sucesso.');
      
      // Se estava em modo de força de mudança de senha, redirecionar
      if (user.mustChangePassword) {
        setTimeout(() => setActiveTabSafe('dashboard'), 2000);
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      logger.warn('User', 'Erro ao atualizar senha na API', error);
      setProfilePasswordError('Não foi possível atualizar a senha na API.');
    }
  };

  const startEditing = () => {
    setEditedUser({
      name: user.name,
      email: user.email,
      position: user.position,
      department: user.department,
      role: user.role
    });
    setIsEditing(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black">{t.myProfile}</h3>
        {!isEditing && !user.mustChangePassword && (
          <button
            onClick={startEditing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Pencil size={16} />
            Editar Perfil
          </button>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        {user?.mustChangePassword && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            Por segurança, altere sua senha para continuar.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Avatar */}
          <button 
            type="button" 
            onClick={() => onAvatarUpload(user.id)} 
            className="flex-shrink-0 w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden self-center sm:self-start hover:opacity-80 transition-opacity group relative"
          >
            {getAvatarUrl(user) ? (
              <img src={getAvatarUrl(user)!} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={40} className="text-slate-400" />
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Alterar</span>
            </div>
          </button>

          {/* Form */}
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    {t.name}
                  </label>
                  <input 
                    name="name" 
                    defaultValue={user.name} 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    {t.email}
                  </label>
                  <input 
                    name="email" 
                    type="email" 
                    defaultValue={user.email} 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                    required 
                    disabled={user.role !== UserRole.ADMIN}
                  />
                  {user.role !== UserRole.ADMIN && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Contacte um administrador para alterar o email.
                    </p>
                  )}
                </div>

                {user.role === UserRole.ADMIN && (
                  <>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        {t.position}
                      </label>
                      <input 
                        name="position" 
                        defaultValue={user.position} 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        {t.department}
                      </label>
                      <input 
                        name="department" 
                        defaultValue={user.department} 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" 
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                        Função
                      </label>
                      <select 
                        name="role" 
                        defaultValue={user.role} 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
                      >
                        <option value={UserRole.EMPLOYEE}>Funcionário</option>
                        <option value={UserRole.ADMIN}>Administrador</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">
                    {t.save}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                  >
                    {t.cancel}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">{t.name}</p>
                  <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">{t.email}</p>
                  <p className="font-bold text-slate-900 dark:text-white">{user.email}</p>
                </div>
                {user.position && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">{t.position}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{user.position}</p>
                  </div>
                )}
                {user.department && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">{t.department}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{user.department}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Função</p>
                  <p className="font-bold text-[#10b981] uppercase text-xs">
                    {user.role === UserRole.ADMIN ? 'Administrador' : 'Funcionário'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h4 className="text-base font-black mb-4">Alterar Senha</h4>
        
        {profilePasswordError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={16} />
              <p>{profilePasswordError}</p>
            </div>
          </div>
        )}
        
        {profilePasswordSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0" size={16} />
              <p>{profilePasswordSuccess}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Nova senha
            </label>
            <div className="relative">
              <input
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
                placeholder="Mínimo 6 caracteres"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Confirmar senha
            </label>
            <div className="relative">
              <input
                value={profilePasswordConfirm}
                onChange={(e) => setProfilePasswordConfirm(e.target.value)}
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
                placeholder="Repita a senha"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button type="submit" className="flex-1">
              Atualizar senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};