import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Mail, User as UserIcon, Briefcase, Phone, Shield } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

    if (!editingUserId) {
      const emailExists = users.some(u => 
        u.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (emailExists) {
        setError('Este email já está cadastrado no sistema.');
        return false;
      }
    }

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
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          department: formData.department,
          role: formData.role
        };
        
        await updateUser(editingUserId, updateData);
      } else {
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
    <div className="min-h-[calc(90vh-200px)] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl py-4 px-2 sm:px-3">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header com VOLTAR e NOVO UTILIZADOR */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
            disabled={isLoading}
          >
            <X size={18} /> VOLTAR
          </button>
          <h1 className="text-lg sm:text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            {isEditing ? 'EDITAR UTILIZADOR' : 'NOVO UTILIZADOR'}
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form - ajustado para ocupar melhor o espaço */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-4">
            
            {/* NOME COMPLETO */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                NOME COMPLETO
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none font-bold text-sm rounded-lg"
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@empresa.com"
                className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none font-bold text-sm rounded-lg ${
                  isEditing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={isLoading || isEditing}
                required
              />
              {isEditing && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠️ O email não pode ser alterado.
                </p>
              )}
            </div>

            {/* TELEFONE */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                TELEFONE
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+244 999 999 999"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none font-bold text-sm rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* CARGO / POSIÇÃO */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                CARGO / POSIÇÃO
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Desenvolvedor Senior"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none font-bold text-sm rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* DEPARTAMENTO */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                DEPARTAMENTO
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Tecnologia"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none font-bold text-sm rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* PERFIL DE ACESSO */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                PERFIL DE ACESSO
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none font-bold text-sm rounded-lg ${
                  isSelf ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={isLoading || isSelf}
              >
                <option value={UserRole.EMPLOYEE}>Funcionário</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
              {isSelf && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Não pode alterar seu próprio perfil.
                </p>
              )}
            </div>

            {/* Info para novo usuário */}
            {!isEditing && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">NOTA:</span> Uma senha temporária será gerada automaticamente e enviada por email.
                </p>
              </div>
            )}

            {/* Info para edição */}
            {isEditing && !isSelf && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 flex items-center gap-2">
                  <Briefcase size={14} />
                  A editar utilizador: <span className="font-bold">{editingUser?.name}</span>
                </p>
              </div>
            )}

            {/* Botões */}
            <div className="pt-6 flex gap-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 py-3 px-6 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? 'A GUARDAR...' : 'A CRIAR...'}
                  </span>
                ) : (
                  isEditing ? 'GUARDAR ALTERAÇÕES' : 'CRIAR UTILIZADOR'
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose}
                disabled={isLoading}
                className="px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};