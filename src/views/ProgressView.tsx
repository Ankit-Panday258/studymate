import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { subjects, overallProgress, todayTasks, assignments } = useApp();
  const [timeRange, setTimeRange] = useState('This Month');

  // SVG circular gauge calculations
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  const completedCount = 12 + todayTasks.filter((t) => t.completed).length;
  const inProgressCount = 6;
  const pendingCount = todayTasks.filter((t) => !t.completed).length + assignments.filter((a) => !a.completed).length;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7">
      {/* Header with Time Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Your Progress</span>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time analytics on syllabus coverage, tasks, and efficiency
          </p>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Semester 1">Semester 1</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* Main Radial Progress Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center my-3">
          <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
            <circle
              stroke="#f1f5f9"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="#8b5cf6"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* Centered Metric */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {overallProgress}%
            </span>
          </div>
        </div>

        {/* Text under gauge */}
        <div className="mt-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Overall Progress</h2>
          <p className="text-xs sm:text-sm text-purple-700 font-semibold mt-0.5">
            You're doing great! 🎉
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 w-full max-w-lg border-t border-slate-100 pt-5">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <p className="text-xl sm:text-2xl font-black text-slate-900">{completedCount}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Tasks Completed</p>
          </div>

          <div className="bg-purple-50/60 rounded-2xl p-3 border border-purple-100">
            <p className="text-xl sm:text-2xl font-black text-purple-700">{inProgressCount}</p>
            <p className="text-[11px] font-semibold text-purple-600 mt-0.5">In Progress</p>
          </div>

          <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-100">
            <p className="text-xl sm:text-2xl font-black text-amber-700">{pendingCount}</p>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">Pending</p>
          </div>
        </div>
      </div>

      {/* Subject Progress Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm text-left space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Subject Progress</h2>
          <p className="text-xs text-slate-400">Detailed syllabus completion across topics</p>
        </div>

        <div className="space-y-4 pt-1">
          {subjects.map((sub) => {
            const percentage = Math.round((sub.completedTopics / sub.totalTopics) * 100);

            return (
              <div key={sub.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                    <span className="text-slate-800">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs">
                      {sub.completedTopics}/{sub.totalTopics} topics
                    </span>
                    <span className="text-slate-900 font-bold">{percentage}%</span>
                  </div>
                </div>

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
            );
          })}
        </div>
      </div>

      {/* Tip Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-3 text-amber-900 text-xs sm:text-sm">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
        <p>
          <span className="font-bold">Tip:</span> Keep a study streak to build consistency!
        </p>
      </div>
    </div>
  );
};
