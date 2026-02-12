import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import { Button } from '../shared/Button';

export const SetPasswordPage = () => {
  const { validateSetupToken, setupPassword } = useAuth();
  const { setView } = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<{name: string, email: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setIsTokenValid(false);
      setErrorMessage('Link inválido ou incompleto.');
      setIsValidating(false);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    try {
      setIsValidating(true);
      const data = await validateSetupToken(tokenToValidate);
      
      if (data.valid) {
        setIsTokenValid(true);
        setUserInfo({
          name: data.user?.name || '',
          email: data.user?.email || ''
        });
      } else {
        setIsTokenValid(false);
        setErrorMessage(data.error || 'Token inválido ou expirado.');
      }
    } catch (error: any) {
      setIsTokenValid(false);
      setErrorMessage(error.message || 'Erro ao validar token. Tente novamente.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword.trim()) {
      setErrorMessage('Por favor, preencha a senha.');
      return;
    }

    if (newPassword.trim().length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!token) {
      setErrorMessage('Token inválido. Solicite um novo link.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await setupPassword(token, newPassword, confirmPassword);
      setSuccessMessage(data.message || 'Senha definida com sucesso!');
      
      // Clean URL
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        setView('login');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao definir senha.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Validando token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex p-3 sm:p-4 bg-emerald-500 rounded-2xl shadow-lg mb-4 sm:mb-6">
            <Lock size={28} className="sm:w-9 sm:h-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">Definir Senha</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Configure sua palavra-passe de acesso</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200">
          {!isTokenValid && (
            <div className="space-y-4">
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={16} />
                  <p className="text-rose-700 text-sm">{errorMessage || 'Link inválido ou expirado.'}</p>
                </div>
              </div>
              <Button onClick={() => setView('login')} className="w-full">
                Voltar para Login
              </Button>
            </div>
          )}

          {successMessage && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-700 text-sm">{successMessage}</p>
              </div>
              <Button onClick={() => setView('login')} className="w-full">
                Ir para login
              </Button>
            </div>
          )}

          {isTokenValid && !successMessage && (
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {userInfo && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    Bem-vindo, <span className="font-bold">{userInfo.name}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{userInfo.email}</p>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <p className="text-rose-700 text-sm">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Nova senha <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-300 focus:border-emerald-500 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-900 outline-none transition-all text-sm"
                    disabled={isLoading}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Confirmar senha <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-300 focus:border-emerald-500 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-900 outline-none transition-all text-sm"
                    disabled={isLoading}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-3.5"
              >
                {isLoading ? 'Definindo...' : 'Definir senha'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
