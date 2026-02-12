import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, CheckCircle2, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import { Button } from '../shared/Button';

export const PasswordResetPage = () => {
  const { validateResetToken, resetPassword } = useAuth();
  const { setView } = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'verify-token' | 'reset-form'>('verify-token');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setIsTokenValid(false);
      setErrorMessage('Link inválido ou expirado. Solicite um novo link.');
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    try {
      setIsLoading(true);
      const data = await validateResetToken(tokenToValidate);
      
      if (data.valid) {
        setIsTokenValid(true);
        setEmail(data.user?.email || '');
        setStep('reset-form');
      } else {
        setIsTokenValid(false);
        setErrorMessage(data.error || 'Token inválido ou expirado.');
      }
    } catch (error) {
      setIsTokenValid(false);
      setErrorMessage('Erro ao validar token. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword.trim()) {
      setErrorMessage('Por favor, preencha a nova senha.');
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

    setIsLoading(true);

    try {
      const data = await resetPassword(token!, newPassword, confirmPassword);
      setSuccessMessage(data.message || 'Senha redefinida com sucesso!');
      
      setTimeout(() => {
        setView('login');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao redefinir senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = () => {
    setView('login');
  };

  if (isLoading && step === 'verify-token') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Validando token...</p>
        </div>
      </div>
    );
  }

  if (step === 'verify-token') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex p-3 sm:p-4 bg-emerald-500 rounded-2xl shadow-lg mb-4 sm:mb-6">
              <Lock size={28} className="sm:w-9 sm:h-9 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">Redefinir Senha</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Verificando link de segurança</p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200">
            {isTokenValid === false && (
              <>
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-bold text-rose-700 text-sm mb-1">Link Inválido</h3>
                      <p className="text-rose-600 text-xs">{errorMessage}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-600 text-sm mb-2">Possíveis causas:</p>
                    <ul className="text-slate-500 text-xs space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>O link expirou (válido por 2 horas)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>O link já foi utilizado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>Link incorreto ou incompleto</span>
                      </li>
                    </ul>
                  </div>

                  <Button onClick={handleResendLink} className="w-full">
                    Solicitar Novo Link
                  </Button>

                  <button
                    onClick={() => setView('login')}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-sm"
                  >
                    Voltar para Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex p-3 sm:p-4 bg-emerald-500 rounded-2xl shadow-lg mb-4 sm:mb-6">
            <Lock size={28} className="sm:w-9 sm:h-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">Nova Senha</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Digite sua nova senha para {email}</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200">
          {successMessage ? (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-bold text-emerald-700 text-sm mb-1">Senha Redefinida!</h3>
                    <p className="text-emerald-600 text-xs">{successMessage}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 text-sm">Redirecionando para login...</p>
              </div>

              <Button onClick={() => setView('login')} className="w-full">
                Ir para Login Agora
              </Button>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-rose-700 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmitReset}>
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
                      placeholder="Digite novamente a senha"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-300 focus:border-emerald-500 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-900 outline-none transition-all text-sm"
                      disabled={isLoading}
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-600 text-xs font-medium mb-2">Requisitos da senha:</p>
                  <ul className="text-slate-500 text-xs space-y-1">
                    <li className={`flex items-center gap-2 ${newPassword.length >= 6 ? 'text-emerald-600' : ''}`}>
                      <Check size={12} className={newPassword.length >= 6 ? 'text-emerald-500' : 'text-slate-300'} />
                      <span>Mínimo 6 caracteres</span>
                    </li>
                    <li className={`flex items-center gap-2 ${newPassword === confirmPassword && newPassword ? 'text-emerald-600' : ''}`}>
                      <Check size={12} className={newPassword === confirmPassword && newPassword ? 'text-emerald-500' : 'text-slate-300'} />
                      <span>As senhas coincidem</span>
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Redefinindo senha...
                    </>
                  ) : (
                    'Redefinir Senha'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setView('login')}
                  disabled={isLoading}
                  className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-sm disabled:text-slate-400 transition-colors"
                >
                  Voltar para Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};