import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subject } from '../types';
import {
  Plus,
  BookOpen,
  Atom,
  FlaskConical,
  Leaf,
  GraduationCap,
  Landmark,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  BarChart2
} from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const { subjects, addSubject, updateSubjectProgress, setCurrentPage } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTotalTopics, setNewTotalTopics] = useState(15);
  const [selectedIcon, setSelectedIcon] = useState<Subject['icon']>('math');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  const renderSubjectIcon = (icon: Subject['icon'], color: string) => {
    switch (icon) {
      case 'math':
        return <BookOpen className="w-5 h-5" style={{ color }} />;
      case 'physics':
        return <Atom className="w-5 h-5" style={{ color }} />;
      case 'chemistry':
        return <FlaskConical className="w-5 h-5" style={{ color }} />;
      case 'biology':
        return <Leaf className="w-5 h-5" style={{ color }} />;
      case 'english':
        return <GraduationCap className="w-5 h-5" style={{ color }} />;
      case 'history':
        return <Landmark className="w-5 h-5" style={{ color }} />;
      default:
        return <BookOpen className="w-5 h-5" style={{ color }} />;
    }
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject(newSubjectName, newTotalTopics, selectedIcon);
    setNewSubjectName('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Subjects
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track syllabus completion, revision status, and study topics
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          const percentage = Math.round((sub.completedTopics / sub.totalTopics) * 100);
          const isSelected = activeSubjectId === sub.id;

          return (
            <div
              key={sub.id}
              onClick={() => setActiveSubjectId(isSelected ? null : sub.id)}
              className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'border-purple-400 ring-2 ring-purple-100 shadow-md'
                  : 'border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform"
                    style={{ backgroundColor: sub.bgColor }}
                  >
                    {renderSubjectIcon(sub.icon, sub.color)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{sub.name}</h3>
                    <p className="text-xs font-semibold text-slate-400">
                      {sub.completedTopics} / {sub.totalTopics} topics
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">{percentage}%</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isSelected ? 'rotate-90 text-purple-600' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: sub.color,
                    }}
                  />
                </div>
              </div>

              {/* Expandable Topic Control Drawer */}
              {isSelected && (
                <div
                  className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs font-semibold text-slate-500">Update Completed Topics:</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateSubjectProgress(sub.id, -1)}
                        disabled={sub.completedTopics <= 0}
                        className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm font-bold disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-2">
                        {sub.completedTopics} of {sub.totalTopics}
                      </span>
                      <button
                        onClick={() => updateSubjectProgress(sub.id, 1)}
                        disabled={sub.completedTopics >= sub.totalTopics}
                        className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center text-sm font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => setCurrentPage('ai-assistant')}
                      className="flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:underline"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Study with AI</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add New Subject</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubjectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g. Computer Science, Economics"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Syllabus Topics/Chapters
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newTotalTopics}
                  onChange={(e) => setNewTotalTopics(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Subject Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { id: 'math', icon: '📐' },
                    { id: 'physics', icon: '⚛️' },
                    { id: 'chemistry', icon: '🧪' },
                    { id: 'biology', icon: '🌿' },
                    { id: 'english', icon: '📖' },
                    { id: 'history', icon: '🏛️' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIcon(item.id as any)}
                      className={`h-11 rounded-xl flex items-center justify-center text-lg border transition-all ${
                        selectedIcon === item.id
                          ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold scale-105 ring-2 ring-purple-100'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
