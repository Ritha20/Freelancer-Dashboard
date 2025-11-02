import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onViewChange, onToggle }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'projects', label: 'Projects', icon: '📊' },
    { id: 'payments', label: 'Payment History', icon: '💰' }
  ];

  return (
    <>
      {/* Single Toggle Button - Always on top left */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        <span className="text-xl">{isOpen ? '←' : '☰'}</span>
      </button>

      {/* Overlay for mobile - only closes sidebar on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar hidden when closed */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 w-64 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 mt-16">
          <h1 className="text-xl font-bold text-gray-800">Freelance Dashboard</h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onViewChange(item.id);
                    // Only close sidebar on mobile after selection, keep open on desktop
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;