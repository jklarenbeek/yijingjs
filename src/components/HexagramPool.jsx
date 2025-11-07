// src/components/HexagramPool.jsx
import React from 'react';
import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';
import { SYMMETRY_COLORS } from '../globals.js';

const HexagramPool = ({
  placedHexagrams,
  filterSymmetry,
  onSelectHex,
  setEditStage,
}) => {
  const available = Array.from({ length: 64 }, (_, i) => i).filter(
    (i) =>
      !placedHexagrams.includes(i) &&
      (filterSymmetry.length === 0 ||
        filterSymmetry.includes(Yijing.yijing_symmetryName(i)))
  );

  const handleDragStart = (e, hexIndex) => {
    e.dataTransfer.setData('text/plain', `pool:${hexIndex}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Available Hexagrams
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {available.length} available
        </span>
      </div>
      {available.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No hexagrams match current filters
        </p>
      ) : (
        <div className="grid grid-cols-8 gap-2 max-h-96 overflow-y-auto">
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
      )}
    </div>
  );
};

export default HexagramPool;