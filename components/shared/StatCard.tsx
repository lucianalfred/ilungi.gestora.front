import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'emerald' | 'rose';
}

const bgColors = { 
  emerald: 'bg-emerald-50 dark:bg-emerald-900/10', 
  rose: 'bg-rose-50 dark:bg-rose-900/10' 
};

export const StatCard = ({ icon, label, value, color }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all">
      <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center ${bgColors[color] || 'bg-slate-50'} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mt-1">{value}</p>
      </div>
    </div>
  );
};