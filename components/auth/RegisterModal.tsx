import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../shared/Button';

interface RegisterModalProps {
  onClose: () => void;
}

export const RegisterModal = ({ onClose }: RegisterModalProps) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (registerError) setRegisterError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setRegisterError('Por favor, preencha o nome.');
      return false;
    }
    if (!formData.email.trim()) {
      setRegisterError('Por favor, preencha o email.');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setRegisterError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setRegisterError('As senhas não coincidem.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await register(formData.email, formData.name, formData.password);
      setRegisterSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setRegisterError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Criar Nova Conta</h3>
          <button 
            onClick={() => { 
              setFormData({ name: '', email: '', password: '', confirmPassword: '' }); 
              setRegisterError(null); 
              onClose(); 
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>
        
        {registerSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Conta Criada!</h4>
            <p className="text-slate-600">A redirecionar para o sistema...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {registerError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-rose-700 text-sm">{registerError}</p>
              </div>
            )}
            
            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="nome@empresa.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Senha <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirmar Senha <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme sua senha"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  A criar conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>
            
            <button
              type="button"
              onClick={() => { 
                setFormData({ name: '', email: '', password: '', confirmPassword: '' }); 
                setRegisterError(null); 
                onClose(); 
              }}
              className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};