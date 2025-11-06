// src/components/SymmetryGroupsPanel.jsx

import {
  YIJING_BREATH,
  YIJING_MOTHER,
  YIJING_DIRECTION,
  YIJING_BEGINNING,
  YIJING_PRINCIPLE,
  YIJING_TITAN,
  YIJING_GIGANTE
} from '@yijingjs/core';

import { SYMMETRY_COLORS, cn } from '../globals.js';

const SymmetryGroupsPanel = ({ groups, filterSymmetry, onFilterToggle }) => {
  const groupInfo = [
    { key: YIJING_BREATH, label: 'Breath', count: groups.breath.length },
    { key: YIJING_MOTHER, label: 'Mother', count: groups.mothers.length },
    { key: YIJING_DIRECTION, label: 'Direction', count: groups.directions.length },
    { key: YIJING_BEGINNING, label: 'Beginning', count: groups.beginning.length },
    { key: YIJING_PRINCIPLE, label: 'Principle', count: groups.principles.length },
    { key: YIJING_TITAN, label: 'Titan', count: groups.titans.length },
    { key: YIJING_GIGANTE, label: 'Gigante', count: groups.gigantes.length }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Symmetry Groups
      </h3>
      <div className="flex flex-wrap gap-2">
        {groupInfo.map(({ key, label, count }) => {
          const isActive = filterSymmetry.includes(key);
          return (
            <button
              key={key}
              onClick={() => onFilterToggle(key)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                "flex items-center gap-2",
                "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isActive
                  ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                  : "opacity-70 hover:opacity-100"
              )}
              style={{
                backgroundColor: SYMMETRY_COLORS[key],
                color: 'white'
              }}
              aria-pressed={isActive}
              aria-label={`${isActive ? 'Hide' : 'Show'} ${label} symmetry group`}
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
        })}
      </div>

      {filterSymmetry.length > 0 && (
        <button
          onClick={() => filterSymmetry.forEach(onFilterToggle)}
          className="mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default SymmetryGroupsPanel;