import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Calendar,
  Clock,
  Target,
  Check,
  MoreVertical,
  Lightbulb,
  RefreshCw,
  Trash2,
} from 'lucide-react';

export const StudyPlanView: React.FC = () => {
  const { studyPlan, togglePlanTask, addPlanTask, deletePlanTask, reschedulePlanDay, generateNewPlan, isAiTyping } = useApp();

  const [goal, setGoal] = useState('Exam Preparation');
  const [timeAvailable, setTimeAvailable] = useState('3-4 hours/day');
  const [examDate, setExamDate] = useState(() => {
    const date = new Date(); date.setDate(date.getDate() + 14);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  });
  const [activeTab, setActiveTab] = useState<'7day' | 'weekly' | 'custom'>('7day');
  const [activeMenuDayId, setActiveMenuDayId] = useState<string | null>(null);
  const [customTaskDayId, setCustomTaskDayId] = useState<string | null>(null);
  const [customTaskText, setCustomTaskText] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateNewPlan(goal, timeAvailable, examDate);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Study Plan</span>
          <Sparkles className="w-6 h-6 text-purple-600 fill-purple-600 animate-pulse" />
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Build a practical revision week from your subjects, goal, and available time.
        </p>
      </div>

      {/* Plan Generation Filter Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-600" />
              <span>Goal</span>
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Exam Preparation">Exam Preparation</option>
              <option value="Concept Revision">Concept Revision</option>
              <option value="Homework & Assignments">Homework & Assignments</option>
              <option value="Competitive Test Drill">Competitive Test Drill</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Time Available</span>
            </label>
            <select
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1-2 hours/day">1-2 hours/day</option>
              <option value="3-4 hours/day">3-4 hours/day</option>
              <option value="5-6 hours/day">5-6 hours/day</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Exam Date</span>
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              disabled={isAiTyping}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-300 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isAiTyping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Building Your Study Week...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>Generate Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1">
        <button
          onClick={() => setActiveTab('7day')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === '7day'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          7-Day Plan
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'weekly'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Next 3 Days
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'custom'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Open Tasks
        </button>
      </div>

      {/* Daily Breakdown List */}
      <div className="space-y-4">
        {(activeTab === 'weekly' ? studyPlan.slice(0, 3) : studyPlan)
          .filter(day => activeTab !== 'custom' || day.tasks.some(task => !task.completed))
          .map((day) => (
          <div
            key={day.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs">
                  {day.dayLabel}
                </span>
                <span className="text-xs text-slate-400 font-medium">{day.dateLabel}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenuDayId(activeMenuDayId === day.id ? null : day.id)
                  }
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {activeMenuDayId === day.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10 text-xs">
                    <button
                      onClick={() => { reschedulePlanDay(day.id); setActiveMenuDayId(null); }}
                      className="w-full px-3 py-1.5 text-left text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                    >
                      Move to end
                    </button>
                    <button
                      onClick={() => { setCustomTaskDayId(day.id); setCustomTaskText(''); setActiveMenuDayId(null); }}
                      className="w-full px-3 py-1.5 text-left text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                    >
                      Add Custom Task
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Task list for day */}
            <div className="mt-3.5 space-y-2.5">
              {day.tasks.filter(task => activeTab !== 'custom' || !task.completed).map((task) => (
                <div
                  key={task.id}
                  onClick={() => togglePlanTask(day.id, task.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50/60 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-100 hover:border-purple-200 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      task.completed
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="flex-1 text-xs sm:text-sm font-medium">{task.text}</span>
                  <button
                    type="button"
                    aria-label={`Delete ${task.text}`}
                    onClick={(event) => { event.stopPropagation(); deletePlanTask(day.id, task.id); }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {studyPlan.length === 0 && <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-sm text-slate-500">Choose your goal and available time, then generate a plan to get started.</div>}
      </div>

      {customTaskDayId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addPlanTask(customTaskDayId, customTaskText);
              setCustomTaskDayId(null);
            }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900">Add a custom task</h2>
            <label className="block text-sm font-medium text-slate-600" htmlFor="custom-plan-task">Task</label>
            <input
              id="custom-plan-task"
              autoFocus
              required
              value={customTaskText}
              onChange={(event) => setCustomTaskText(event.target.value)}
              placeholder="e.g. Review chapter notes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setCustomTaskDayId(null)} className="px-4 py-2 font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold">Add Task</button>
            </div>
          </form>
        </div>
      )}

      {/* Footer Informational Tip */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-3 text-amber-900 text-xs sm:text-sm">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
        <p>
          <span className="font-bold">Planning tip:</span> This plan is generated in your browser from your subjects and settings. Adjust it as your workload changes.
        </p>
      </div>
    </div>
  );
};
