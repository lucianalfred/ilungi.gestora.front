import React, { useState } from 'react';
import { 
  Calendar, ArrowRight, Check, CheckCircle2, 
  ShieldCheck, AlertTriangle, Pencil, Trash2 
} from 'lucide-react';
import { Task, TaskStatus, User, UserRole } from '../../types';
import { STATUS_COLORS, StatusOrder } from '../../constants/index';

interface TaskCardProps {
  task: Task;
  user: User;
  users: User[];
  onAdvance: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  onAddComment?: (text: string) => void;
}

export const TaskCard = ({ 
  task, 
  user, 
  users, 
  onAdvance, 
  onDelete, 
  onEdit, 
  onAddComment 
}: TaskCardProps) => {
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  
  const currentIndex = StatusOrder.indexOf(task.status);
  const nextStatus = StatusOrder[currentIndex + 1];
  const isFinished = task.status === TaskStatus.TERMINADO;
  const isClosed = task.status === TaskStatus.FECHADO;
  const isEmployee = user.role === UserRole.EMPLOYEE;
  const isMyTask = task.responsibleId === user.id;
  const isTaskMember = task.responsibleId === user.id || task.intervenientes?.includes(user.id);
  const isAdmin = user.role === UserRole.ADMIN;
  
  const respName = users?.find((u: User) => u.id === task.responsibleId)?.name;
  const extra = task.intervenientes?.length ? ` +${task.intervenientes.length}` : '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3.5rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full relative overflow-hidden">
      {task.status === TaskStatus.ATRASADA && (
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-rose-500/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 flex items-end justify-start p-4 sm:p-8">
          <AlertTriangle className="text-rose-500" size={20} />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4 sm:mb-8">
        <span className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${STATUS_COLORS[task.status]}`}>
          {task.status}
        </span>
        {user.role === UserRole.ADMIN && (
          <div className="flex gap-1">
            {onEdit && (
              <button onClick={onEdit} className="p-2 text-slate-300 hover:text-[#10b981] transition-colors" title="Editar">
                <Pencil size={16}/>
              </button>
            )}
            <button onClick={onDelete} className="p-2 text-slate-300 hover:text-rose-500 transition-colors" title="Eliminar">
              <Trash2 size={16}/>
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight group-hover:text-[#10b981] transition-colors">
          {task.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed line-clamp-3">
          {task.description}
        </p>
        {respName && (
          <p className="text-[10px] font-bold text-slate-500 uppercase">
            Responsável: {respName}{extra}
          </p>
        )}

        {(isTaskMember || isAdmin) && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500">
                💬 Comentários ({task.comments?.length || 0})
              </p>
              {isAdmin && task.comments?.length > 0 && (
                <button 
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="text-[9px] font-bold text-[#10b981] hover:text-[#059669] transition-colors"
                >
                  {showAllComments ? 'Ocultar tudo' : 'Ver tudo'}
                </button>
              )}
            </div>
            
            {(showAllComments || !isAdmin) && (
              <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                {(task.comments || []).map((c: any) => (
                  <div key={c.id} className="text-sm text-slate-600 bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                    <span className="font-bold text-slate-800 dark:text-white mr-2">{c.userName}:</span>
                    <span className="text-slate-600 dark:text-slate-300">{c.text}</span>
                    <div className="text-[9px] text-slate-400 mt-1">
                      {new Date(c.timestamp).toLocaleString('pt-PT')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isTaskMember && onAddComment && (
              <div className="flex gap-2">
                <input 
                  value={commentText} 
                  onChange={e => setCommentText(e.target.value)}
                  onKeyPress={(e) => { 
                    if (e.key === 'Enter' && commentText.trim()) { 
                      onAddComment(commentText.trim()); 
                      setCommentText(''); 
                    } 
                  }}
                  placeholder="Adicionar comentário..." 
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 outline-none text-xs" 
                />
                <button 
                  onClick={() => { 
                    if (commentText.trim()) { 
                      onAddComment(commentText.trim()); 
                      setCommentText(''); 
                    } 
                  }} 
                  className="px-3 py-1.5 rounded-lg bg-[#10b981] text-white font-bold text-xs hover:bg-[#059669] transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar size={14}/>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Prazo: {new Date(task.deliveryDate).toLocaleDateString('pt-PT', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric' 
            })}
          </span>
        </div>
        {!isClosed && nextStatus && (isMyTask || !isEmployee) && (
          <button 
            disabled={isFinished && isEmployee}
            onClick={onAdvance}
            className={`flex-1 sm:max-w-[140px] py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2
              ${isFinished 
                ? 'bg-[#10b981] text-white shadow-emerald-500/20' 
                : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-[#10b981]'
              }`}
          >
            {isFinished 
              ? (user.role === UserRole.ADMIN ? <Check size={14}/> : <ShieldCheck size={14}/>)
              : <ArrowRight size={14}/>
            }
            {isFinished 
              ? (user.role === UserRole.ADMIN ? 'Validar' : 'Finalizada')
              : 'Avançar'
            }
          </button>
        )}
        {isClosed && (
          <div className="text-[#10b981] flex items-center gap-1 font-black text-[9px] uppercase tracking-widest">
            <CheckCircle2 size={16}/> Fechada
          </div>
        )}
      </div>
    </div>
  );
};