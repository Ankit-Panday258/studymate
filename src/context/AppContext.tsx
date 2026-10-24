import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Page, Subject, TodayTask, Assignment, Exam, CalendarEvent, StudyPlanDay, ChatMessage } from '../types';
import { appwriteConfigured, appwriteMissing, connectAndLoad, saveCollection, getCurrentUser, loginAccount, registerAccount, logoutAccount } from '../services/appwrite';
import type { AuthUser } from '../services/appwrite';
import { generateStudyReply, loadLocalStudyModel } from '../services/localAi';

type StudyAiStatus = 'idle' | 'loading' | 'ready' | 'error';

interface AppContextType {
  syncStatus: 'local' | 'connecting' | 'connected' | 'error';
  syncError: string | null;
  retrySync: () => void;
  authUser: AuthUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Tasks
  todayTasks: TodayTask[];
  toggleTodayTask: (id: string) => void;
  addTodayTask: (title: string, duration: string) => void;
  deleteTodayTask: (id: string) => void;
  
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
  deleteAssignment: (id: string) => void;
  
  // Exams
  exams: Exam[];
  addExam: (title: string, date: string, daysLeft: number) => void;
  deleteExam: (id: string) => void;
  
  // AI Study Plan
  studyPlan: StudyPlanDay[];
  togglePlanTask: (dayId: string, taskId: string) => void;
  addPlanTask: (dayId: string, text: string) => void;
  deletePlanTask: (dayId: string, taskId: string) => void;
  reschedulePlanDay: (dayId: string) => void;
  generateNewPlan: (goal: string, time: string, examDate: string) => void;
  
  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  
  // AI Assistant Chat
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  isAiTyping: boolean;
  studyAiStatus: StudyAiStatus;
  studyAiProgress: string;
  studyAiError: string | null;
  enableStudyAi: () => Promise<void>;

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
    content: "Hi! I'm your StudyMate study helper 👋\nEnable free on-device AI for explanations, study plans, note summaries, and practice questions. Your chat stays in this browser; the model is downloaded once before first use.",
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

function createBasicStudyReply(text: string, subjects: Subject[], exams: Exam[]): string {
  const lower = text.toLowerCase();
  let reply = `Try one focused 25-minute session for ${subjects[0]?.name ?? 'your current subject'}, then take a 5-minute break. Tell me a topic or paste notes and I can help make a study prompt.`;

  if (/\b(?:plan|planning|schedule|exam|exams)\b/.test(lower)) {
    const nextExam = [...exams].sort((a, b) => Date.parse(a.date) - Date.parse(b.date))[0];
    const daysLeft = nextExam ? Math.max(0, Math.ceil((Date.parse(nextExam.date) - Date.now()) / 86400000)) : 0;
    reply = nextExam
      ? `Your next listed exam is ${nextExam.title} (${daysLeft} days left). Start with priority topics: use a short recall session, practice questions, then review errors. Open Study Plan to build a subject-based week.`
      : 'Add an exam and its date in Assignments & Exams, then use Study Plan to create a focused revision week.';
  } else if (/\b(?:summarize|summarise|summary)\b/.test(lower)) {
    const passage = text.replace(/summari[sz]e|summary|this topic|these notes/ig, '').replace(/[:\n]/g, ' ').trim();
    const sentences = passage.match(/[^.!?]+[.!?]?/g)?.map(sentence => sentence.trim()).filter(Boolean) ?? [];
    reply = sentences.length > 1
      ? `Key points from your text:\n• ${sentences.slice(0, 4).join('\n• ')}\n\nThis is a basic sentence extraction; compare it with your source notes.`
      : 'Paste a paragraph or notes after “summarize” and I can extract the main sentences.';
  } else if (/\b(?:explain|concept)\b/.test(lower)) {
    const topic = text.replace(/explain|concept|please/ig, '').trim() || 'your topic';
    reply = `Try the Feynman method for ${topic}: explain it in plain language, find the first step you cannot explain, review that part, then explain it again without notes.`;
  } else if (/\b(?:practice|question|questions|quiz)\b/.test(lower)) {
    const topic = text.replace(/generate|practice|questions?|for/ig, '').trim() || subjects[0]?.name || 'your topic';
    reply = `Practice prompts for ${topic}:\n1. Define the central idea without notes.\n2. Solve one representative problem and show each step.\n3. Give a real-world example and explain one common mistake.`;
  }

  return reply;
}

const STORAGE_KEY = 'studymate:v1';
const STUDY_AI_OPT_IN_KEY = 'studymate:study-ai-opt-in';
type SavedState = {
  currentPage: Page; todayTasks: TodayTask[]; streakDays: number; subjects: Subject[];
  assignments: Assignment[]; exams: Exam[]; studyPlan: StudyPlanDay[];
  calendarEvents: CalendarEvent[]; chatMessages: ChatMessage[];
};

function readSavedState(): Partial<SavedState> {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as Partial<SavedState> : {};
  } catch {
    return {};
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedState] = useState(readSavedState);
  const [currentPage, setCurrentPage] = useState<Page>(savedState.currentPage ?? 'dashboard');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>(savedState.todayTasks ?? initialTodayTasks);
  const [streakDays] = useState(savedState.streakDays ?? 7);
  const [completedStreakDays] = useState<boolean[]>([true, true, true, true, true, true, false]);
  
