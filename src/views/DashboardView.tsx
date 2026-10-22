import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  ClipboardList,
  Calendar,
  CheckCircle2,
  Flame,
  Plus,
  Clock,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    todayTasks,
    toggleTodayTask,
    addTodayTask,
    streakDays,
    completedStreakDays,
    subjects,
    assignments,
    exams,
    overallProgress,
    setCurrentPage,
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('1 hr');
  const [isAdding, setIsAdding] = useState(false);

  const pendingTasksCount = todayTasks.filter(t => !t.completed).length + assignments.filter(a => !a.completed).length;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTodayTask(newTaskTitle, newTaskDuration);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7">
      {/* Top Greeting & Motivational Quote Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good Evening, Student!</span>
            <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Stay consistent, you're doing great!</p>
        </div>

        <div className="text-left md:text-right bg-white md:bg-transparent p-3.5 md:p-0 rounded-2xl border md:border-none border-slate-100 shadow-sm md:shadow-none">
          <p className="text-xs font-semibold text-slate-400">Thu, 22 Oct 2026</p>
          <p className="text-xs sm:text-sm font-medium text-slate-700 italic mt-0.5">
            "Discipline today builds the future you want."
          </p>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Subjects Card */}
        <div
          onClick={() => setCurrentPage('subjects')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{subjects.length}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Subjects</p>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => setCurrentPage('assignments')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{pendingTasksCount}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Pending Tasks</p>
        </div>

        {/* Upcoming Exams */}
        <div
          onClick={() => setCurrentPage('assignments')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{exams.length}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Upcoming Exams</p>
        </div>

        {/* Overall Progress */}
        <div
          onClick={() => setCurrentPage('progress')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{overallProgress}%</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Overall Progress</p>
        </div>
      </div>

      {/* Main Grid: Today's Plan (Left) & Study Streak (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Plan */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today's Plan</h2>
              <p className="text-xs text-slate-400">Keep up your daily pace and tick items off</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
              <button
                onClick={() => setCurrentPage('study-plan')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline px-2 py-1"
              >
                View All
              </button>
            </div>
          </div>

          {/* Quick Add Input */}
          {isAdding && (
            <form onSubmit={handleAddTask} className="mb-4 p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex flex-wrap gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What are you studying today? e.g. Solve 10 calculus problems"
                className="flex-1 min-w-[200px] px-3 py-2 bg-white rounded-xl text-xs sm:text-sm border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <select
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
                className="px-3 py-2 bg-white rounded-xl text-xs sm:text-sm border border-purple-200 focus:outline-none"
              >
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="1 hr">1 hr</option>
                <option value="1.5 hrs">1.5 hrs</option>
                <option value="2 hrs">2 hrs</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Save
              </button>
            </form>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTodayTask(task.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                    : 'bg-white border-slate-200/80 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      task.completed
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 bg-white hover:border-purple-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-100/70 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{task.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI tip footer inside card */}
          <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Need an optimized routine for your upcoming exams?</span>
            </div>
            <button
              onClick={() => setCurrentPage('study-plan')}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-0.5"
            >
              <span>Generate AI Plan</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Study Streak */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Study Streak</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                Active
              </span>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-3 my-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Flame className="w-7 h-7 fill-amber-500 animate-bounce" />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  {streakDays} days
                </p>
                <p className="text-xs text-slate-400">Current consecutive streak</p>
              </div>
            </div>

            {/* Weekday Circles: M T W T F S S */}
            <div className="grid grid-cols-7 gap-1.5 mt-5 mb-5">
              {daysLabels.map((day, idx) => {
                const isChecked = completedStreakDays[idx];
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">{day}</span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isChecked
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {isChecked ? <Check className="w-4 h-4 stroke-[2.5]" /> : '•'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Encouragement Banner */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-purple-900 text-xs leading-relaxed">
              <span className="font-bold">Keep going!</span> You're{' '}
              <span className="font-extrabold text-purple-700">32% ahead</span> of your last week. 🚀
            </div>
          </div>

          {/* Quick Exam Countdown widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Next Major Milestone</h3>
              <button
                onClick={() => setCurrentPage('assignments')}
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                View all
              </button>
            </div>
            {exams[0] && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                    📝
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{exams[0].title}</p>
                    <p className="text-[11px] text-slate-400">{exams[0].date}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-rose-500 text-white rounded-full text-xs font-bold shadow-sm">
                  {exams[0].daysLeft} days left
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
