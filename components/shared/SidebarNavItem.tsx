import React from 'react';

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export const SidebarNavItem = ({ 
  icon, 
  label, 
  active, 
  collapsed, 
  onClick 
}: SidebarNavItemProps) => {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all group relative 
        ${active 
          ? 'bg-[#10b981] text-white shadow-xl shadow-emerald-500/20' 
          : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
        }`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      {!collapsed && (
        <span className="text-[11px] font-black uppercase tracking-widest animate-in font-bold">
          {label}
        </span>
      )}
    </button>
  );
};