  const [subjects, setSubjects] = useState<Subject[]>(savedState.subjects ?? initialSubjects);
  const [assignments, setAssignments] = useState<Assignment[]>(savedState.assignments ?? initialAssignments);
  const [exams, setExams] = useState<Exam[]>(savedState.exams ?? initialExams);
  
  const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>(savedState.studyPlan ?? initialPlan);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(savedState.calendarEvents ?? initialCalendarEvents);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(savedState.chatMessages ?? initialChatMessages);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [studyAiStatus, setStudyAiStatus] = useState<StudyAiStatus>('idle');
  const [studyAiProgress, setStudyAiProgress] = useState('');
  const [studyAiError, setStudyAiError] = useState<string | null>(null);
  const studyAiInitializationStarted = useRef(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'connecting' | 'connected' | 'error'>(appwriteConfigured ? 'connecting' : 'local');
  const [syncError, setSyncError] = useState<string | null>(appwriteConfigured ? null : `Local only. Missing Appwrite settings: ${appwriteMissing.join(', ')}`);
  const [syncRevision, setSyncRevision] = useState(0);
  const [syncOwner, setSyncOwner] = useState<string | null>(null);
  const syncQueue = useRef<Promise<void>>(Promise.resolve());
  const lastConnectedOwner = useRef<string | null>(null);

  const retrySync = () => setSyncRevision(value => value + 1);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then(user => { if (!cancelled) setAuthUser(user); })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setAuthLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string) => {
    const user = await loginAccount(email, password);
    setAuthUser(user);
    setCurrentPage('dashboard');
    retrySync();
  };

  const register = async (name: string, email: string, password: string) => {
    const user = await registerAccount(name, email, password);
    setAuthUser(user);
    setCurrentPage('dashboard');
    retrySync();
  };

  const logout = async () => {
    await logoutAccount();
    setAuthUser(null);
    setCurrentPage('landing');
    retrySync();
  };

