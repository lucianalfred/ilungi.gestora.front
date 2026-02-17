import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiAuth } from '../../services/apiService';
import { Button } from '../shared/Button';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export const ForgotPasswordModal = ({ onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      setMessage('Por favor, insira o seu email.');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Por favor, insira um email válido.');
      return;
    }

    setMessage('Processando...');
    setIsLoading(true);

    try {
      // ✅ Agora o método existe!
      const response = await apiAuth.forgotPassword(email);
      
      // Verificar a resposta
      if (response && response.message) {
        setMessage(`✅ ${response.message}`);
      } else {
        setMessage(
          `✅ Solicitação enviada com sucesso! Se o email ${email} estiver cadastrado, você receberá instruções em instantes.`
        );
      }
      
      // Fechar o modal após 5 segundos
      setTimeout(() => {
        onClose();
      }, 5000);
      
    } catch (error: any) {
      console.error('❌ Erro no forgot password:', error);
      
      // Mensagem de erro mais amigável
      if (error.message?.includes('404')) {
        setMessage('❌ Endpoint de recuperação não encontrado. Contacte o administrador.');
      } else if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        setMessage('❌ Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setMessage(`❌ ${error.message || 'Erro ao solicitar recuperação de senha.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Recuperar Senha</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <p className="text-sm text-slate-600 mb-6">
          Digite o seu email para receber um link de recuperação de senha.
        </p>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : message.includes('❌')
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3"
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </Button>
          
          <button
            onClick={onClose}
            className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};