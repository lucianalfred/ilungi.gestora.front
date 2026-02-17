import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'slate';
  fullScreen?: boolean;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'emerald', 
  fullScreen = false,
  text = 'Carregando...'
}: LoadingSpinnerProps) => {
  
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    emerald: 'border-emerald-500 border-t-transparent',
    blue: 'border-blue-500 border-t-transparent',
    slate: 'border-slate-500 border-t-transparent'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <span className="text-sm text-slate-600 dark:text-slate-400">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// LoadingOverlay para usar em cards ou áreas específicas
export const LoadingOverlay = ({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) => {
  if (!isLoading) return <>{children}</>;
  
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <LoadingSpinner size="sm" />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};