// src/components/AppTabs.jsx

import { cn } from '../utils/tools.js';
import { TAB_NAMES } from '../utils/constants';

/**
 * App tabs component
 */
const AppTabs = ({ activeTab, setActiveTab, editMode }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setActiveTab(TAB_NAMES.INSPECTOR)}
        className={cn(
          "flex-1 px-4 py-3 text-sm font-medium transition-colors",
          activeTab === TAB_NAMES.INSPECTOR
            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        )}
        aria-label="Inspector panel"
      >
        Inspector
      </button>
      <button
        onClick={() => setActiveTab(TAB_NAMES.FILTERS)}
        className={cn(
          "flex-1 px-4 py-3 text-sm font-medium transition-colors",
          activeTab === TAB_NAMES.FILTERS
            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        )}
        aria-label="Filters panel"
      >
        Filters
      </button>
      {editMode && (
        <button
          onClick={() => setActiveTab(TAB_NAMES.MANAGER)}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === TAB_NAMES.MANAGER
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          )}
          aria-label="Sequence manager"
        >
          Manager
        </button>
      )}
    </div>
  );
};

export default AppTabs;
