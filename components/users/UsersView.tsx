import React, { useState, useMemo } from 'react';
import { Plus, Search, Users as UsersIcon, Filter, ChevronDown } from 'lucide-react';
import { Button } from '../shared/Button';
import { UserCard } from './UserCard';
import { UserModal } from './UserModal';
import { LoadingSpinner, LoadingOverlay } from '../shared/LoadingSpinner';
import { useLanguage } from '../../hooks/useLanguage';
import { User, UserRole } from '../../types'; // ✅ Importar do types, não do apiService

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
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar usuários
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.position && user.position.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Ordenar: admins primeiro, depois por nome
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (a.role === UserRole.ADMIN && b.role !== UserRole.ADMIN) return -1;
      if (a.role !== UserRole.ADMIN && b.role === UserRole.ADMIN) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filteredUsers]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === UserRole.ADMIN).length,
    employees: users.filter(u => u.role === UserRole.EMPLOYEE).length
  }), [users]);

  const handleEditUser = (userId: string) => {
    setEditingUserId(userId);
  };

  const handleCloseEdit = () => {
    setEditingUserId(null);
  };

  const handleCloseAdd = () => {
    setIsAddUserOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Carregando utilizadores..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in">
      
      {/* Header com estatísticas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Gestão de Utilizadores
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total: {stats.total} utilizadores ({stats.admins} admin, {stats.employees} funcionários)
          </p>
        </div>
        <Button 
          onClick={() => setIsAddUserOpen(true)} 
          className="px-6 py-3"
        >
          <Plus size={18} className="mr-2"/> Adicionar Utilizador
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input 
              placeholder="Pesquisar por nome, email ou cargo..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          
          {/* Role Filter */}
          <div className="relative min-w-[200px]">
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer font-medium text-sm"
            >
              <option value="all">Todos os perfis</option>
              <option value={UserRole.ADMIN}>Administradores</option>
              <option value={UserRole.EMPLOYEE}>Funcionários</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <LoadingOverlay isLoading={isLoading}>
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
      </LoadingOverlay>

      {/* Modals */}
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