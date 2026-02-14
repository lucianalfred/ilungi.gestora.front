import { TaskStatus } from '../types';

// ============================================
// STATUS ORDER - Definir ordem de progresso das tarefas
// ALINHADO COM O BACKEND: PENDENTE -> EM_PROGRESSO -> TERMINADO -> FECHADO
// ============================================

// Apenas status que fazem parte do fluxo normal de trabalho (alinhado com backend)
export const StatusOrder: TaskStatus[] = [
  TaskStatus.PENDENTE,      // "PENDENTE" (inclui ABERTO/ABERTA)
  TaskStatus.EM_PROGRESSO,  // "EM_PROGRESSO" (inclui EM_ANDAMENTO, EM_EXECUCAO, EM_REVISAO)
  TaskStatus.TERMINADO,     // "TERMINADO" (inclui CONCLUIDA/CONCLUÍDA)
  TaskStatus.FECHADO        // "FECHADO" (inclui ARQUIVADO, CANCELADA)
  // ATRASADA é um estado especial/terminal, não faz parte do fluxo normal
];

// Log para debug
console.log('✅ StatusOrder carregado (alinhado com backend):', StatusOrder);
console.log('✅ StatusOrder length:', StatusOrder.length);
console.log('✅ PENDENTE index:', StatusOrder.indexOf(TaskStatus.PENDENTE));
console.log('✅ EM_PROGRESSO index:', StatusOrder.indexOf(TaskStatus.EM_PROGRESSO));
console.log('✅ TERMINADO index:', StatusOrder.indexOf(TaskStatus.TERMINADO));
console.log('✅ FECHADO index:', StatusOrder.indexOf(TaskStatus.FECHADO));

// ============================================
// STATUS COLORS - Cores para cada status
// ============================================
export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.PENDENTE]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  [TaskStatus.EM_PROGRESSO]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [TaskStatus.TERMINADO]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [TaskStatus.FECHADO]: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  [TaskStatus.ATRASADA]: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

// ... (resto do arquivo permanece igual)