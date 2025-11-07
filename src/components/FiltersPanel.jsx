// src/components/FiltersPanel.jsx
import React from 'react';
import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';
import { cn, SYMMETRY_COLORS, BALANCED_COLORS, MANTRA_COLORS } from '../globals.js';

import {
  YIJING_BREATH,
  YIJING_MOTHER,
  YIJING_DIRECTION,
  YIJING_BEGINNING,
  YIJING_PRINCIPLE,
  YIJING_TITAN,
  YIJING_GIGANTE
} from '@yijingjs/core';

function generateSymmetryInfo(groups) {
  return [
    { key: YIJING_BREATH, label: 'Breath', count: groups.breath.length },
    { key: YIJING_MOTHER, label: 'Mother', count: groups.mothers.length },
    { key: YIJING_DIRECTION, label: 'Direction', count: groups.directions.length },
    { key: YIJING_BEGINNING, label: 'Beginning', count: groups.beginning.length },
    { key: YIJING_PRINCIPLE, label: 'Principle', count: groups.principles.length },
    { key: YIJING_TITAN, label: 'Titan', count: groups.titans.length },
    { key: YIJING_GIGANTE, label: 'Gigante', count: groups.gigantes.length }
  ];
}

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Tao Balance Filter */}
        <section>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Tao Balance
          </h3>
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

          {filterBalance.length > 0 && (
            <button
              onClick={() => filterBalance.forEach(onBalanceToggle)}
              className="mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </section>

        {/* Mantra Levels Filter */}
        <section>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Mantra Levels
          </h3>
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

          {filterMantra.length > 0 && (
            <button
              onClick={() => filterMantra.forEach(onMantraToggle)}
              className="mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </section>

        {/* Symmetry Groups Filter */}
        <section>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Symmetry Groups
          </h3>
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

          {filterSymmetry.length > 0 && (
            <button
              onClick={() => filterSymmetry.forEach(onSymmetryToggle)}
              className="mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </section>

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