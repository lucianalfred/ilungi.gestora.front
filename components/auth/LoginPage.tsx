import React, { useState, useEffect } from 'react';
import { 
  Workflow, Mail, Lock, AlertTriangle, UserPlus, 
  ChevronLeft, X, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { RegisterModal } from './RegisterModal';
import { Button } from '../shared/Button';
import { getAuthErrorMessage } from '../../utils/authErrors';
import { UserRole } from '../../types';

export const LoginPage = () => {
  const { login, isLoading, setIsLoading } = useAuth();
  const { setView } = useNavigation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const savedEmail = localStorage.getItem('gestora_remember_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      localStorage.setItem('gestora_remember_email', formData.email);
    } else {
      localStorage.removeItem('gestora_remember_email');
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setErrorMessage('Por favor, preencha o campo de email.');
      return false;
    }
    if (!formData.password.trim()) {
      setErrorMessage('Por favor, preencha o campo de senha.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Por favor, insira um email válido.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(formData.email, formData.password, rememberMe);
    } catch (error: any) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex p-3 sm:p-4 bg-emerald-500 rounded-2xl shadow-lg mb-4 sm:mb-6">
            <Workflow size={28} className="sm:w-9 sm:h-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">GESTORA</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Professional Workflow Management</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Acesso ao Sistema</h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8">
            Entre com suas credenciais corporativas
          </p>

          {errorMessage && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-rose-700 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email Corporativo <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nome@empresa.com"
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border ${
                    errorMessage && !formData.email 
                      ? 'border-rose-300 focus:border-rose-500' 
                      : 'border-slate-300 focus:border-emerald-500'
                  } rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-900 outline-none transition-all text-sm`}
                  disabled={isLoading}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Senha <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border ${
                    errorMessage && !formData.password 
                      ? 'border-rose-300 focus:border-rose-500' 
                      : 'border-slate-300 focus:border-emerald-500'
                  } rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-900 outline-none transition-all text-sm`}
                  disabled={isLoading}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500/20" 
                  disabled={isLoading}
                />
                <span className="text-sm text-slate-600">Lembrar-me</span>
              </label>
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:text-slate-400"
                disabled={isLoading}
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Autenticando...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">Não tem uma conta?</p>
            <button
              onClick={() => setShowRegister(true)}
              disabled={isLoading}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:text-slate-400 transition-colors flex items-center justify-center gap-2 mx-auto mt-2"
            >
              <UserPlus size={16} />
              Criar conta
            </button>
          </div>

          {/* Back to Landing */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => setView('landing')}
              disabled={isLoading}
              className="text-sm text-slate-500 hover:text-slate-700 disabled:text-slate-400 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ChevronLeft size={16} />
              Voltar para o início
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs text-slate-400">
            © 2026 GESTORA • Sistema de Gestão de Tarefas
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Suporte: suporte@gestora.com
          </p>
        </div>
      </div>

      {/* Modals */}
      {showForgotPassword && (
        <ForgotPasswordModal 
          onClose={() => setShowForgotPassword(false)} 
        />
      )}

      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)} 
        />
      )}
    </div>
  );
};