import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../shared/Button';
import { Task, User } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';

interface TaskModalProps {
  isOpen: boolean;
  editingTaskId: string | null;
  onClose: () => void;
}

export const TaskModal = ({ isOpen, editingTaskId, onClose }: TaskModalProps) => {
  const { tasks, users, createTask, updateTask } = useTasks();
  const { user } = useUsers();
  const [taskFormError, setTaskFormError] = useState<string | null>(null);
  const [taskFormDeliveryPreview, setTaskFormDeliveryPreview] = useState('');
  
  const editTask = editingTaskId ? tasks.find(t => t.id === editingTaskId) : null;
  const respIds = editTask ? [editTask.responsibleId, ...(editTask.intervenientes || [])] : [];

  useEffect(() => {
    if (editTask) {
      setTaskFormDeliveryPreview(
        new Date(editTask.deliveryDate).toLocaleString('pt-PT', { 
          dateStyle: 'short', 
          timeStyle: 'short' 
        })
      );
    } else {
      setTaskFormDeliveryPreview('');
    }
  }, [editTask]);

  if (!isOpen && !editingTaskId) return null;

  const recalcDelivery = (form: HTMLFormElement) => {
    const start = (form?.elements.namedItem('startDate') as HTMLInputElement)?.value;
    const val = (form?.elements.namedItem('deadlineValue') as HTMLInputElement)?.value;
    const type = (form?.elements.namedItem('deadlineType') as HTMLSelectElement)?.value;
    
    if (start && val && type) {
      const d = new Date(start);
      if (type === 'days') d.setDate(d.getDate() + Number(val));
      else d.setHours(d.getHours() + Number(val));
      
      setTaskFormDeliveryPreview(
        d.toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
      );
    } else {
      setTaskFormDeliveryPreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const ids = fd.getAll('responsibleIds') as string[];
    
    if (!ids || ids.length === 0) { 
      setTaskFormError('Selecione pelo menos um responsável.'); 
      return; 
    }
    
    setTaskFormError(null);
    const start = fd.get('startDate') as string;
    const val = Number(fd.get('deadlineValue'));
    const type = (fd.get('deadlineType') as 'days'|'hours') || 'days';
    const daysToFinish = type === 'days' ? val : Math.ceil(val / 24);

    try {
      if (editTask) {
        await updateTask(editTask.id, {
          title: fd.get('title') as string,
          description: fd.get('description') as string,
          startDate: start,
          deadlineValue: val,
          deadlineType: type,
          responsibleId: ids[0],
          intervenientes: ids.slice(1)
        });
      } else {
        await createTask({
          title: fd.get('title') as string,
          description: fd.get('description') as string,
          daysToFinish,
          responsibles: ids.map(id => Number(id))
        });
      }
      onClose();
      setTaskFormDeliveryPreview('');
    } catch (error: any) {
      let errorMsg = 'Não foi possível criar/atualizar na API.';
      if (error.message?.includes('400')) {
        errorMsg = 'Formato de dados inválido. Verifique os responsáveis.';
      } else if (error.message?.includes('401')) {
        errorMsg = 'Acesso não autorizado. Faça login novamente.';
      } else if (error.message?.includes('403')) {
        errorMsg = 'Sem permissão para realizar esta ação.';
      }
      setTaskFormError(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto py-8 animate-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative my-auto">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-slate-300 hover:text-rose-500 transition-colors z-10"
        >
          <X size={18} className="sm:w-5 sm:h-5"/>
        </button>
        
        <h2 className="text-lg sm:text-xl font-black tracking-tighter mb-4 uppercase text-slate-800 dark:text-white">
          {editTask ? 'Editar Tarefa' : 'Nova Actividade'}
        </h2>
        
        {taskFormError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-rose-700 text-sm">{taskFormError}</p>
            </div>
          </div>
        )}
        
        <form id="taskForm" className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3" onSubmit={handleSubmit}>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Título
            </label>
            <input 
              name="title" 
              defaultValue={editTask?.title} 
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold text-xs" 
              required 
            />
          </div>
          
          <div className="md:col-span-2 space-y-1">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Descrição
            </label>
            <textarea 
              name="description" 
              defaultValue={editTask?.description} 
              rows={2} 
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium resize-none text-xs" 
              required 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Data Início
            </label>
            <input 
              name="startDate" 
              type="datetime-local" 
              defaultValue={editTask?.startDate?.slice(0,16)} 
              onInput={(e) => recalcDelivery((e.target as HTMLInputElement).form!)} 
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold text-xs" 
              required 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Duração
            </label>
            <div className="flex gap-1.5">
              <input 
                name="deadlineValue" 
                type="number" 
                defaultValue={editTask?.deadlineValue ?? 1} 
                min={1} 
                onInput={(e) => recalcDelivery((e.target as HTMLInputElement).form!)} 
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold text-xs" 
                required 
              />
              <select 
                name="deadlineType" 
                defaultValue={editTask?.deadlineType} 
                onChange={(e) => recalcDelivery((e.target as HTMLSelectElement).form!)} 
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold text-xs"
              >
                <option value="days">Dias</option>
                <option value="hours">Horas</option>
              </select>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-1">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Data Entrega (calculada)
            </label>
            <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg font-bold text-[#10b981] text-xs">
              {taskFormDeliveryPreview || (editTask ? new Date(editTask.deliveryDate).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : '—')}
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-1">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Responsáveis (múltipla escolha)
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg max-h-24 overflow-y-auto">
              {users.map(u => (
                <label key={u.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs">
                  <input 
                    type="checkbox" 
                    name="responsibleIds" 
                    value={u.id} 
                    defaultChecked={respIds.includes(u.id)} 
                    className="rounded" 
                  />
                  <span className="font-bold">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 pt-1">
            <Button type="submit" className="w-full py-2 rounded-lg bg-[#10b981] shadow-emerald-500/20 shadow-lg text-xs uppercase tracking-[0.1em]">
              {editTask ? 'Guardar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};