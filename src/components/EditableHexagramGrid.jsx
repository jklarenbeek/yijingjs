// src/components/EditableHexagramGrid.jsx

import { useState, useCallback, useEffect } from 'react';
import HexagramCard from './HexagramCard';
import { cn } from '../utils/tools.js';

import useEditHistory from '../hooks/useEditHistory.js';

const EditableHexagramGrid = ({
  editStage,
  setEditStage,
  selectedHex,
  onSelectHex,
  filters,
  neighbors = [],
}) => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    sourceIndex: null,
    dragType: null,
  });
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showDropZone, setShowDropZone] = useState(false);

  // Initialize undo/redo system
  const {
    currentState: localStage,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    historySize,
    currentIndex,
    clearHistory
  } = useEditHistory(editStage, setEditStage);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleDrop = useCallback((e, targetIndex) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    let sourceIndex = null;
    let dragType = null;

    if (data.startsWith('pool:')) {
      sourceIndex = parseInt(data.slice(5), 10);
      dragType = 'pool';
    } else if (data.startsWith('grid:')) {
      sourceIndex = parseInt(data.slice(5), 10);
      dragType = 'grid';
    }

    if (sourceIndex === null) return;

    const newStage = [...localStage];

    if (dragType === 'pool') {
      // Prevent duplicates and validate target
      if (localStage.includes(sourceIndex)) {
        console.warn('Hexagram already placed in grid');
        return;
      }
      if (localStage[targetIndex] !== null) {
        console.warn('Target position already occupied');
        return;
      }

      newStage[targetIndex] = sourceIndex;
    } else if (dragType === 'grid') {
      const sourceHex = localStage[sourceIndex];

      if (localStage[targetIndex] !== null) {
        // Swap operation
        const temp = localStage[targetIndex];
        newStage[targetIndex] = sourceHex;
        newStage[sourceIndex] = temp;
      } else {
        // Move to empty
        newStage[sourceIndex] = null;
        newStage[targetIndex] = sourceHex;
      }
    }

    pushState(newStage);

    // Reset drag state
    setDragState({ isDragging: false, sourceIndex: null, dragType: null });
    setHoverIndex(null);
    setShowDropZone(false);
  }, [localStage, pushState]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setShowDropZone(true);
  }, []);

  const handleDragStart = useCallback((e, index, type = 'grid') => {
    if (type === 'grid' && localStage[index] === null) return;

    const dragType = type === 'grid' ? 'grid' : 'pool';
    const dataValue = `${dragType}:${index}`;

    e.dataTransfer.setData('text/plain', dataValue);
    e.dataTransfer.effectAllowed = 'move';

    setDragState({
      isDragging: true,
      sourceIndex: index,
      dragType: dragType,
    });
  }, [localStage]);

  const handleDragEnd = useCallback(() => {
    setDragState({ isDragging: false, sourceIndex: null, dragType: null });
    setHoverIndex(null);
    setShowDropZone(false);
  }, []);

  const handleDoubleClick = useCallback((index) => {
    if (localStage[index] !== null) {
      const newStage = [...localStage];
      newStage[index] = null;
      pushState(newStage);
    }
  }, [localStage, pushState]);

  const handleClear = useCallback(() => {
    const newStage = Array(64).fill(null);
    pushState(newStage);
    clearHistory();
  }, [pushState, clearHistory]);

  const handleFillRandom = useCallback(() => {
    const availableHexagrams = Array.from({ length: 64 }, (_, i) => i)
      .filter(i => !localStage.includes(i));

    const shuffled = [...availableHexagrams].sort(() => Math.random() - 0.5);
    const newStage = [...localStage];

    let availableIndex = 0;
    for (let i = 0; i < newStage.length; i++) {
      if (newStage[i] === null && availableIndex < shuffled.length) {
        newStage[i] = shuffled[availableIndex];
        availableIndex++;
      }
    }

    pushState(newStage);
  }, [localStage, pushState]);

  const getCellStyle = useCallback((index) => {
    if (hoverIndex === index) {
      return {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '2px dashed #3b82f6',
        transform: 'scale(1.02)'
      };
    }

    if (showDropZone && localStage[index] === null) {
      return {
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        border: '2px dashed #22c55e'
      };
    }

    return {};
  }, [hoverIndex, showDropZone, localStage]);

  const getPlacementCount = useCallback(() =>
    localStage.filter(h => h !== null).length,
    [localStage]
  );

  const isEmpty = getPlacementCount() === 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Custom Sequence Editor
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {getPlacementCount()}/64 hexagrams placed • History: {currentIndex}/{historySize}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Undo/Redo Controls */}
          <div className="flex gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={cn(
                "px-3 py-1 text-sm rounded transition-all flex items-center gap-1",
                canUndo
                  ? "bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              )}
              title="Undo (Ctrl+Z)"
            >
              <span>↶</span>
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={cn(
                "px-3 py-1 text-sm rounded transition-all flex items-center gap-1",
                canRedo
                  ? "bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              )}
              title="Redo (Ctrl+Shift+Z)"
            >
              <span>↷</span>
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleFillRandom}
            disabled={getPlacementCount() >= 64}
            className={cn(
              "px-3 py-1 text-sm rounded transition-all",
              getPlacementCount() < 64
                ? "bg-green-500 hover:bg-green-600 text-white shadow-sm"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            )}
          >
            Fill Random
          </button>

          <button
            onClick={handleClear}
            disabled={isEmpty}
            className={cn(
              "px-3 py-1 text-sm rounded transition-all",
              !isEmpty
                ? "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            )}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        className={cn(
          "grid grid-cols-8 gap-2 p-2 rounded transition-all duration-300",
          showDropZone
            ? "bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700"
            : "bg-gray-50 dark:bg-gray-900"
        )}
        onDragOver={handleDragOver}
        onDragLeave={() => setShowDropZone(false)}
      >
        {localStage.map((hexIndex, i) => {
          const isEmpty = hexIndex === null;
          const isHovered = hoverIndex === i;
          const isBeingDragged = dragState.isDragging && dragState.sourceIndex === i;

          if (isEmpty) {
            return (
              <div
                key={i}
                onDrop={(e) => handleDrop(e, i)}
                onDragOver={handleDragOver}
                onDragEnter={() => setHoverIndex(i)}
                onDragLeave={() => setHoverIndex(null)}
                style={getCellStyle(i)}
                className={cn(
                  "aspect-square rounded-lg border-2 border-dashed transition-all duration-200 relative group",
                  isEmpty
                    ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
                    : "border-transparent"
                )}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 text-xs">
                  <span className="text-lg mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    🎯
                  </span>
                  <span>Drop here</span>
                  <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    or double-click
                  </span>
                </div>

                {/* Grid coordinates indicator */}
                <div className="absolute top-1 left-1 text-[8px] text-gray-400 dark:text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.floor(i / 8)},{i % 8}
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
            if (filters.isFiltered(hexIndex)) {
              opacity = 'opacity-20';
            }
            if (isBeingDragged) {
              opacity = 'opacity-30';
            }

            return (
              <div
                key={i}
                className={`transition-all duration-200 ${opacity} ${isHovered ? 'z-10' : 'z-0'}`}
                style={getCellStyle(i)}
              >
                <div
                  onDrop={(e) => handleDrop(e, i)}
                  onDragOver={handleDragOver}
                  onDragEnter={() => setHoverIndex(i)}
                  onDragLeave={() => setHoverIndex(null)}
                  className={cn(
                    "aspect-square rounded-lg transition-all relative group",
                    isHovered && "ring-2 ring-blue-400 ring-offset-2"
                  )}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, i, 'grid')}
                    onDragEnd={handleDragEnd}
                    onDoubleClick={() => handleDoubleClick(i)}
                    onClick={() => onSelectHex(hexIndex)}
                    className={cn(
                      "cursor-grab active:cursor-grabbing transition-transform",
                      isHovered && "scale-105"
                    )}
                  >
                    <HexagramCard
                      hexIndex={hexIndex}
                      selected={selectedHex === hexIndex}
                      onClick={() => { }}
                      isNeighbor={false}
                      filters={filters}
                      inEditMode
                    />
                  </div>

                  {/* Quick action overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => handleDoubleClick(i)}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity hover:bg-red-600 transform hover:scale-110"
                      title="Remove hexagram"
                    >
                      ×
                    </button>
                  </div>

                  {/* Grid coordinates */}
                  <div className="absolute top-1 left-1 text-[8px] text-gray-600 dark:text-gray-400 font-mono bg-white/80 dark:bg-gray-800/80 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.floor(i / 8)},{i % 8}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{getPlacementCount()} placed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span>{64 - getPlacementCount()} empty</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Drag & drop</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Double-click to remove</span>
        </div>
      </div>

      {/* Quick Tips */}
      {isEmpty && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 dark:text-yellow-400 text-lg">💡</span>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">Get started!</p>
              <p>Switch to the Filters tab and drag hexagrams from the pool, or use the "Fill Random" button to quickly populate the grid.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableHexagramGrid;
