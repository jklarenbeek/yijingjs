import { X } from 'lucide-react';
import { cn } from '../utils/tools.js';

const ToggleSwitch = ({ id, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
        {label}
      </label>
      {description && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
      )}
    </div>
    <label htmlFor={id} className="relative flex items-center cursor-pointer ml-4">
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const SettingsMenu = ({
  isOpen,
  onClose,
  darkMode,
  toggleDarkMode,
  showSixiangs,
  setShowSixiangs,
  showKingWenNumbers,
  setShowKingWenNumbers,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal/Drawer Overlay */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] bg-white dark:bg-gray-800 w-full md:w-96 rounded-t-2xl md:rounded-2xl shadow-xl transform transition-transform md:transition-all">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-full transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-2">
          <ToggleSwitch
            id="dark-mode"
            label="Dark Mode"
            description="Toggle dark visualization mode"
            checked={darkMode}
            onChange={toggleDarkMode} // toggleDarkMode is a toggle function without param from useTheme
          />
          <ToggleSwitch
            id="sixiangs-mode"
            label="Use Sixiangs"
            description="Display lines as four symbols (sixiangs) instead of trigrams"
            checked={showSixiangs}
            onChange={setShowSixiangs}
          />
          <ToggleSwitch
            id="kingwen-mode"
            label="King Wen Sequence"
            description="Use King Wen numbers (#) instead of Binary sequence (♔)"
            checked={showKingWenNumbers}
            onChange={setShowKingWenNumbers}
          />
        </div>
      </div>
    </>
  );
};

export default SettingsMenu;
