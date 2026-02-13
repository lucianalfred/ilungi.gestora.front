import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Button } from '../shared/Button';
import { UserCard } from './UserCard';
import { UserModal } from './UserModal';
import { Plus, Search, Users as UsersIcon } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { TRANSLATIONS } from '../../constants';

interface UsersViewProps {
  users: User[];
  currentUser: User;
  onUpdateUser: (userId: string, userData: any) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onAvatarUpload: (userId: string) => void;
  getAvatarUrl: (user: User) => string | null;
}

export const UsersView = ({ 
  users, 
  currentUser, 
  onUpdateUser, 
  onDeleteUser, 
  onAvatarUpload,
  getAvatarUrl 
}: UsersViewProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormError, setUserFormError] = useState<string | null>(null);

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.position && user.position.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Ordenar: admins primeiro, depois por nome
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.role === UserRole.ADMIN && b.role !== UserRole.ADMIN) return -1;
    if (a.role !== UserRole.ADMIN && b.role === UserRole.ADMIN) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleEditUser = (userId: string) => {
    setEditingUserId(userId);
    setUserFormError(null);
  };

  const handleCloseEdit = () => {
    setEditingUserId(null);
    setUserFormError(null);
  };

  const handleCloseAdd = () => {
    setIsAddUserOpen(false);
    setUserFormError(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-black">Gestão de Utilizadores</h3>
        <Button 
          onClick={() => setIsAddUserOpen(true)} 
          className="px-6 py-3"
        >
          <Plus size={18}/> {t.addUser}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 lg:flex-initial">
            <input 
              placeholder="Pesquisar por nome, email ou cargo..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all w-full lg:min-w-[400px] font-bold text-sm shadow-sm"
            />
            <Search className="absolute left-4 top-4.5 text-slate-300" size={18} />
          </div>
          
          {/* Role Filter */}
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-slate-500 outline-none cursor-pointer shadow-sm"
          >
            <option value="all">Todos os perfis</option>
            <option value={UserRole.ADMIN}>Administradores</option>
            <option value={UserRole.EMPLOYEE}>Funcionários</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-400">
              {users.filter(u => u.role === UserRole.ADMIN).length} Administradores
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-slate-600 dark:text-slate-400">
              {users.filter(u => u.role === UserRole.EMPLOYEE).length} Funcionários
            </span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {sortedUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedUsers.map(u => (
            <UserCard 
              key={u.id}
              user={u}
              currentUser={currentUser}
              onEdit={handleEditUser}
              onDelete={onDeleteUser}
              onAvatarUpload={onAvatarUpload}
              getAvatarUrl={getAvatarUrl}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon size={32} className="text-slate-400" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Nenhum utilizador encontrado
          </h4>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchQuery || roleFilter !== 'all' 
              ? 'Tente ajustar os filtros de pesquisa.'
              : 'Clique no botão "Adicionar Utilizador" para começar.'}
          </p>
          {!searchQuery && roleFilter === 'all' && (
            <Button onClick={() => setIsAddUserOpen(true)}>
              <Plus size={18}/> Adicionar Utilizador
            </Button>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <UserModal
          isOpen={isAddUserOpen}
          onClose={handleCloseAdd}
          onSuccess={() => {
            handleCloseAdd();
          }}
          users={users}
          currentUser={currentUser}
        />
      )}

      {/* Edit User Modal */}
      {editingUserId && (
        <UserModal
          isOpen={!!editingUserId}
          onClose={handleCloseEdit}
          editingUserId={editingUserId}
          onSuccess={handleCloseEdit}
          users={users}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};