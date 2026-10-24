import React from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  Bot,
  GraduationCap,
  Home,
  LogOut
} from 'lucide-react';

interface NavItem {
  id: Page | 'exams';
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, authUser, logout } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarCheck className="w-5 h-5" /> },
    { id: 'study-plan', label: 'Study Plan', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'ai-assistant', label: 'Study Helper', icon: <Bot className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: Page | 'exams') => {
    if (id === 'exams') {
      setCurrentPage('assignments');
    } else {
      setCurrentPage(id);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 min-h-screen select-none">
      {/* Top Logo */}
      <div>
        <div className="p-6 pb-5 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">
                Study<span className="text-purple-600">Mate</span>
              </span>
            </div>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'assignments' && currentPage === 'assignments');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200 font-semibold'
                    : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50/60'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile card */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={() => setCurrentPage('landing')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>View Landing Page</span>
        </button>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Student Avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-bold text-slate-800 truncate">{authUser?.name || 'Guest'}</p>
              <p className="text-[11px] text-slate-400 truncate">{authUser?.email || 'Local planner'}</p>
          </div>
          {authUser ? (
            <button onClick={() => { void logout(); }} title="Log out" className="text-slate-400 hover:text-rose-500 transition-colors p-1">
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => setCurrentPage('auth')} className="text-xs font-semibold text-purple-600 hover:text-purple-800">Log in</button>
          )}
        </div>
      </div>
    </aside>
  );
};
