// src/components/FiltersPanel.jsx
import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';
import {
  SYMMETRY_COLORS,
  BALANCED_COLORS,
  MANTRA_COLORS,
  cn,
  generateSymmetryInfo
} from '../globals.js';


const symmetryGroups = generateSymmetryInfo(Yijing.yijing_symmetryGroups)

const FiltersPanel = ({
  filterSymmetry,
  onSymmetryToggle,
  filterMantra,
  onMantraToggle,
  filterBalance,
  onBalanceToggle,
  placedHexagrams = [],
  onSelectHex,
  setEditStage,
  editMode = false,
}) => {

  // Compute counts for balance and mantra
  const mantraCounts = {
    [Yijing.YIJING_COSMIC]: 0,
    [Yijing.YIJING_KARMIC]: 0,
    [Yijing.YIJING_ATOMIC]: 0,
  };
  const balanceCounts = {
    [Yijing.YIJING_BALANCED]: 0,
    [Yijing.YIJING_UNBALANCED]: 0,
  };
  for (let i = 0; i < 64; i++) {
    mantraCounts[Yijing.yijing_mantraName(i)]++;
    balanceCounts[Yijing.yijing_balancedName(i)]++;
  }

  const balanceInfo = [
    { key: Yijing.YIJING_BALANCED, label: 'Balanced', count: balanceCounts[Yijing.YIJING_BALANCED] },
    { key: Yijing.YIJING_UNBALANCED, label: 'Unbalanced', count: balanceCounts[Yijing.YIJING_UNBALANCED] },
  ];

  const mantraInfo = [
    { key: Yijing.YIJING_COSMIC, label: 'Cosmic', count: mantraCounts[Yijing.YIJING_COSMIC] },
    { key: Yijing.YIJING_KARMIC, label: 'Karmic', count: mantraCounts[Yijing.YIJING_KARMIC] },
    { key: Yijing.YIJING_ATOMIC, label: 'Atomic', count: mantraCounts[Yijing.YIJING_ATOMIC] },
  ];

  const hasActiveFilters = filterBalance.length > 0 || filterMantra.length > 0 || filterSymmetry.length > 0;

  const clearAllFilters = () => {
    filterBalance.forEach(onBalanceToggle);
    filterMantra.forEach(onMantraToggle);
    filterSymmetry.forEach(onSymmetryToggle);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Tao Balance Filter */}
        <details open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Tao Balance
          </summary>
          <div className="flex flex-wrap gap-2">
            {balanceInfo.map(({ key, label, count }) => {
              const isActive = filterBalance.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onBalanceToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: BALANCED_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
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
        </details>

        {/* Mantra Levels Filter */}
        <details open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Mantra Levels
          </summary>
          <div className="flex flex-wrap gap-2">
            {mantraInfo.map(({ key, label, count }) => {
              const isActive = filterMantra.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onMantraToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: MANTRA_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
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
        </details>

        {/* Symmetry Groups Filter */}
        <details open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Symmetry Groups
          </summary>
          <div className="flex flex-wrap gap-2">
            {symmetryGroups.map(({ key, label, count }) => {
              const isActive = filterSymmetry.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onSymmetryToggle(key)}
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
        </details>

        {/* Single Clear All Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline transition-colors"
          >
            Clear all filters
          </button>
        )}

        {/* Hexagram Pool - Only in Edit Mode */}
        {editMode && (
          <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Available Hexagrams
              </h3>
            </div>
            {(() => {
              const available = Array.from({ length: 64 }, (_, i) => i).filter(
                (i) =>
                  !placedHexagrams.includes(i) &&
                  (filterSymmetry.length === 0 ||
                    filterSymmetry.includes(Yijing.yijing_symmetryName(i))) &&
                  (filterMantra.length === 0 ||
                    filterMantra.includes(Yijing.yijing_mantraName(i))) &&
                  (filterBalance.length === 0 ||
                    filterBalance.includes(Yijing.yijing_balancedName(i)))
              );

              const handleDragStart = (e, hexIndex) => {
                e.dataTransfer.setData('text/plain', `pool:${hexIndex}`);
              };

              return available.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hexagrams match current filters
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {available.map((hexIndex) => (
                    <div
                      key={hexIndex}
                      draggable
                      onDragStart={(e) => handleDragStart(e, hexIndex)}
                      onClick={() => onSelectHex(hexIndex)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <HexagramCard
                        hexIndex={hexIndex}
                        selected={false}
                        onClick={() => { }}
                        isNeighbor={false}
                        symmetryGroup={Yijing.yijing_symmetryName(hexIndex)}
                        filterSymmetry={filterSymmetry}
                        inEditMode
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </section>
        )}

        {/* Info Message when not in edit mode */}
        {!editMode && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            <p>Hexagram pool is available in Edit Mode</p>
          </div>
        )}
      </div>

      {/* Optional Footer */}
      {editMode && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Drag from pool to grid • Double-click to remove
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;