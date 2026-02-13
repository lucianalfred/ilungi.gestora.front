import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Mail, User as UserIcon, Briefcase, Phone, Shield, Star } from 'lucide-react';
import { Button } from '../shared/Button';
import { User, UserRole } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { useUsers } from '../../hooks/useUsers';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUserId?: string | null;
  users: User[];
  currentUser: User;
}

export const UserModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingUserId, 
  users, 
  currentUser 
}: UserModalProps) => {
  const { t } = useLanguage();
  const { createUser, updateUser } = useUsers();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    role: UserRole.EMPLOYEE
  });

  const editingUser = editingUserId 
    ? users.find(u => u.id === editingUserId) 
    : null;

  // Carregar dados do usuário quando estiver editando
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        phone: editingUser.phone || '',
        position: editingUser.position || '',
        department: editingUser.department || '',
        role: editingUser.role || UserRole.EMPLOYEE
      });
    } else {
      // Reset form quando for criar novo
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        role: UserRole.EMPLOYEE
      });
    }
    setError(null);
  }, [editingUser, editingUserId]);

  // Validar formulário
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Por favor, preencha o nome.');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Por favor, preencha o email.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido.');
      return false;
    }

    // Verificar email duplicado (apenas para criação)
    if (!editingUserId) {
      const emailExists = users.some(u => 
        u.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (emailExists) {
        setError('Este email já está cadastrado no sistema.');
        return false;
      }
    }

    // Validar telefone (opcional)
    if (formData.phone) {
      const phoneRegex = /^[0-9+\-\s()]{9,}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Por favor, insira um número de telefone válido.');
        return false;
      }
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (editingUserId) {
        // Atualizar usuário existente
        await updateUser(editingUserId, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          department: formData.department,
          role: formData.role
        });
      } else {
        // Criar novo usuário
        await createUser(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar utilizador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = !!editingUserId;
  const isSelf = editingUserId === currentUser.id;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              {isEditing ? (
                <Briefcase size={20} className="text-emerald-600" />
              ) : (
                <UserIcon size={20} className="text-emerald-600" />
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isEditing ? 'Editar Utilizador' : 'Novo Utilizador'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-rose-700 text-sm mb-1">Erro de validação</h4>
                <p className="text-rose-600 text-xs">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nome */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="João Silva"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                disabled={isLoading}
                required
                autoFocus
              />
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="joao@empresa.com"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-sm ${
                  isEditing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={isLoading || isEditing}
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            {isEditing && (
              <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1">
                ⚠️ O email não pode ser alterado.
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Telefone
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+244 999 999 999"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                disabled={isLoading}
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {/* Cargo/Posição */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Cargo / Posição
            </label>
            <div className="relative">
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Desenvolvedor Senior"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                disabled={isLoading}
              />
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Departamento
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Tecnologia"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Função/Role */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">
              Perfil de Acesso
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-sm appearance-none ${
                  isSelf ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={isLoading || isSelf}
              >
                <option value={UserRole.EMPLOYEE}>Funcionário</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {formData.role === UserRole.ADMIN ? (
                  <Shield size={16} className="text-emerald-500" />
                ) : (
                  <Star size={16} className="text-blue-500" />
                )}
              </div>
            </div>
            {isSelf && (
              <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <AlertTriangle size={10} />
                Não pode alterar seu próprio perfil.
              </p>
            )}
          </div>

          {/* Info para novo usuário */}
          {!isEditing && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-start gap-2">
                <Shield size={14} className="flex-shrink-0 mt-0.5" />
                <span>
                  <span className="font-bold">Nota:</span> Uma senha temporária será gerada automaticamente e enviada por email para o utilizador.
                </span>
              </p>
            </div>
          )}

          {/* Info para edição */}
          {isEditing && !isSelf && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <p className="text-[9px] text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Briefcase size={12} />
                A editar utilizador: <span className="font-bold">{editingUser?.name}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? 'A guardar...' : 'A criar...'}
                </>
              ) : (
                isEditing ? 'Guardar Alterações' : 'Criar Utilizador'
              )}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};