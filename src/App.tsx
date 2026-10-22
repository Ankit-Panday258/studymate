import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { SubjectsView } from './views/SubjectsView';
import { StudyPlanView } from './views/StudyPlanView';
import { CalendarView } from './views/CalendarView';
import { AssignmentsExamsView } from './views/AssignmentsExamsView';
import { ProgressView } from './views/ProgressView';
import { AIAssistantView } from './views/AIAssistantView';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();

  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  const renderActiveView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;
      case 'subjects':
        return <SubjectsView />;
      case 'study-plan':
        return <StudyPlanView />;
      case 'calendar':
        return <CalendarView />;
      case 'assignments':
        return <AssignmentsExamsView />;
      case 'progress':
        return <ProgressView />;
      case 'ai-assistant':
        return <AIAssistantView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
