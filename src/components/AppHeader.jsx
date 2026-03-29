// src/components/AppHeader.jsx

import { Sun, Moon } from 'lucide-react';
import { cn } from '../utils/tools.js';

/**
 * App header component
 */
const AppHeader = ({
  darkMode,
  toggleDarkMode,
  showSixiangs = false,
  setShowSixiangs,
  showKingWenNumbers = true,
  setShowKingWenNumbers
}) => {
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yijing Explorer</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSixiangs(!showSixiangs)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showSixiangs
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
            )}
            title={showSixiangs ? 'Switch all views to trigrams' : 'Switch all views to sixiangs'}
            aria-label={showSixiangs ? 'Show trigrams' : 'Show sixiangs'}
          >
            {showSixiangs ? '⚌' : '☰'}
          </button>

          <button
            onClick={() => setShowKingWenNumbers(!showKingWenNumbers)}
            className={cn(
              "p-2 rounded-lg transition-colors group relative",
              showKingWenNumbers
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
            )}
            title={showKingWenNumbers ? 'Switch all views to Binary Sequence' : 'Switch all views to King Wen Sequence'}
            aria-label={showKingWenNumbers ? 'Switch to Binary Sequence' : 'Switch to King Wen Sequence'}
          >
            {showKingWenNumbers ? '♔' : '#'}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
