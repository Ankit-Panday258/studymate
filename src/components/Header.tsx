import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import {
  Search,
  Bell,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { setCurrentPage, searchQuery, setSearchQuery, subjects, todayTasks, assignments, exams, studyPlan, calendarEvents } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const searchResults = searchQuery.trim() ? [
    ...subjects.map(item => ({ label: item.name, detail: 'Subject', page: 'subjects' as Page })),
    ...todayTasks.map(item => ({ label: item.title, detail: 'Today’s task', page: 'dashboard' as Page })),
    ...assignments.map(item => ({ label: item.title, detail: 'Assignment', page: 'assignments' as Page })),
    ...exams.map(item => ({ label: item.title, detail: 'Exam', page: 'assignments' as Page })),
    ...studyPlan.flatMap(day => day.tasks.map(task => ({ label: task.text, detail: day.dayLabel, page: 'study-plan' as Page }))),
    ...calendarEvents.map(item => ({ label: item.title, detail: 'Calendar block', page: 'calendar' as Page })),
  ].filter(item => `${item.label} ${item.detail}`.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 8) : [];

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-4 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults[0]) {
                setCurrentPage(searchResults[0].page);
                setSearchQuery('');
              }
              if (e.key === 'Escape') setSearchQuery('');
            }}
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/70 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </div>
        {searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-80 overflow-y-auto">
            {searchResults.length ? searchResults.map((result, index) => (
              <button
                key={`${result.page}-${result.label}-${index}`}
                onClick={() => { setCurrentPage(result.page); setSearchQuery(''); }}
                className="w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center justify-between gap-3"
              >
                <span className="text-xs font-semibold text-slate-800 truncate">{result.label}</span>
                <span className="text-[10px] text-slate-400 shrink-0">{result.detail}</span>
              </button>
            )) : <p className="px-3 py-2 text-xs text-slate-400">No matching study items</p>}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Study helper shortcut */}
        <button
          onClick={() => setCurrentPage('ai-assistant')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Study Helper</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-900">7-Day Streak Kept!</p>
                    <p className="text-purple-700/80 text-[11px]">You're 32% ahead of last week.</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100 flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⏰</span>
                  <div>
                    <p className="font-semibold text-amber-900">Maths Midterm Exam</p>
                    <p className="text-amber-700/80 text-[11px]">8 days left (Oct 30, 2026)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Student"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-100"
          />
        </div>
      </div>
    </header>
  );
};
