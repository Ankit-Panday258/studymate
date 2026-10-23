import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Star,
  Target,
  Gift,
  BookOpen,
  Calendar,
  BrainCircuit,
  TrendingUp,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-[#0f111a] text-white selection:bg-purple-500 selection:text-white overflow-x-hidden font-sans">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Study<span className="text-purple-400">Mate</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-purple-400 transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Your Local Study Planner</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Plan Smarter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                Study Better
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Organize your subjects, track assignments, prepare for exams and build a practical
              study plan — all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/40 transition-all hover:translate-x-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('ai-assistant')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm sm:text-base transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>Study Plans</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Track Progress</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <Calendar className="w-4 h-4 text-pink-400" />
                <span>Manage Exams</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Stay Consistent</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image / 3D Desk Illustration Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-900/40 bg-gradient-to-br from-purple-900/40 via-indigo-950/50 to-slate-900/80 p-2">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                  alt="Student Study Desk with Laptop and warm lighting"
                  className="w-full h-80 sm:h-96 object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                />
                
                {/* Overlay stickers & interactive mockup highlights */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-purple-950/30 to-transparent flex flex-col justify-between p-6">
                  {/* Floating tags */}
                  <div className="flex justify-end gap-2">
                    <div className="bg-purple-900/80 backdrop-blur-md border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-purple-200 font-mono shadow-lg">
                      <span className="text-purple-400 font-bold">✓</span> Plan • Study • Achieve
                    </div>
                  </div>

                  {/* Motivational sticky note badge */}
                  <div className="self-end bg-pink-500/20 backdrop-blur-md border border-pink-400/30 text-pink-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg">
                    Small steps, Big results 💖
                  </div>

                  {/* StudyMate interactive preview card on desk */}
                  <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">StudyMate Workspace</p>
                        <p className="text-[11px] text-purple-300">Daily Goal: 4 hrs • 7 Day Streak 🔥</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentPage('dashboard')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Open App</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing background halo */}
            <div className="absolute -inset-4 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center gap-3.5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">10K+</p>
                <p className="text-xs text-slate-400">Active Students</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3.5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">4.9 ★</p>
                <p className="text-xs text-slate-400">Student Rating</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3.5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">Smarter</p>
                <p className="text-xs text-slate-400">Study Habits</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3.5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">Free</p>
                <p className="text-xs text-slate-400">To Use Forever</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screen Gallery Navigation Quick Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-800">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Interactive Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Explore All 8 Modules Designed For You
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Click any module below to jump directly into the live workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'dashboard', title: '2. Dashboard', desc: 'Daily plan, metrics & 7-day study streak', icon: '📊' },
            { id: 'subjects', title: '3. Subjects', desc: 'Track chapters and completion across topics', icon: '📚' },
            { id: 'study-plan', title: '4. Study Plan', desc: 'A subject-based revision routine for exam preparation', icon: '✨' },
            { id: 'calendar', title: '5. Calendar', desc: 'Color-coded weekly timeline & hourly blocks', icon: '🗓️' },
            { id: 'assignments', title: '6. Assignments & Exams', desc: 'Countdown badges & priority-sorted tasks', icon: '📝' },
            { id: 'progress', title: '7. Progress Analytics', desc: 'Radial gauge & subject breakdown analytics', icon: '📈' },
            { id: 'ai-assistant', title: '8. Study Helper', desc: 'Local study prompts and simple note summaries', icon: '🤖' },
            { id: 'landing', title: '1. Landing Page', desc: 'You are currently on the Home view', icon: '🏠' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as any)}
              className="p-5 rounded-2xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-600/50 text-left transition-all group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
