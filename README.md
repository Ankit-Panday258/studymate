# 🎓 StudyMate — AI-Powered Study Companion

> *"Plan Smarter, Study Better"*

StudyMate is a modern student productivity and study management application built faithfully from the UI mockups. It combines subject syllabus tracking, task management, exam countdowns, calendar scheduling, and intelligent AI study assistance.

---

## 📱 The 8 Screens Included

1. **Landing Page (`/landing`)**:
   - Modern dark-themed hero with 3D desk aesthetic & glowing stickers ("Plan", "Study", "Achieve").
   - Primary and secondary CTAs (*"Get Started Free"* & *"Watch Demo"*).
   - Social proof metrics (10K+ students, 4.9★ rating, free to use).
   - Quick interactive switcher to preview all 8 workspace modules.

2. **Dashboard (`/dashboard`)**:
   - Personalized student greeting + daily inspirational quote with real-time date.
   - 4 Top KPI metric cards: *4 Subjects*, *12 Pending Tasks*, *2 Upcoming Exams*, *68% Overall Progress*.
   - **Today's Plan**: Interactive checklist with task duration chips, quick-add input, and completion toggles.
   - **7-Day Study Streak**: Visual weekday tracker (`M T W T F S S`), active flame counter, and encouragement indicator (*32% ahead of last week*).

3. **Subjects Page (`/subjects`)**:
   - Directory of subjects (Mathematics, Physics, Chemistry, Biology, English, History).
   - Topic progress counters (e.g. 12/20 topics) and colored progress bars.
   - Interactive topic increment/decrement buttons and `+ Add Subject` modal with custom icons.

4. **AI Study Plan (`/study-plan`)**:
   - AI Study Plan generator: Goal selector (*Exam Preparation*, *Concept Revision*), Daily Study Time (*3-4 hrs/day*), and Exam Date picker.
   - 7-Day Plan / Weekly View / Custom Plan tabs with step-by-step task checklists.
   - Smart dynamic plan generation.

5. **Calendar / Schedule (`/calendar`)**:
   - Weekly time-block grid (8 AM to 10 PM) across Mon–Sun.
   - Color-coded categories: **Study** (Blue), **Assignment** (Amber), **Exam** (Rose), **Personal** (Emerald).
   - Dedicated lunch break slot and modal to add new schedule blocks.

6. **Assignments & Exams (`/assignments`)**:
   - **Assignments section**: Filterable by *All*, *Pending*, *Completed*, with priority tags (*High*, *Medium*, *Low*).
   - **Upcoming Exams section**: Visual cards with calendar icons, dates, and active countdown badges (*8 days left*, *19 days left*, *27 days left*).
   - Working modals to add new assignments and upcoming exams.

7. **Progress Analytics (`/progress`)**:
   - Circular SVG radial progress gauge (68% overall).
   - Metric pill breakdown: *Tasks Completed*, *In Progress*, *Pending*.
   - Per-subject progress comparison bars with color tags.

8. **AI Assistant (`/ai-assistant`)**:
   - Interactive conversational study assistant.
   - 5 Quick prompt shortcuts:
     - 📅 *Create a study plan for my exams*
     - 📑 *Summarize this topic*
     - 💡 *Explain a concept*
     - 📝 *Generate practice questions*
     - 🤝 *Help me stay consistent*
   - Real-time intelligent academic responses and typing simulation.

---

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** (Fast HMR & build)
- **Tailwind CSS 3.4** + Google Fonts (*Plus Jakarta Sans*)
- **Lucide Icons**
- **React Context API** (Real-time synchronization across tasks, progress, streak, and subjects)

---

## 🚀 Running the Project

```bash
# 1. Navigate to the project directory
cd /Users/ankitpandey/.gemini/antigravity/scratch/studymate

# 2. Start the development server
npm run dev
# The app will be accessible at http://localhost:5173/

# 3. Build for production
npm run build
```
