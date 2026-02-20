import React, { useState } from 'react';
import { Plus, Search, ClipboardList } from 'lucide-react';
import { Button } from '../shared/Button';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { Task, User, TaskStatus, UserRole } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { TRANSLATIONS } from '../../constants';

interface TasksViewProps {
  tasks: Task[];
  users: User[];
  user: User;
  onAdvanceStatus: (task: Task) => Promise<void>;
  onRegressStatus?: (task: Task) => Promise<void>;
  onDeleteTask: (task: Task) => Promise<void>;
  onAddComment: (taskId: string, text: string) => Promise<void>;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  statusFilter: string;
}

export const TasksView = ({ 
  tasks, 
  users,
  user, 
  onAdvanceStatus,
  onRegressStatus,
  onDeleteTask, 
  onAddComment,
  onSearchChange,
  onStatusFilterChange,
  searchQuery,
  statusFilter
}: TasksViewProps) => {
  const { t } = useLanguage();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Determina se deve mostrar o formulário ou a lista
  const showTaskForm = isTaskModalOpen || editingTaskId;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in">
      
      {/* Mostrar formulário em vez da lista quando está aberto */}
      {showTaskForm ? (
        <TaskModal 
          isOpen={true} 
          editingTaskId={editingTaskId}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTaskId(null);
          }} 
        />
      ) : (
        <>
          {/* Header com filtros */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:flex-initial">
                <input 
                  placeholder={t.search} 
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-12 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all w-full lg:min-w-[400px] font-bold text-sm shadow-sm"
                />
                <Search className="absolute left-4 top-4.5 text-slate-300" size={18} />
              </div>
              
              {/* Status Filter */}
              <select 
                value={statusFilter}
                onChange={e => onStatusFilterChange(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-slate-500 outline-none cursor-pointer shadow-sm"
              >
                <option value="all">{t.allStatuses}</option>
                {Object.values(TaskStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            {/* Create Task Button (Admin only) */}
            {user?.role === UserRole.ADMIN && (
              <Button 
                onClick={() => { 
                  setEditingTaskId(null); 
                  setIsTaskModalOpen(true); 
                }} 
                className="px-6 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-xl shadow-emerald-500/20 bg-[#10b981] hover:bg-[#059669] transition-colors"
              >
                <Plus size={18} className="sm:w-5 sm:h-5"/> {t.createTask}
              </Button>
            )}
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {tasks.length > 0 ? tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                user={user} 
                users={users}
                onAdvance={() => onAdvanceStatus(task)}
                onRegress={onRegressStatus ? () => onRegressStatus(task) : undefined}
                onDelete={() => onDeleteTask(task)}
                onEdit={user?.role === UserRole.ADMIN ? () => { 
                  setEditingTaskId(task.id); 
                  setIsTaskModalOpen(true); 
                } : undefined}
                onAddComment={(text: string) => onAddComment(task.id, text)}
              />
            )) : (
              <div className="col-span-full py-20 text-center space-y-6">
                <ClipboardList size={100} className="mx-auto text-slate-100 dark:text-slate-800" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">{t.noTasks}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
