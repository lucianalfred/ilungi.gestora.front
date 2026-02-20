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

export const TaskModal = ({ 
  isOpen, 
  editingTaskId, 
  onClose 
}: TaskModalProps) => {
  // Move early return BEFORE hooks to avoid calling hooks when not needed
  if (!isOpen && !editingTaskId) return null;

  // Safe access to hooks with error handling
  let tasks: any[] = [];
  let users: any[] = [];
  let createTask: any = () => {};
  let updateTask: any = () => {};
  
  try {
    const tasksResult = useTasks();
    tasks = tasksResult?.tasks || [];
    createTask = tasksResult?.createTask || (() => {});
    updateTask = tasksResult?.updateTask || (() => {});
  } catch (e) {
    console.error('useTasks error:', e);
  }
  
  try {
    const usersResult = useUsers();
    users = usersResult?.users || [];
  } catch (e) {
    console.error('useUsers error:', e);
  }
  
  const [isLoading, setIsLoading] = useState(false);
  const [taskFormError, setTaskFormError] = useState<string | null>(null);
  const [taskFormDeliveryPreview, setTaskFormDeliveryPreview] = useState('');
  const [responsibleSearch, setResponsibleSearch] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  
  const editTask = editingTaskId 
    ? tasks.find(t => t.id === editingTaskId) 
    : null;
  
  const respIds = editTask 
    ? [editTask.responsibleId, ...(editTask.intervenientes || [])] 
    : [];

  // Verificar se users está disponível
  const hasUsers = users && Array.isArray(users) && users.length > 0;
  
  // Filtrar utilizadores por nome ou email
  const filteredUsers = hasUsers 
    ? users.filter(user => {
        const searchLower = responsibleSearch.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      })
    : [];

  const handleSelectAllResponsibles = () => {
    const form = document.getElementById('taskForm') as HTMLFormElement;
    if (!form) return;
    
    const checkboxes = form.querySelectorAll<HTMLInputElement>('input[name="responsibleIds"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(cb => {
      cb.checked = !allChecked;
    });
    
    // Update count
    const newCount = !allChecked ? checkboxes.length : 0;
    setSelectedCount(newCount);
  };

  const handleResponsibleChange = () => {
    const form = document.getElementById('taskForm') as HTMLFormElement;
    if (!form) return;
    
    const checkboxes = form.querySelectorAll<HTMLInputElement>('input[name="responsibleIds"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    setSelectedCount(checkedCount);
  };

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
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(90vh-200px)] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
          
          <button 
            onClick={onClose} 
            className="mb-4 text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-2 text-sm font-bold"
            disabled={isLoading}
          >
            <X size={18} /> Voltar
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
            
            {/* Título */}
            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Título <span className="text-rose-500">*</span>
              </label>
              <input 
                name="title" 
                defaultValue={editTask?.title} 
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-sm" 
                required 
                placeholder="Digite o título da tarefa"
                disabled={isLoading}
              />
            </div>
            
            {/* Descrição */}
            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Descrição <span className="text-rose-500">*</span>
              </label>
              <textarea 
                name="description" 
                defaultValue={editTask?.description} 
                rows={3} 
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium resize-none text-sm" 
                required 
                placeholder="Descreva a tarefa em detalhes"
                disabled={isLoading}
              />
            </div>
            
            {/* Data Início */}
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Data Início <span className="text-rose-500">*</span>
              </label>
              <input 
                name="startDate" 
                type="datetime-local" 
                defaultValue={editTask?.startDate?.slice(0,16)} 
                onInput={(e) => recalcDelivery((e.target as HTMLInputElement).form!)} 
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-sm" 
                required 
                disabled={isLoading}
              />
            </div>
            
            {/* Duração */}
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Duração <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input 
                  name="deadlineValue" 
                  type="number" 
                  defaultValue={editTask?.deadlineValue ?? 1} 
                  min={1} 
                  onInput={(e) => recalcDelivery((e.target as HTMLInputElement).form!)} 
                  className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-sm" 
                  required 
                  disabled={isLoading}
                />
                <select 
                  name="deadlineType" 
                  defaultValue={editTask?.deadlineType || 'days'} 
                  onChange={(e) => recalcDelivery((e.target as HTMLSelectElement).form!)} 
                  className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-sm"
                  disabled={isLoading}
                >
                  <option value="days">Dias</option>
                  <option value="hours">Horas</option>
                </select>
              </div>
            </div>
            
            {/* Data Entrega (calculada) */}
            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Data Entrega (calculada)
              </label>
              <div className="px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {taskFormDeliveryPreview || (editTask ? new Date(editTask.deliveryDate).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : '—')}
              </div>
            </div>
            
            {/* Responsáveis */}
            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Responsáveis (múltipla escolha) <span className="text-rose-500">*</span>
              </label>
              
              {hasUsers && (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={responsibleSearch}
                    onChange={(e) => setResponsibleSearch(e.target.value)}
                    placeholder="Pesquisar por nome ou email..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSelectAllResponsibles}
                    className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
                  >
                    Selecionar Todos
                  </button>
                </div>
              )}
              
              {!hasUsers ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                  <p className="text-amber-700 dark:text-amber-400 text-sm font-bold">
                    ⚠️ Nenhum utilizador encontrado
                  </p>
                  <p className="text-amber-600 dark:text-amber-500 text-xs mt-1">
                    É necessário ter pelo menos um utilizador cadastrado para criar tarefas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg max-h-48 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <label 
                      key={user.id} 
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-colors ${
                        isLoading 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        name="responsibleIds" 
                        value={user.id} 
                        defaultChecked={respIds.includes(user.id)} 
                        onChange={handleResponsibleChange}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500/20"
                        disabled={isLoading}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {user.name}
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      {user.role === 'ADMIN' && (
                        <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
              
              {hasUsers && (
                <p className="text-[9px] text-slate-400 mt-1">
                  Selecionados: {selectedCount} utilizador(es)
                </p>
              )}
            </div>
            
            {/* Botões */}
            <div className="md:col-span-2 lg:col-span-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={!hasUsers || isLoading}
                  className="flex-1 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] shadow-lg shadow-emerald-500/20 text-sm uppercase tracking-wider"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editTask ? 'A guardar...' : 'A criar...'}
                    </>
                  ) : (
                    editTask ? 'Guardar Alterações' : 'Criar Tarefa'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>
  );
};