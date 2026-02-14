// src/pages/App.tsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  LayoutDashboard, CheckSquare, Users, LogOut, Bell, 
  Menu, ChevronLeftCircle, Moon, Sun, User as UserIcon,
  BarChart2, X, Workflow, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { useNotifications } from '../hooks/useNotifications';
import { useActivities } from '../hooks/useActivities';
import { useNavigation } from '../hooks/useNavigation';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { SidebarNavItem } from '../components/shared/SidebarNavItem';
import { TasksView } from '../components/tasks/TasksView';
import { UsersView } from '../components/users/UsersView';
import { DashboardView } from '../components/dashboard/DashboardView';
import { ProfileView } from '../components/profile/ProfileView';
import { ReportsView } from '../components/dashboard/ReportsView';
import { User, UserRole, TaskStatus } from '../types';
import { TRANSLATIONS } from '../constants';
import { AppContext } from '../context/AppContext'; // Importe o contexto

export const AppPage = () => {
  // ============ CONTEXT ============
  // Use o contexto em vez dos hooks individuais para evitar conflitos
  const context = useContext(AppContext);
  
  // ============ HOOKS ============
  const { user, setUser, logout } = useAuth();
  
  // ✅ Use os hooks normalmente, mas certifique-se que estão declarados ANTES de serem usados
  const { 
    tasks, 
    filteredTasks, 
    filterTasks, 
    handleAdvanceStatus, 
    handleRegressStatus,
    handleDeleteTask, 
    addComment 
  } = useTasks();
  
  const { 
    users, 
    setUsers, 
    getAvatarUrl, 
    saveAvatar, 
    openAvatarUpload,
    updateUser,
    deleteUser 
  } = useUsers();
  
  const { notifications, markAllNotificationsAsRead, addNotification } = useNotifications();
  const { visibleActivities, addSystemActivity } = useActivities();
  const { activeTab, setActiveTab, setView } = useNavigation();
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  // ============ REFS ============
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  // ============ STATE ============
  // IMPORTANTE: Todas as variáveis de estado DEVEM ser declaradas aqui,
  // antes de serem usadas em qualquer lugar
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAppSidebarOpen, setAppSidebarOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [uploadingAvatarFor, setUploadingAvatarFor] = useState<string | null>(null);
  
  // Profile password state
  const [profilePassword, setProfilePassword] = useState('');
  const [profilePasswordConfirm, setProfilePasswordConfirm] = useState('');
  const [profilePasswordError, setProfilePasswordError] = useState<string | null>(null);
  const [profilePasswordSuccess, setProfilePasswordSuccess] = useState<string | null>(null);
  
  // Task filters - DECLARADOS AQUI (antes de serem usados)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // ============ EARLY RETURN ============
  // Se não tiver usuário, não renderiza nada (ou mostra loading)
  if (!user) {
    return <div>Carregando...</div>;
  }

  // ============ HANDLERS ============
  const setActiveTabSafe = (tab: string) => {
    if (user?.mustChangePassword && tab !== 'profile') {
      setActiveTab('profile');
      return;
    }
    setActiveTab(tab);
  };

  // Avatar upload handler
  const handleAvatarUpload = (userId: string) => {
    setUploadingAvatarFor(userId);
    setTimeout(() => avatarInputRef.current?.click(), 0);
  };

  // Avatar file change handler
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingAvatarFor) {
      const reader = new FileReader();
      reader.onload = () => {
        saveAvatar(uploadingAvatarFor, reader.result as string);
        setUploadingAvatarFor(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Task filter handlers - AGORA searchQuery e statusFilter já estão definidos
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterTasks({ search: query, status: statusFilter });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    filterTasks({ search: searchQuery, status });
  };

  // ============ STATS ============
  const stats = {
    active: tasks.filter(t => t.status !== TaskStatus.FECHADO && t.status !== TaskStatus.ARQUIVADO && t.status !== TaskStatus.CANCELADA).length,
    overdue: tasks.filter(t => t.status === TaskStatus.ATRASADA).length,
    completed: tasks.filter(t => t.status === TaskStatus.FECHADO).length
  };

  // ============ RENDER ============
  return (
    <div className="h-screen flex bg-[#f8fafc] dark:bg-slate-950 transition-all font-sans overflow-hidden">
      {/* Hidden Avatar Input */}
      <input 
        ref={avatarInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarFileChange} 
      />
      
      {/* Mobile Sidebar Overlay */}
      {isAppSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-[75] lg:hidden" 
          onClick={() => setAppSidebarOpen(false)} 
          aria-hidden="true" 
        />
      )}
      
      {/* ============ SIDEBAR ============ */}
      <aside className={`fixed lg:relative left-0 top-0 h-screen flex flex-col z-[80] transition-all duration-300 ease-in-out
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        ${isAppSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarCollapsed ? 'lg:w-[100px] w-[280px]' : 'w-[280px]'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="bg-[#10b981] p-2 rounded-xl flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <Workflow size={22} className="text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                GESTORA
              </span>
            )}
          </div>
          <button 
            onClick={() => setAppSidebarOpen(false)} 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <SidebarNavItem 
            icon={<LayoutDashboard size={20}/>} 
            label={t.dashboard} 
            active={activeTab === 'dashboard'} 
            collapsed={isSidebarCollapsed} 
            onClick={() => { 
              setActiveTabSafe('dashboard'); 
              setAppSidebarOpen(false); 
            }} 
          />
          <SidebarNavItem 
            icon={<CheckSquare size={20}/>} 
            label={t.tasks} 
            active={activeTab === 'tasks'} 
            collapsed={isSidebarCollapsed} 
            onClick={() => { 
              setActiveTabSafe('tasks'); 
              setAppSidebarOpen(false); 
            }} 
          />
          {user?.role === UserRole.ADMIN && (
            <>
              <SidebarNavItem 
                icon={<Users size={20}/>} 
                label={t.users} 
                active={activeTab === 'users'} 
                collapsed={isSidebarCollapsed} 
                onClick={() => { 
                  setActiveTabSafe('users'); 
                  setAppSidebarOpen(false); 
                }} 
              />
              <SidebarNavItem 
                icon={<BarChart2 size={20}/>} 
                label={t.reports} 
                active={activeTab === 'reports'} 
                collapsed={isSidebarCollapsed} 
                onClick={() => { 
                  setActiveTabSafe('reports'); 
                  setAppSidebarOpen(false); 
                }} 
              />
            </>
          )}
          <SidebarNavItem 
            icon={<UserIcon size={20}/>} 
            label={t.profile} 
            active={activeTab === 'profile'} 
            collapsed={isSidebarCollapsed} 
            onClick={() => { 
              setActiveTabSafe('profile'); 
              setAppSidebarOpen(false); 
            }} 
          />
        </nav>

        {/* Sidebar Footer - Logout */}
        <div className="p-4 lg:p-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={logout} 
            className="flex items-center gap-5 w-full px-5 py-4 text-slate-400 hover:text-rose-500 transition-all"
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && (
              <span className="text-[11px] font-black uppercase tracking-widest">{t.logout}</span>
            )}
          </button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* ============ HEADER ============ */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between z-50">
          
          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setAppSidebarOpen(true)} 
              className="lg:hidden p-3 bg-emerald-50 dark:bg-emerald-900/20 text-[#10b981] rounded-xl"
            >
              <Menu size={22}/>
            </button>
            <button 
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} 
              className="hidden lg:flex p-3 bg-emerald-50 dark:bg-emerald-900/20 text-[#10b981] rounded-xl"
            >
              <ChevronLeftCircle 
                size={22} 
                className={`transition-transform duration-500 ${isSidebarCollapsed ? 'rotate-180' : ''}`} 
              />
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none capitalize tracking-tight">
                {t[activeTab as keyof typeof t] || activeTab}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Gestora Enterprise Workspace
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            
            {/* Language Toggle */}
            <button 
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} 
              className="text-[10px] font-black p-2 bg-slate-50 dark:bg-slate-800 rounded-lg uppercase tracking-widest"
            >
              {lang}
            </button>
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="p-3 text-slate-400"
            >
              {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                className="p-3 text-slate-400 relative"
                aria-label="Notificações"
              >
                <Bell size={20} />
                {notifications.filter(n => n.userId === user?.id && !n.isRead).length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                    {notifications.filter(n => n.userId === user?.id && !n.isRead).length}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-[380px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[120]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      {t.notifications}
                    </p>
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      {t.markAllRead}
                    </button>
                  </div>
                  <div className="p-2 space-y-2">
                    {notifications.filter(n => n.userId === user?.id).length === 0 && (
                      <div className="p-4 text-xs text-slate-400 text-center">
                        {t.noNotifications}
                      </div>
                    )}
                    {notifications.filter(n => n.userId === user?.id).map(n => (
                      <div 
                        key={n.id} 
                        className={`px-3 py-2 rounded-xl text-xs ${
                          n.isRead 
                            ? 'bg-slate-50 dark:bg-slate-800 text-slate-500' 
                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-slate-700'
                        }`}
                      >
                        <p className="font-semibold">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.timestamp).toLocaleString('pt-PT')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 sm:gap-4 pl-4 sm:pl-6 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                  {user?.name}
                </p>
                <p className="text-[10px] font-bold text-[#10b981] uppercase tracking-widest mt-1.5">
                  {user?.position || user?.role}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => user && handleAvatarUpload(user.id)} 
                className="flex-shrink-0 rounded-2xl border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-100"
              >
                {user && getAvatarUrl(user) ? (
                  <img src={getAvatarUrl(user)!} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={22} className="text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ============ CONTENT AREA ============ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-[#f8fafc] dark:bg-slate-950">
          
          {/* Dashboard View */}
          {activeTab === 'dashboard' && user && (
            <DashboardView 
              stats={stats} 
              tasks={tasks} 
              users={users}
              visibleActivities={visibleActivities} 
              user={user}
            />
          )}

          {/* Tasks View */}
          {activeTab === 'tasks' && user && (
            <TasksView 
              tasks={filteredTasks}
              users={users}
              user={user}
              onAdvanceStatus={handleAdvanceStatus}
              onRegressStatus={handleRegressStatus}
              onDeleteTask={handleDeleteTask}
              onAddComment={addComment}
              onSearchChange={handleSearchChange}
              onStatusFilterChange={handleStatusFilterChange}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          )}

          {/* Users View */}
          {activeTab === 'users' && user?.role === UserRole.ADMIN && (
            <UsersView 
              users={users}
              currentUser={user}
              onUpdateUser={updateUser}
              onDeleteUser={deleteUser}
              onAvatarUpload={handleAvatarUpload}
              getAvatarUrl={getAvatarUrl}
            />
          )}

          {/* Profile View */}
          {activeTab === 'profile' && user && (
            <ProfileView 
              user={user}
              users={users}
              setUsers={setUsers}
              setUser={setUser}
              profilePassword={profilePassword}
              setProfilePassword={setProfilePassword}
              profilePasswordConfirm={profilePasswordConfirm}
              setProfilePasswordConfirm={setProfilePasswordConfirm}
              profilePasswordError={profilePasswordError}
              setProfilePasswordError={setProfilePasswordError}
              profilePasswordSuccess={profilePasswordSuccess}
              setProfilePasswordSuccess={setProfilePasswordSuccess}
              setActiveTabSafe={setActiveTabSafe}
              onAvatarUpload={handleAvatarUpload}
              getAvatarUrl={getAvatarUrl}
              updateUser={updateUser}
              addNotification={addNotification}
            />
          )}

          {/* Reports View */}
          {activeTab === 'reports' && user?.role === UserRole.ADMIN && (
            <ReportsView 
              tasks={tasks} 
              users={users} 
            />
          )}
        </div>
      </main>
    </div>
  );
};