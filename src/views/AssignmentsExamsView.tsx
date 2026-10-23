import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList,
  Calendar,
  Plus,
  Check,
  Clock,
  AlertCircle,
  X,
  Sparkles,
  Trash2
} from 'lucide-react';

export const AssignmentsExamsView: React.FC = () => {
  const {
    assignments,
    toggleAssignment,
    addAssignment,
    deleteAssignment,
    exams,
    addExam,
    deleteExam,
    setCurrentPage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);

  // New assignment form
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignPriority, setAssignPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // New exam form
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState(() => {
    const date = new Date(); date.setDate(date.getDate() + 14);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  });

  const dateLabel = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const daysUntil = (value: string) => {
    const parts = value.split('-').map(Number);
    const target = parts.length === 3
      ? new Date(parts[0], parts[1] - 1, parts[2])
      : new Date(value);
    if (Number.isNaN(target.getTime())) return 0;
    target.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / 86400000);
  };

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === 'Pending') return !a.completed;
    if (activeTab === 'Completed') return a.completed;
    return true;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;
    addAssignment(assignTitle, dateLabel(assignDueDate), assignPriority);
    setAssignTitle('');
    setShowAddAssignment(false);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;
    addExam(examTitle, dateLabel(examDate), Math.max(0, daysUntil(examDate)));
    setExamTitle('');
    setShowAddExam(false);
  };

  const priorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-9">
      {/* SECTION 1: ASSIGNMENTS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Assignments</span>
              <ClipboardList className="w-6 h-6 text-purple-600" />
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Never miss homework, projects, and submission deadlines
            </p>
          </div>

          <button
            onClick={() => setShowAddAssignment(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assignment</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-2">
          {(['All', 'Pending', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Assignment Cards List */}
        <div className="space-y-3">
          {filteredAssignments.map((assign) => (
            <div
              key={assign.id}
              onClick={() => toggleAssignment(assign.id)}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                assign.completed
                  ? 'bg-slate-50/70 border-slate-200 opacity-80'
                  : 'bg-white border-slate-100 hover:border-purple-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    assign.completed
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-slate-300 bg-white hover:border-purple-400'
                  }`}
                >
                  {assign.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <h3
                    className={`text-sm sm:text-base font-bold ${
                      assign.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {assign.title}
                  </h3>
                  <p className="text-xs text-rose-500 font-semibold mt-0.5">
                    Due: {assign.dueDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {priorityBadge(assign.priority)}
                <button
                  type="button"
                  aria-label={`Delete ${assign.title}`}
                  onClick={(event) => { event.stopPropagation(); deleteAssignment(assign.id); }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: UPCOMING EXAMS */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Upcoming Exams</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Countdown timers and preparation targets
            </p>
          </div>

          <button
            onClick={() => setShowAddExam(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam</span>
          </button>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exams.map((exam) => {
            const daysLeft = daysUntil(exam.date);
            const isUrgent = daysLeft <= 10;

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isUrgent ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{exam.title}</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{exam.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isUrgent
                      ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}
                  >
                    {daysLeft < 0 ? 'Past' : daysLeft === 0 ? 'Today' : `${daysLeft} days left`}
                  </span>
                  <button
                    type="button"
                    aria-label={`Delete ${exam.title}`}
                    onClick={() => deleteExam(exam.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Assignment</h3>
              <button onClick={() => setShowAddAssignment(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Chemistry Lab Report"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Priority</label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssignment(false)}
                  className="px-4 py-2 font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExam && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Upcoming Exam</h3>
              <button onClick={() => setShowAddExam(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateExam} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exam Name</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Organic Chemistry Final"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExam(false)}
                  className="px-4 py-2 font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
