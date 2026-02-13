import React from 'react';
import { Layers, AlertTriangle, CheckCircle2, Bell } from 'lucide-react';
import { StatCard } from '../shared/StatCard';
import { Task, SystemActivity, User, UserRole, TaskStatus } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { TRANSLATIONS } from '../../constants';

interface DashboardViewProps {
  stats: {
    active: number;
    overdue: number;
    completed: number;
  };
  tasks: Task[];
  users: User[];
  visibleActivities: SystemActivity[];
  user: User;
}

export const DashboardView = ({ 
  stats, 
  tasks, 
  users,
  visibleActivities, 
  user 
}: DashboardViewProps) => {
  const { lang, t } = useLanguage();

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
      
      {/* Latest Activities */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-base sm:text-lg font-black mb-6 sm:mb-10 tracking-tight">
          {t.latestUpdates}
        </h3>
        <div className="space-y-4 sm:space-y-6 max-h-[420px] overflow-y-auto pr-2">
          {visibleActivities.slice(0, 15).map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          {visibleActivities.length === 0 && (
            <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-10">
              {t.noActivities}
            </p>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-base sm:text-lg font-black mb-6 sm:mb-10 tracking-tight">
          {t.activityLog}
        </h3>
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
          {visibleActivities.map(activity => (
            <ActivityLogItem key={`log-${activity.id}`} activity={activity} />
          ))}
          {visibleActivities.length === 0 && (
            <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-10">
              {t.noActivities}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de Item de Atividade
const ActivityItem = ({ activity }: { activity: SystemActivity }) => {
  const getUserName = (id: string) => activity.userName || id;

  return (
    <div className="flex gap-3 sm:gap-6 items-start border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0">
      <div className="p-2.5 sm:p-4 rounded-xl shrink-0 bg-emerald-50 dark:bg-emerald-900/20 text-[#10b981]">
        <Bell size={18} className="sm:w-5 sm:h-5"/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-700 dark:text-slate-300 text-sm sm:text-base">
          {activity.action === 'created' && (
            <><span className="text-[#10b981]">{getUserName(activity.userId)}</span> criou a tarefa «{activity.entityTitle}»</>
          )}
          {activity.action === 'updated' && (
            <><span className="text-[#10b981]">{getUserName(activity.userId)}</span> editou a tarefa «{activity.entityTitle}»</>
          )}
          {activity.action === 'deleted' && (
            <><span className="text-rose-600">{getUserName(activity.userId)}</span> eliminou a tarefa «{activity.entityTitle}»</>
          )}
          {activity.action === 'status_changed' && (
            <><span className="text-[#10b981]">{getUserName(activity.userId)}</span> alterou «{activity.entityTitle}» de {activity.fromStatus} → {activity.toStatus}</>
          )}
          {activity.action === 'commented' && (
            <><span className="text-[#10b981]">{getUserName(activity.userId)}</span> comentou em «{activity.entityTitle}»</>
          )}
        </p>
        <p className="text-[10px] font-black uppercase text-slate-400 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// Componente de Item de Log
const ActivityLogItem = ({ activity }: { activity: SystemActivity }) => {
  return (
    <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
      <span className="font-bold text-slate-700 dark:text-slate-300">
        {new Date(activity.timestamp).toLocaleString('pt-PT')}
      </span>
      <span className="mx-2 text-slate-400">•</span>
      <span className="text-slate-600 dark:text-slate-300">{activity.userName}</span>
      <span className="mx-2 text-slate-400">•</span>
      <span className="text-slate-500">{activity.action}</span>
      <span className="mx-2 text-slate-400">•</span>
      <span className="text-slate-700 dark:text-slate-200">{activity.entityTitle || activity.entityId}</span>
      {activity.fromStatus && activity.toStatus && (
        <>
          <span className="mx-2 text-slate-400">•</span>
          <span className="text-slate-500">{activity.fromStatus} → {activity.toStatus}</span>
        </>
      )}
    </div>
  );
};