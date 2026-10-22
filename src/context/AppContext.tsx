import React, { createContext, useContext, useState, useEffect } from 'react';
import { Page, Subject, TodayTask, Assignment, Exam, CalendarEvent, StudyPlanDay, ChatMessage } from '../types';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Tasks
  todayTasks: TodayTask[];
  toggleTodayTask: (id: string) => void;
  addTodayTask: (title: string, duration: string) => void;
  
  // Streak
  streakDays: number;
  completedStreakDays: boolean[];
  
  // Subjects
  subjects: Subject[];
  addSubject: (name: string, totalTopics: number, icon: Subject['icon']) => void;
  updateSubjectProgress: (id: string, delta: number) => void;
  
  // Assignments
  assignments: Assignment[];
  toggleAssignment: (id: string) => void;
  addAssignment: (title: string, dueDate: string, priority: 'High' | 'Medium' | 'Low') => void;
  
  // Exams
  exams: Exam[];
  addExam: (title: string, date: string, daysLeft: number) => void;
  
  // AI Study Plan
  studyPlan: StudyPlanDay[];
  togglePlanTask: (dayId: string, taskId: string) => void;
  generateNewPlan: (goal: string, time: string, examDate: string) => void;
  
  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  
  // AI Assistant Chat
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  isAiTyping: boolean;

  // Stats
  overallProgress: number;
}

const initialSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', completedTopics: 12, totalTopics: 20, color: '#3b82f6', bgColor: '#eff6ff', textColor: '#1d4ed8', icon: 'math' },
  { id: '2', name: 'Physics', completedTopics: 8, totalTopics: 15, color: '#8b5cf6', bgColor: '#f5f3ff', textColor: '#6d28d9', icon: 'physics' },
  { id: '3', name: 'Chemistry', completedTopics: 10, totalTopics: 18, color: '#06b6d4', bgColor: '#ecfeff', textColor: '#0e7490', icon: 'chemistry' },
  { id: '4', name: 'Biology', completedTopics: 14, totalTopics: 20, color: '#10b981', bgColor: '#ecfdf5', textColor: '#047857', icon: 'biology' },
  { id: '5', name: 'English', completedTopics: 6, totalTopics: 10, color: '#ec4899', bgColor: '#fdf2f8', textColor: '#be185d', icon: 'english' },
  { id: '6', name: 'History', completedTopics: 4, totalTopics: 12, color: '#f97316', bgColor: '#fff7ed', textColor: '#c2410c', icon: 'history' },
];

const initialTodayTasks: TodayTask[] = [
  { id: 't1', title: 'Complete Maths Chapter 5', duration: '2 hrs', completed: true },
  { id: 't2', title: 'Revise Biology notes', duration: '1 hr', completed: false },
  { id: 't3', title: 'Solve Physics numericals', duration: '1.5 hrs', completed: false },
  { id: 't4', title: 'Read English essay examples', duration: '45 min', completed: false },
];

const initialAssignments: Assignment[] = [
  { id: 'a1', title: 'Science Project Report', dueDate: 'Oct 25, 2026', priority: 'High', completed: false },
  { id: 'a2', title: 'Maths Worksheet', dueDate: 'Oct 28, 2026', priority: 'Medium', completed: true },
  { id: 'a3', title: 'English Essay', dueDate: 'Nov 2, 2026', priority: 'Low', completed: false },
  { id: 'a4', title: 'Physics Numericals', dueDate: 'Nov 5, 2026', priority: 'Medium', completed: false },
];

const initialExams: Exam[] = [
  { id: 'e1', title: 'Maths Midterm', date: 'Oct 30, 2026', daysLeft: 8 },
  { id: 'e2', title: 'Science Final', date: 'Nov 10, 2026', daysLeft: 19 },
  { id: 'e3', title: 'History Unit Test', date: 'Nov 18, 2026', daysLeft: 27 },
];

const initialPlan: StudyPlanDay[] = [
  {
    id: 'd1',
    dayLabel: 'Mon, Oct 23',
    dateLabel: '2 hrs + 1 hr',
    accentColor: 'border-l-blue-500 bg-blue-50/40',
    tasks: [
      { id: 'p1', text: 'Maths – Chapter 5 (2 hrs)', completed: false },
      { id: 'p2', text: 'Science – Revise notes (1 hr)', completed: false },
    ],
  },
  {
    id: 'd2',
    dayLabel: 'Tue, Oct 24',
    dateLabel: '1 hr + 2 hrs',
    accentColor: 'border-l-orange-500 bg-orange-50/40',
    tasks: [
      { id: 'p3', text: 'English – Essay writing (1 hr)', completed: false },
      { id: 'p4', text: 'Maths – Practice questions (2 hrs)', completed: false },
    ],
  },
  {
    id: 'd3',
    dayLabel: 'Wed, Oct 25',
    dateLabel: '2 hrs + 1 hr',
    accentColor: 'border-l-emerald-500 bg-emerald-50/40',
    tasks: [
      { id: 'p5', text: 'Science – Project work (2 hrs)', completed: false },
      { id: 'p6', text: 'History – Chapter 3 (1 hr)', completed: false },
    ],
  },
  {
    id: 'd4',
    dayLabel: 'Thu, Oct 26',
    dateLabel: '1 hr + 1 hr',
    accentColor: 'border-l-amber-500 bg-amber-50/40',
    tasks: [
      { id: 'p7', text: 'Mock test – Maths (1 hr)', completed: false },
      { id: 'p8', text: 'Revise weak topics (1 hr)', completed: false },
    ],
  },
];

