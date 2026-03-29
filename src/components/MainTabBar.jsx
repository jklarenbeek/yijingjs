// src/components/MainTabBar.jsx

/* eslint-disable no-unused-vars */
import { LayoutGrid, ListTree, Network, Home, Settings } from 'lucide-react';
import { cn } from '../utils/tools.js';
import { APP_VIEWS } from '../utils/constants.js';

/**
 * Main application navigation bar (bottom on mobile, top on desktop)
 */
const MainTabBar = ({ activeView, setActiveView, onOpenSettings }) => {
  const tabs = [
    { id: APP_VIEWS.HOME, label: 'Home', icon: Home },
    { id: APP_VIEWS.GRID, label: 'The Matrix', icon: LayoutGrid },
    { id: APP_VIEWS.SEQUENCES, label: 'Pairs', icon: ListTree },
    { id: APP_VIEWS.SEFIROT, label: 'Tree of Life', icon: Network },
  ];

  return (
    <div className="flex bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none md:border-b md:border-t-0 z-50 transition-colors">
      <div className="flex w-full max-w-screen-2xl mx-auto md:px-4">
        {tabs.map(({ id, label, icon: TabIcon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={cn(
              "flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 py-3 md:py-4 text-xs md:text-sm font-medium transition-colors relative",
              activeView === id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            )}
            aria-label={`Switch to ${label} view`}
          >
            <TabIcon className={cn("w-5 h-5 md:w-4 md:h-4", activeView === id && "text-blue-600 dark:text-blue-400")} />
            <span>{label}</span>
            {/* Active Indicator Line */}
            {activeView === id && (
              <div className="absolute bottom-0 left-0 w-full h-1 md:h-0.5 md:bottom-auto md:top-0 bg-blue-600 dark:bg-blue-400 rounded-t-full md:rounded-b-full md:rounded-t-none" />
            )}
          </button>
        ))}
        
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 py-3 md:py-4 text-xs md:text-sm font-medium transition-colors relative text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 md:w-4 md:h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MainTabBar;
