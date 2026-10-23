import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  Calendar as CalendarIcon,
  Trash2
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent } = useApp();
  const mondayOf = (value: Date) => {
    const date = new Date(value); date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return date;
  };
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for adding custom event
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<CalendarEvent['category']>('study');
  const [eventDay, setEventDay] = useState(0);
  const [eventStartHour, setEventStartHour] = useState(10);
  const [eventDuration, setEventDuration] = useState(2);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart); date.setDate(weekStart.getDate() + index);
    return { name: date.toLocaleDateString(undefined, { weekday: 'short' }), date: date.getDate() };
  });
  const weekLabel = `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const timeSlots = [
    { label: '8 AM', hour: 8 },
    { label: '10 AM', hour: 10 },
    { label: '12 PM', hour: 12 },
    { label: '2 PM', hour: 14 },
    { label: '4 PM', hour: 16 },
    { label: '6 PM', hour: 18 },
    { label: '8 PM', hour: 20 },
    { label: '10 PM', hour: 22 },
  ];

  const categoryStyles: Record<
    CalendarEvent['category'],
    { bg: string; text: string; border: string; label: string }
  > = {
    study: {
      bg: 'bg-blue-100/80',
      text: 'text-blue-900',
      border: 'border-blue-300',
      label: 'Study',
    },
    assignment: {
      bg: 'bg-amber-100/80',
      text: 'text-amber-900',
      border: 'border-amber-300',
      label: 'Assignment',
    },
    exam: {
      bg: 'bg-rose-100/80',
      text: 'text-rose-900',
      border: 'border-rose-300',
      label: 'Exam',
    },
    personal: {
      bg: 'bg-emerald-100/80',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      label: 'Personal',
    },
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addCalendarEvent({
      title: eventTitle,
      dayIndex: eventDay,
      startHour: eventStartHour,
      durationHours: eventDuration,
      category: eventCategory,
      timeLabel: `${eventStartHour}:00 - ${eventStartHour + eventDuration}:00`,
    });

    setEventTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Calendar</span>
            <CalendarIcon className="w-6 h-6 text-purple-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Weekly time blocks, focused study sprints, and deadlines
          </p>
        </div>

        {/* Center Date Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={() => setWeekStart(mondayOf(new Date()))} className="px-3 py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100">
              Today
            </button>
            <button onClick={() => setWeekStart(date => new Date(date.getTime() - 7 * 86400000))} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Previous week">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setWeekStart(date => new Date(date.getTime() + 7 * 86400000))} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Next week">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs sm:text-sm font-bold text-slate-800 px-2">
            {weekLabel}
          </span>

          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            title="Add Block"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm overflow-x-auto">
        <div className="min-w-[760px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-slate-100 pb-3">
            <div className="text-xs font-bold text-slate-400 pl-2">Time</div>
            {days.map((d, index) => (
              <div key={index} className="text-center">
                <span className="text-xs font-medium text-slate-400">{d.name}</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.date}</p>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-100">
            {timeSlots.map((slot) => {
              const isLunch = slot.hour === 12;

              return (
                <div key={slot.hour} className="grid grid-cols-8 min-h-[56px] items-stretch">
                  {/* Time label on left */}
                  <div className="text-[11px] font-semibold text-slate-400 py-3 pl-2 flex items-start">
                    {slot.label}
                  </div>

                  {/* 7 Day slots */}
                  {days.map((_, dayIndex) => {
                    // Check if lunch break row
                    if (isLunch && dayIndex === 0) {
                      return (
                        <div
                          key={dayIndex}
                          className="col-span-7 my-1.5 mx-1 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <span>☕</span>
                          <span>Lunch Break (12:00 PM – 1:00 PM)</span>
                        </div>
                      );
                    }
                    if (isLunch && dayIndex > 0) return null;

                    // Match events that start at this hour
                    const eventsInSlot = calendarEvents.filter(
                      (e) => e.dayIndex === dayIndex && e.startHour === slot.hour
                    );

                    return (
                      <div
                        key={dayIndex}
                        className="border-l border-slate-100 p-1 flex flex-col gap-1 relative min-h-[56px]"
                      >
                        {eventsInSlot.map((evt) => {
                          const style = categoryStyles[evt.category];
                          return (
                            <div
                              key={evt.id}
                              className={`p-2 rounded-xl text-left border text-xs shadow-xs transition-transform hover:scale-[1.02] cursor-pointer ${style.bg} ${style.border} ${style.text}`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <p className="font-bold leading-tight truncate">{evt.title}</p>
                                <button
                                  type="button"
                                  aria-label={`Delete ${evt.title}`}
                                  onClick={() => deleteCalendarEvent(evt.id)}
                                  className="shrink-0 text-slate-500 hover:text-rose-700"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[10px] opacity-75 mt-0.5">{evt.timeLabel}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend at bottom */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs font-semibold text-slate-600">Study</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs font-semibold text-slate-600">Assignment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-xs font-semibold text-slate-600">Exam</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-semibold text-slate-600">Personal</span>
        </div>
      </div>

      {/* Add Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Schedule Block</h3>
            <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Physics Formula Recall"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Day</label>
                  <select
                    value={eventDay}
                    onChange={(e) => setEventDay(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200"
                  >
                    {days.map((d, i) => (
                      <option key={i} value={i}>
                        {d.name} {d.date}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={eventStartHour}
                    onChange={(e) => setEventStartHour(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200"
                  >
                    {timeSlots.map((s) => (
                      <option key={s.hour} value={s.hour}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200"
                >
                  <option value="study">Study (Blue)</option>
                  <option value="assignment">Assignment (Orange)</option>
                  <option value="exam">Exam (Pink)</option>
                  <option value="personal">Personal (Green)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
