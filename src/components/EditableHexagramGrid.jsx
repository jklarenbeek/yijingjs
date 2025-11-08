// src/components/EditableHexagramGrid.jsx
import React from 'react';
import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';
import { cn } from '../utils/tools.js';

const EditableHexagramGrid = ({
  editStage,
  setEditStage,
  selectedHex,
  onSelectHex,
  filterSymmetry,
  filterMantra = [],
  filterBalance = [],
  neighbors = [],
}) => {
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    let sourceIndex = null;
    if (data.startsWith('pool:')) {
      sourceIndex = parseInt(data.slice(5), 10);
    } else if (data.startsWith('grid:')) {
      sourceIndex = parseInt(data.slice(5), 10);
    }

    if (sourceIndex === null || editStage[targetIndex] !== null) return;

    const newStage = [...editStage];
    if (data.startsWith('grid:')) {
      newStage[sourceIndex] = null;
    }
    newStage[targetIndex] = sourceIndex;
    setEditStage(newStage);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, index) => {
    if (editStage[index] === null) return;
    e.dataTransfer.setData('text/plain', `grid:${index}`);
  };

  const handleDoubleClick = (index) => {
    if (editStage[index] !== null) {
      const newStage = [...editStage];
      newStage[index] = null;
      setEditStage(newStage);
    }
  };

  const handleReset = () => {
    setEditStage(Array(64).fill(null));
  };

  const handleClear = () => {
    setEditStage(Array(64).fill(null));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Custom Sequence Editor
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div
        className="grid grid-cols-8 gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded"
        onDragOver={handleDragOver}
      >
        {editStage.map((hexIndex, i) => {
          const isEmpty = hexIndex === null;
          if (isEmpty) {
            return (
              <div
                key={i}
                onDrop={(e) => handleDrop(e, i)}
                onDragOver={handleDragOver}
                className={cn(
                  "aspect-square rounded-lg border-2 border-dashed transition-all",
                  isEmpty
                    ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
                    : "border-transparent"
                )}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs">
                  Drop here
                </div>
              </div>
            );
          } else {
            let opacity = 'opacity-100';
            if (selectedHex !== null) {
              const isNeighbor = neighbors.includes(hexIndex);
              if (!isNeighbor && selectedHex !== hexIndex) {
                opacity = 'opacity-40';
              }
            }
            const symmetryGroup = Yijing.yijing_symmetryName(hexIndex);
            const isFilteredBySymmetry = filterSymmetry.length > 0 && !filterSymmetry.includes(symmetryGroup);
            const isFilteredByMantra = filterMantra.length > 0 && !filterMantra.includes(Yijing.yijing_mantraName(hexIndex));
            const isFilteredByBalance = filterBalance.length > 0 && !filterBalance.includes(Yijing.yijing_taoName(hexIndex));
            if (isFilteredBySymmetry || isFilteredByMantra || isFilteredByBalance) {
              opacity = 'opacity-20';
            }
            return (
              <div
                key={i}
                className={`transition-opacity duration-200 ${opacity}`}
              >
                <div
                  onDrop={(e) => handleDrop(e, i)}
                  onDragOver={handleDragOver}
                  className={cn(
                    "aspect-square rounded-lg border-2 border-dashed transition-all",
                    isEmpty
                      ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
                      : "border-transparent"
                  )}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDoubleClick={() => handleDoubleClick(i)}
                    onClick={() => onSelectHex(hexIndex)}
                    className="cursor-move"
                  >
                    <HexagramCard
                      hexIndex={hexIndex}
                      selected={selectedHex === hexIndex}
                      onClick={() => { }}
                      isNeighbor={false}
                      symmetryGroup={Yijing.yijing_symmetryName(hexIndex)}
                      filterSymmetry={filterSymmetry}
                      inEditMode
                    />
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default EditableHexagramGrid;