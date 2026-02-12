import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useTasks = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTasks must be used within AppProvider');
  }
  return {
    tasks: context.tasks,
    setTasks: context.setTasks,
    filteredTasks: context.filteredTasks,
    filterTasks: context.filterTasks,
    createTask: context.createTask,
    updateTask: context.updateTask,
    deleteTask: context.deleteTask,
    handleAdvanceStatus: context.handleAdvanceStatus,
    handleDeleteTask: context.handleDeleteTask,
    addComment: context.addComment
  };
};