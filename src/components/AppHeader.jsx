// src/components/AppHeader.jsx

import { Sun, Moon, Edit3, X } from 'lucide-react';
import SequenceDropdown from './SequenceDropdown.jsx';
import { cn } from '../utils/tools.js';

/**
 * App header component
 */
const AppHeader = ({
  darkMode,
  toggleDarkMode,
  editMode,
  setEditMode,
  currentSequence,
  setCurrentSequence,
  customSequences
}) => {
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yijing Explorer</h1>
          <SequenceDropdown
            currentSequence={currentSequence}
            onSequenceChange={setCurrentSequence}
            customSequences={customSequences}
            disabled={editMode}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
              editMode
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            )}
            aria-label={editMode ? 'Exit edit mode' : 'Enter edit mode'}
          >
            {editMode ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {editMode ? 'Exit Edit' : 'Edit Mode'}
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
