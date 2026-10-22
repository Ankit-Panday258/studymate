export type Page =
  | 'landing'
  | 'dashboard'
  | 'subjects'
  | 'assignments'
  | 'study-plan'
  | 'calendar'
  | 'progress'
  | 'ai-assistant';

export interface Subject {
  id: string;
  name: string;
  completedTopics: number;
  totalTopics: number;
  color: string;
  bgColor: string;
  textColor: string;
  icon: 'math' | 'physics' | 'chemistry' | 'biology' | 'english' | 'history' | 'other';
}

export interface TodayTask {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  dayIndex: number; // 0 = Mon, 6 = Sun
  startHour: number; // e.g. 8 for 8 AM, 14 for 2 PM
  durationHours: number;
  category: 'study' | 'assignment' | 'exam' | 'personal';
  timeLabel: string;
}

export interface StudyPlanDay {
  id: string;
  dayLabel: string;
  dateLabel: string;
  accentColor: string;
  tasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  prompts?: string[];
}
