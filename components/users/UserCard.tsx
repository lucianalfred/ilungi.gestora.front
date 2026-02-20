import React from 'react';
import { User, UserRole } from '../../types';
import { User as UserIcon, Pencil, Trash2, Mail, Briefcase, Shield, Star, Phone, Calendar } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface UserCardProps {
  user: User;
  currentUser: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => Promise<void>;
  onAvatarUpload: (userId: string) => void;
  getAvatarUrl: (user: User) => string | null;
}

export const UserCard = ({ 
  user, 
  currentUser, 
  onEdit, 
  onDelete, 
  onAvatarUpload,
  getAvatarUrl 
}: UserCardProps) => {
  const { t } = useLanguage();
  const isCurrentUser = currentUser.id === user.id;
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const canEdit = isAdmin && !isCurrentUser;
  const canDelete = isAdmin && !isCurrentUser;

  // Formatar data de criação
  const createdAt = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('pt-PT', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
    : null;

  // Formatar telefone
  const formatPhone = (phone?: string) => {
    if (!phone) return null;
    return phone;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
      


      <div className="flex gap-4">
        {/* Avatar */}
        <button 
          type="button" 
          onClick={() => isAdmin && onAvatarUpload(user.id)} 
          className={`flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden
            ${isAdmin ? 'cursor-pointer hover:opacity-80 transition-opacity group relative' : 'cursor-default'}`}
          disabled={!isAdmin}
          title={isAdmin ? "Clique para alterar avatar" : undefined}
        >
          {getAvatarUrl(user) ? (
            <img 
              src={getAvatarUrl(user)!} 
              alt={user.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback se a imagem falhar ao carregar
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-slate-400" ...></div>';
              }}
            />
          ) : (
            <UserIcon size={32} className="text-slate-400" />
          )}
          {isAdmin && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <span className="text-white text-xs font-bold">Alterar</span>
            </div>
          )}
        </button>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-black text-slate-900 dark:text-white truncate max-w-[150px]">
                  {user.name}
                </p>
                {isCurrentUser && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                    Você
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {user.role === UserRole.ADMIN ? (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Administrador
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Funcionário
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            {(canEdit || canDelete) && (
              <div className="flex gap-1 ml-2">
                {canEdit && (
                  <button 
                    onClick={() => onEdit(user.id)} 
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
                    title="Editar utilizador"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                {canDelete && (
                  <button 
                    onClick={() => onDelete(user.id)} 
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800 transition-colors"
                    title="Eliminar utilizador"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <Mail size={14} className="flex-shrink-0" />
            <span className="truncate hover:text-slate-700 dark:hover:text-slate-300 transition-colors" title={user.email}>
              {user.email}
            </span>
          </div>

          {/* Phone */}
          {formatPhone(user.phone) && (
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <Phone size={14} className="flex-shrink-0" />
              <span className="truncate">{formatPhone(user.phone)}</span>
            </div>
          )}

          {/* Position */}
          {user.position && (
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
              <Briefcase size={14} className="flex-shrink-0" />
              <span className="truncate">{user.position}</span>
            </div>
          )}

          {/* Department */}
          {user.department && (
            <div className="mt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {user.department}
              </span>
            </div>
          )}

          {/* Created At */}
          {createdAt && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[9px] text-slate-400">
                <Calendar size={12} />
                <span>Membro desde {createdAt}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};