const initialCalendarEvents: CalendarEvent[] = [
  { id: 'c1', title: 'Maths Ch 5', dayIndex: 0, startHour: 8, durationHours: 2, category: 'study', timeLabel: '8 - 10 AM' },
  { id: 'c2', title: 'English Essay', dayIndex: 1, startHour: 8, durationHours: 2, category: 'assignment', timeLabel: '8 - 10 AM' },
  { id: 'c3', title: 'Physics Numericals', dayIndex: 2, startHour: 8, durationHours: 2, category: 'study', timeLabel: '8 - 10 AM' },
  { id: 'c4', title: 'Biology Notes', dayIndex: 3, startHour: 8, durationHours: 2, category: 'study', timeLabel: '8 - 10 AM' },
  { id: 'c5', title: 'Chemistry Ch 4', dayIndex: 4, startHour: 8, durationHours: 2, category: 'study', timeLabel: '8 - 10 AM' },
  
  { id: 'c6', title: 'Science Project', dayIndex: 0, startHour: 14, durationHours: 2, category: 'study', timeLabel: '2 - 4 PM' },
  { id: 'c7', title: 'Maths Practice', dayIndex: 2, startHour: 14, durationHours: 2, category: 'assignment', timeLabel: '2 - 4 PM' },
  { id: 'c8', title: 'History Ch 3', dayIndex: 3, startHour: 14, durationHours: 1.5, category: 'study', timeLabel: '2 - 3:30 PM' },
  { id: 'c9', title: 'Mock Test', dayIndex: 4, startHour: 14, durationHours: 2, category: 'exam', timeLabel: '2 - 4 PM' },
  { id: 'c10', title: 'Free Time', dayIndex: 5, startHour: 14, durationHours: 2, category: 'personal', timeLabel: '2 - 4 PM' },

  { id: 'c11', title: 'Revise Notes', dayIndex: 0, startHour: 18, durationHours: 1, category: 'study', timeLabel: '6 - 7 PM' },
  { id: 'c12', title: 'Doubt Solving', dayIndex: 2, startHour: 18, durationHours: 1, category: 'personal', timeLabel: '6 - 7 PM' },
  { id: 'c13', title: 'Read', dayIndex: 0, startHour: 20, durationHours: 1, category: 'personal', timeLabel: '8 - 9 PM' },
  { id: 'c14', title: 'Plan Next Week', dayIndex: 4, startHour: 20, durationHours: 1, category: 'personal', timeLabel: '8 - 9 PM' },
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: "Hi! I'm your StudyMate AI 👋\nI can help you with study plans, summaries, explanations, and more. What do you want to know?",
    timestamp: 'Just now',
    prompts: [
      'Create a study plan for my exams',
      'Summarize this topic',
      'Explain a concept',
      'Generate practice questions',
      'Help me stay consistent',
    ],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>(initialTodayTasks);
  const [streakDays, setStreakDays] = useState(7);
  const [completedStreakDays] = useState<boolean[]>([true, true, true, true, true, true, false]);
  
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  
  const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>(initialPlan);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Calculate overall progress from subjects + tasks
  const totalTopics = subjects.reduce((acc, s) => acc + s.totalTopics, 0);
  const completedTopics = subjects.reduce((acc, s) => acc + s.completedTopics, 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 68;

  const toggleTodayTask = (id: string) => {
    setTodayTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTodayTask = (title: string, duration: string) => {
    const newTask: TodayTask = {
      id: `task-${Date.now()}`,
      title,
      duration: duration || '1 hr',
      completed: false,
    };
    setTodayTasks(prev => [newTask, ...prev]);
  };

  const addSubject = (name: string, totalTopics: number, icon: Subject['icon']) => {
    const colors = [
      { color: '#8b5cf6', bg: '#f5f3ff', text: '#6d28d9' },
      { color: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
      { color: '#10b981', bg: '#ecfdf5', text: '#047857' },
      { color: '#f59e0b', bg: '#fef3c7', text: '#b45309' },
      { color: '#ec4899', bg: '#fdf2f8', text: '#be185d' },
    ];
    const picked = colors[subjects.length % colors.length];
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name,
      completedTopics: 0,
      totalTopics: totalTopics || 10,
      color: picked.color,
      bgColor: picked.bg,
      textColor: picked.text,
      icon,
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubjectProgress = (id: string, delta: number) => {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id === id) {
          const updated = Math.min(Math.max(s.completedTopics + delta, 0), s.totalTopics);
          return { ...s, completedTopics: updated };
        }
        return s;
      })
    );
  };

  const toggleAssignment = (id: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const addAssignment = (title: string, dueDate: string, priority: 'High' | 'Medium' | 'Low') => {
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title,
      dueDate,
      priority,
      completed: false,
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const addExam = (title: string, date: string, daysLeft: number) => {
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title,
      date,
      daysLeft,
    };
    setExams(prev => [...prev, newExam]);
  };

  const togglePlanTask = (dayId: string, taskId: string) => {
    setStudyPlan(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            tasks: day.tasks.map(t =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          };
        }
        return day;
      })
    );
  };

  const generateNewPlan = (goal: string, time: string, examDate: string) => {
    setIsAiTyping(true);
    setTimeout(() => {
      const generatedPlan: StudyPlanDay[] = [
        {
          id: `plan-1-${Date.now()}`,
          dayLabel: 'Day 1 (Foundation)',
          dateLabel: `${time} focus`,
          accentColor: 'border-l-purple-500 bg-purple-50/40',
          tasks: [
            { id: 'g1', text: `Core Concept Review for ${goal} (1.5 hrs)`, completed: false },
            { id: 'g2', text: 'Formula sheet and key definition flashcards (1 hr)', completed: false },
          ],
        },
        {
          id: `plan-2-${Date.now()}`,
          dayLabel: 'Day 2 (Problem Solving)',
          dateLabel: `${time} focus`,
          accentColor: 'border-l-blue-500 bg-blue-50/40',
          tasks: [
            { id: 'g3', text: 'High-weightage chapter numericals & derivations (2 hrs)', completed: false },
            { id: 'g4', text: 'Error log review and self-test (1 hr)', completed: false },
          ],
        },
        {
          id: `plan-3-${Date.now()}`,
          dayLabel: 'Day 3 (Timed Mock Drill)',
          dateLabel: `${time} focus`,
          accentColor: 'border-l-emerald-500 bg-emerald-50/40',
          tasks: [
            { id: 'g5', text: `Full length past paper practice for exam (${examDate}) (2 hrs)`, completed: false },
            { id: 'g6', text: 'AI answer evaluation & doubt clarification (1 hr)', completed: false },
          ],
        },
        {
          id: `plan-4-${Date.now()}`,
          dayLabel: 'Day 4 (Final Polish)',
          dateLabel: `${time} focus`,
          accentColor: 'border-l-amber-500 bg-amber-50/40',
          tasks: [
            { id: 'g7', text: 'High-speed revision of marked difficult questions (1.5 hrs)', completed: false },
            { id: 'g8', text: 'Mind mapping & memory recall drill (45 min)', completed: false },
          ],
        },
      ];
      setStudyPlan(generatedPlan);
      setIsAiTyping(false);
    }, 900);
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = "I'm here to help you ace your studies! What specific topic would you like to review?";
      const lower = text.toLowerCase();

      if (lower.includes('plan') || lower.includes('exam')) {
        reply = "Here is a quick exam prep strategy: 1) Allocate 40% of your time to high-yield topics in Mathematics & Physics. 2) Use active recall with 25-minute Pomodoro sprints. 3) Take a 1-hour mock exam every 3 days. I've updated your AI Study Plan tab with fresh suggestions!";
      } else if (lower.includes('summarize') || lower.includes('summary')) {
        reply = "Give me any textbook excerpt, chapter name, or topic notes, and I'll generate a crisp bullet-point summary, key formulas, and high-frequency exam questions!";
      } else if (lower.includes('explain') || lower.includes('concept')) {
        reply = "Sure! Let's break it down using the Feynman Technique: I'll give you a simple analogy, explain the step-by-step logic, and then test your understanding with a short scenario question. Which concept are we looking at?";
      } else if (lower.includes('practice') || lower.includes('question')) {
        reply = "Here are 3 quick practice questions to test your grasp:\n1. Physics: Calculate the work done when a 50N force moves an object 4m at a 60° angle.\n2. Biology: Explain the primary difference between mitosis and meiosis in terms of chromosome number.\n3. Mathematics: Find the roots of the quadratic equation 2x² - 7x + 3 = 0.";
      } else if (lower.includes('consistent') || lower.includes('habit') || lower.includes('streak')) {
        reply = "You're already on a 7-day study streak! 🔥 To maintain momentum:\n• Never miss two days in a row.\n• Start each study session with the easiest 5-minute task.\n• Set a consistent time block on your calendar every day.";
      }

      const botMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: 'Just now',
      };

      setChatMessages(prev => [...prev, botMsg]);
      setIsAiTyping(false);
    }, 700);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        searchQuery,
        setSearchQuery,
        todayTasks,
        toggleTodayTask,
        addTodayTask,
        streakDays,
        completedStreakDays,
        subjects,
        addSubject,
        updateSubjectProgress,
        assignments,
        toggleAssignment,
        addAssignment,
        exams,
        addExam,
        studyPlan,
        togglePlanTask,
        generateNewPlan,
        calendarEvents,
        addCalendarEvent,
        chatMessages,
        sendMessage,
        isAiTyping,
        overallProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