  useEffect(() => {
    if (!appwriteConfigured) return;
    let cancelled = false;
    setSyncStatus('connecting'); setSyncError(null);
    connectAndLoad().then(async ({ data, ownerId }) => {
      if (cancelled) return;
      if (lastConnectedOwner.current === ownerId) {
        // A retry in the same authenticated session must flush local changes made while offline.
        await Promise.all([
          saveCollection('subjects', subjects, ownerId), saveCollection('todayTasks', todayTasks, ownerId),
          saveCollection('assignments', assignments, ownerId), saveCollection('exams', exams, ownerId),
          saveCollection('calendarEvents', calendarEvents, ownerId), saveCollection('studyPlan', studyPlan, ownerId),
        ]);
      } else {
        if (data.subjects.length) setSubjects(data.subjects); else await saveCollection('subjects', subjects, ownerId);
        if (data.todayTasks.length) setTodayTasks(data.todayTasks); else await saveCollection('todayTasks', todayTasks, ownerId);
        if (data.assignments.length) setAssignments(data.assignments); else await saveCollection('assignments', assignments, ownerId);
        if (data.exams.length) setExams(data.exams); else await saveCollection('exams', exams, ownerId);
        if (data.calendarEvents.length) setCalendarEvents(data.calendarEvents); else await saveCollection('calendarEvents', calendarEvents, ownerId);
        if (data.studyPlan.length) setStudyPlan(data.studyPlan); else await saveCollection('studyPlan', studyPlan, ownerId);
      }
      if (!cancelled) { lastConnectedOwner.current = ownerId; setSyncOwner(ownerId); setSyncStatus('connected'); }
    }).catch(error => {
      if (!cancelled) { setSyncStatus('error'); setSyncError(error instanceof Error ? error.message : 'Could not connect to Appwrite.'); }
    });
    return () => { cancelled = true; };
  // syncRevision intentionally retries the connection while the first render snapshots local state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncRevision]);

  useEffect(() => {
    if (syncStatus !== 'connected' || !syncOwner) return;
    let cancelled = false;
    const snapshot = { subjects, todayTasks, assignments, exams, calendarEvents, studyPlan };
    syncQueue.current = syncQueue.current.catch(() => undefined).then(async () => {
      try {
        await Promise.all([
          saveCollection('subjects', snapshot.subjects, syncOwner), saveCollection('todayTasks', snapshot.todayTasks, syncOwner),
          saveCollection('assignments', snapshot.assignments, syncOwner), saveCollection('exams', snapshot.exams, syncOwner),
          saveCollection('calendarEvents', snapshot.calendarEvents, syncOwner), saveCollection('studyPlan', snapshot.studyPlan, syncOwner),
        ]);
      } catch (error) {
        if (!cancelled) { setSyncStatus('error'); setSyncError(error instanceof Error ? error.message : 'Could not save planner data.'); }
      }
    });
    return () => { cancelled = true; };
  }, [syncStatus, syncOwner, subjects, todayTasks, assignments, exams, calendarEvents, studyPlan]);

  useEffect(() => {
    try {
      const state: SavedState = { currentPage, todayTasks, streakDays, subjects, assignments, exams, studyPlan, calendarEvents, chatMessages };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable or full; the planner remains usable for this session.
    }
  }, [currentPage, todayTasks, streakDays, subjects, assignments, exams, studyPlan, calendarEvents, chatMessages]);

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

  const deleteTodayTask = (id: string) => setTodayTasks(prev => prev.filter(task => task.id !== id));

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

  const deleteAssignment = (id: string) => setAssignments(prev => prev.filter(assignment => assignment.id !== id));

  const addExam = (title: string, date: string, daysLeft: number) => {
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title,
      date,
      daysLeft,
    };
    setExams(prev => [...prev, newExam]);
  };

  const deleteExam = (id: string) => setExams(prev => prev.filter(exam => exam.id !== id));

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

  const addPlanTask = (dayId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setStudyPlan(prev => prev.map(day => day.id === dayId
      ? { ...day, tasks: [...day.tasks, { id: `custom-${Date.now()}`, text: trimmed, completed: false }] }
      : day));
  };

  const deletePlanTask = (dayId: string, taskId: string) => {
    setStudyPlan(prev => prev.map(day => day.id === dayId
      ? { ...day, tasks: day.tasks.filter(task => task.id !== taskId) }
      : day));
  };

  const reschedulePlanDay = (dayId: string) => {
    setStudyPlan(prev => {
      const index = prev.findIndex(day => day.id === dayId);
      if (index < 0 || index === prev.length - 1) return prev;
      return [...prev.filter(day => day.id !== dayId), prev[index]];
    });
  };

  const generateNewPlan = (goal: string, time: string, examDate: string) => {
    setIsAiTyping(true);
    setTimeout(() => {
      const hoursPerDay = time.startsWith('1') ? '1–2 hours' : time.startsWith('5') ? '5–6 hours' : '3–4 hours';
      const orderedSubjects = [...subjects].sort((a, b) => (a.completedTopics / a.totalTopics) - (b.completedTopics / b.totalTopics));
      const start = new Date(); start.setHours(12, 0, 0, 0);
      const end = examDate ? new Date(`${examDate}T12:00:00`) : new Date(start);
      const daysUntilExam = Number.isNaN(end.getTime()) ? 7 : Math.max(1, Math.min(14, Math.ceil((end.getTime() - start.getTime()) / 86400000)));
      const focusSteps = ['Review key concepts and make a short recall sheet', 'Work through practice problems, then check mistakes', 'Use active recall: close your notes and explain the topic', 'Complete a timed quiz and record topics to revisit'];
      const accents = ['border-l-purple-500 bg-purple-50/40', 'border-l-blue-500 bg-blue-50/40', 'border-l-emerald-500 bg-emerald-50/40', 'border-l-amber-500 bg-amber-50/40'];
      const generatedPlan: StudyPlanDay[] = Array.from({ length: Math.min(7, daysUntilExam) }, (_, index) => {
        const date = new Date(start); date.setDate(start.getDate() + index);
        const subject = orderedSubjects[index % Math.max(1, orderedSubjects.length)];
        const secondSubject = orderedSubjects[(index + 1) % Math.max(1, orderedSubjects.length)];
        const label = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const subjectName = subject?.name ?? 'Your next subject';
        return {
          id: `plan-${Date.now()}-${index}`, dayLabel: label, dateLabel: `${hoursPerDay} · ${goal}`,
          accentColor: accents[index % accents.length],
          tasks: [
            { id: `plan-${index}-a`, text: `${subjectName}: ${focusSteps[index % focusSteps.length]} (45 min)`, completed: false },
            { id: `plan-${index}-b`, text: `${secondSubject?.name ?? subjectName}: ${index % 2 ? 'practice questions and review errors' : 'spaced revision and self-test'} (30 min)`, completed: false },
          ],
        };
      });
      setStudyPlan(generatedPlan);
      setIsAiTyping(false);
    }, 250);
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const deleteCalendarEvent = (id: string) => setCalendarEvents(prev => prev.filter(event => event.id !== id));

  const enableStudyAi = async () => {
    if (studyAiInitializationStarted.current || studyAiStatus === 'loading' || studyAiStatus === 'ready') return;
    studyAiInitializationStarted.current = true;
    setStudyAiStatus('loading');
    setStudyAiError(null);
    setStudyAiProgress('Preparing the model…');
    try {
      await loadLocalStudyModel(setStudyAiProgress);
      try {
        localStorage.setItem(STUDY_AI_OPT_IN_KEY, 'true');
      } catch {
        // Keep the AI available for this session if browser storage is unavailable.
      }
      setStudyAiStatus('ready');
      setStudyAiProgress('Model ready on this device.');
    } catch (error) {
      studyAiInitializationStarted.current = false;
      setStudyAiStatus('error');
      setStudyAiError(error instanceof Error ? error.message : 'Could not load the on-device model.');
      setStudyAiProgress('');
    }
  };

  useEffect(() => {
    if (currentPage !== 'ai-assistant') return;
    try {
      if (localStorage.getItem(STUDY_AI_OPT_IN_KEY) === 'true') void enableStudyAi();
    } catch {
      // The user can still enable the model manually for this session.
    }
  }, [currentPage]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isAiTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);
    const conversation = [...chatMessages, userMsg];
    const recentConversation = conversation.slice(-10).map(({ role, content }) => ({ role, content }));
    void (async () => {
      let reply: string;
      try {
        reply = studyAiStatus === 'ready'
          ? await generateStudyReply(recentConversation)
          : createBasicStudyReply(text, subjects, exams);
      } catch {
        reply = `${createBasicStudyReply(text, subjects, exams)}\n\nThe local AI could not answer this time, so this is the basic helper response.`;
      }
      setChatMessages(prev => [...prev, {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: 'Just now',
      }]);
      setIsAiTyping(false);
    })();
  };

  return (
    <AppContext.Provider
      value={{
        syncStatus, syncError, retrySync,
        authUser, authLoading, login, register, logout,
        currentPage,
        setCurrentPage,
        searchQuery,
        setSearchQuery,
        todayTasks,
        toggleTodayTask,
        addTodayTask,
        deleteTodayTask,
        streakDays,
        completedStreakDays,
        subjects,
        addSubject,
        updateSubjectProgress,
        assignments,
        toggleAssignment,
        addAssignment,
        deleteAssignment,
        exams,
        addExam,
        deleteExam,
        studyPlan,
        togglePlanTask,
        addPlanTask,
        deletePlanTask,
        reschedulePlanDay,
        generateNewPlan,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        chatMessages,
        sendMessage,
        isAiTyping,
        studyAiStatus,
        studyAiProgress,
        studyAiError,
        enableStudyAi,
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
