import React from 'react';
import { Task, User, UserRole, TaskStatus } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface ReportsViewProps {
  tasks: Task[];
  users: User[];
}

export const ReportsView = ({ tasks, users }: ReportsViewProps) => {
  const { t } = useLanguage();

  // Calcular estatísticas por funcionário
  const employeeStats = users
    .filter(u => u.role === UserRole.EMPLOYEE || u.role === UserRole.ADMIN)
    .map(u => {
      const myTasks = tasks.filter(t => 
        t.responsibleId === u.id || t.intervenientes?.includes(u.id)
      );
      const total = myTasks.length;
      const completed = myTasks.filter(t => t.status === TaskStatus.FECHADO).length;
      const overdue = myTasks.filter(t => t.status === TaskStatus.ATRASADA).length;
      const complianceRate = total ? Math.round((completed / total) * 100) : 0;
      
      return {
        ...u,
        total,
        completed,
        overdue,
        complianceRate
      };
    })
    .sort((a, b) => b.complianceRate - a.complianceRate);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in">
      <h3 className="text-lg font-black">{t.employeeReport}</h3>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 sm:px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {t.employee}
              </th>
              <th className="px-4 sm:px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                {t.total}
              </th>
              <th className="px-4 sm:px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                {t.completed}
              </th>
              <th className="px-4 sm:px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                {t.overdue}
              </th>
              <th className="px-4 sm:px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                {t.complianceRate}
              </th>
            </tr>
          </thead>
          <tbody>
            {employeeStats.map(u => (
              <tr 
                key={u.id} 
                className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              >
                <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {u.name}
                </td>
                <td className="px-4 sm:px-6 py-4 text-center font-black">
                  {u.total}
                </td>
                <td className="px-4 sm:px-6 py-4 text-center text-[#10b981] font-bold">
                  {u.completed}
                </td>
                <td className="px-4 sm:px-6 py-4 text-center text-rose-500 font-bold">
                  {u.overdue}
                </td>
                <td className="px-4 sm:px-6 py-4 text-center">
                  <span className={`font-black ${
                    u.complianceRate >= 70 ? 'text-emerald-600' :
                    u.complianceRate >= 40 ? 'text-amber-600' :
                    'text-rose-600'
                  }`}>
                    {u.complianceRate}%
                  </span>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full ${
                        u.complianceRate >= 70 ? 'bg-emerald-600' :
                        u.complianceRate >= 40 ? 'bg-amber-600' :
                        'bg-rose-600'
                      }`}
                      style={{ width: `${u.complianceRate}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total de Tarefas</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Taxa de Conclusão</p>
          <p className="text-3xl font-black text-emerald-600">
            {tasks.length ? Math.round((tasks.filter(t => t.status === TaskStatus.FECHADO).length / tasks.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Funcionários Ativos</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {users.filter(u => u.role === UserRole.EMPLOYEE).length}
          </p>
        </div>
      </div>
    </div>
  );
};