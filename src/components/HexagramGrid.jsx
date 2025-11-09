// src/components/HexagramGrid.jsx

import * as Yijing from '@yijingjs/core';

import HexagramCard from './HexagramCard';
import { getHexagramSequences } from '../utils/tools.js';

const HexagramGrid = ({
  selectedHex,
  onSelectHex,
  neighbors,
  filters,
  currentSequence,
  customSequences = [],
}) => {

  const customMap = customSequences.reduce((acc, seq) => {
    acc[`custom-${seq.id}`] = seq;
    return acc;
  }, {});

  const baseSequences = { ...getHexagramSequences(), ...customMap };

  let sequence = baseSequences[currentSequence];

  // Ensure we always have exactly 64 values, filling with null for empty slots
  const values = Array.from({ length: 64 }, (_, index) => {
    if (sequence?.values && index < sequence.values.length) {
      const value = sequence.values[index];
      return value !== null && value !== undefined ? value : null;
    }
    return null;
  });

  const placedCount = values.filter(v => v !== null).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      {placedCount < 64 && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm">
            <span>⚠️</span>
            <span>Incomplete sequence ({placedCount}/64 hexagrams)</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {values.map((hexIndex, gridIndex) => {
          if (hexIndex === null) {
            return (
              <div
                key={gridIndex}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center"
              >
                <span className="text-gray-400 dark:text-gray-600 text-xs text-center p-2">
                  Empty
                </span>
              </div>
            );
          }

          const isNeighbor = neighbors.includes(hexIndex);

          let opacity = 'opacity-100';
          if (selectedHex !== null && !isNeighbor && hexIndex !== selectedHex) {
            opacity = 'opacity-40';
          }
          if (filters.isFiltered(hexIndex)) {
            opacity = 'opacity-20';
          }
          return (
            <div
              key={gridIndex}
              className={`transition-opacity duration-200 ${opacity}`}
            >
              <HexagramCard
                hexIndex={hexIndex}
                selected={selectedHex === hexIndex}
                onClick={onSelectHex}
                isNeighbor={isNeighbor}
                filters={filters}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HexagramGrid;
