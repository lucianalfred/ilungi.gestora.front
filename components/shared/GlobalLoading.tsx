// src/components/shared/GlobalLoading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const GlobalLoading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
        <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          A carregar...
        </p>
      </div>
    </div>
  );
};