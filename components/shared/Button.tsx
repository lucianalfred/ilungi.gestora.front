import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const variants = {
  primary: 'bg-[#10b981] hover:bg-[#059669] text-white shadow-xl shadow-emerald-500/20',
  secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
  outline: 'bg-transparent border-2 border-[#10b981] text-[#10b981] hover:bg-emerald-50',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
};

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button', 
  disabled = false 
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-8 py-4 rounded-2xl font-bold text-[14px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};