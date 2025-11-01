import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './Components/Sidebar';
import DashboardStats from './Components/DashboardStats';
import ProjectList from './Components/ProjectList';
import ClientList from './pages/ClientList';
import PaymentHistory from './pages/PaymentHistory';

function MainContent() {
  const { state } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <DashboardStats />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h3>
              <ProjectList projects={state.projects.slice(0, 5)} />
            </div>
          </div>
        );
      case 'clients':
        return <ClientList />;
      case 'projects':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">All Projects</h2>
            <ProjectList projects={state.projects} />
          </div>
        );
      case 'payments':
        return <PaymentHistory />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        currentView={currentView}
        onViewChange={setCurrentView}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main content - full width when sidebar is hidden */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;