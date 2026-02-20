import React from 'react';
import { Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../shared/StatCard';
import { Task, User, TaskStatus } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface DashboardViewProps {
  stats: {
    active: number;
    overdue: number;
    completed: number;
  };
  tasks: Task[];
  users: User[];
  user: User;
}

export const DashboardView = ({ 
  stats, 
  tasks, 
  users,
  user 
}: DashboardViewProps) => {
  const { t } = useLanguage();

  // Estatísticas por status
  const tasksByStatus = Object.values(TaskStatus).map(status => ({
    status,
    count: tasks.filter(t => t.status === status).length
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 animate-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <StatCard 
          icon={<Layers className="text-emerald-600" />} 
          label={t.activeTasks} 
          value={stats.active} 
          color="emerald" 
        />
        <StatCard 
          icon={<AlertTriangle className="text-rose-600" />} 
          label={t.overdueTasks} 
          value={stats.overdue} 
          color="rose" 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          label={t.completedTasks} 
          value={stats.completed} 
          color="emerald" 
        />
      </div>
      
      {/* Tasks by Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-base sm:text-lg font-black mb-6 tracking-tight">
          {t.tasksByStatus || 'Tarefas por Estado'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {tasksByStatus.map(({ status, count }) => (
            <div key={status} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{count}</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mt-1 line-clamp-2">
                {status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
