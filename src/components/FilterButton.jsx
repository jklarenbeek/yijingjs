// src/components/FilterButton.jsx

import { cn } from '../utils/tools.js';

/**
 * Standardized filter toggle button
 */
const FilterButton = ({
  isActive,
  onClick,
  label,
  count,
  color,
  ariaLabel,
  className
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "filter-button px-3 py-2 rounded-lg text-sm font-medium transition-all",
        "flex items-center gap-2 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive
          ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
          : "opacity-70 hover:opacity-100",
        className
      )}
      style={{
        backgroundColor: color,
        color: 'white'
      }}
      aria-pressed={isActive}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          "w-3 h-3 rounded-full transition-colors",
          isActive ? "bg-white" : "bg-white/30"
        )}
      />
      <span>{label}</span>
      <span className="text-xs opacity-80">({count})</span>
    </button>
  );
};

export default FilterButton;
