// src/components/EditableHexagramGrid.jsx

import { useState, useCallback, useEffect, useMemo } from 'react';
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
  const [dragPreview, setDragPreview] = useState(null);

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

  // Memoized placement count
  const placementCount = useMemo(() =>
    localStage.filter(h => h !== null).length,
    [localStage]
  );

  const isEmpty = placementCount === 0;

  const handleDrop = useCallback((e, targetIndex) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    let sourceIndex = null;
    let dragType = null;

    try {
      if (data.startsWith('pool:')) {
        sourceIndex = parseInt(data.slice(5), 10);
        dragType = 'pool';
      } else if (data.startsWith('grid:')) {
        sourceIndex = parseInt(data.slice(5), 10);
        dragType = 'grid';
      }

      if (sourceIndex === null || sourceIndex < 0 || sourceIndex > 63) {
        console.warn('Invalid drag source:', sourceIndex);
        return;
      }

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

        if (sourceHex === null) {
          console.warn('Cannot drag from empty cell');
          return;
        }

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
    }
    catch (error) {
      console.error('Error handling drop:', error);
    }

    // Reset drag state
    setDragState({ isDragging: false, sourceIndex: null, dragType: null });
    setHoverIndex(null);
    setShowDropZone(false);
    setDragPreview(null);
  }, [localStage, pushState]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setShowDropZone(true);
  }, []);

  const handleDragStart = useCallback((e, index, type = 'grid') => {
    if (type === 'grid' && localStage[index] === null) {
      e.preventDefault();
      return;
    }

    const dragType = type === 'grid' ? 'grid' : 'pool';
    const dataValue = `${dragType}:${index}`;

    e.dataTransfer.setData('text/plain', dataValue);
    e.dataTransfer.effectAllowed = 'move';

    // Set drag preview for better UX
    if (type === 'grid' && localStage[index] !== null) {
      setDragPreview(localStage[index]);
    }

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
    setDragPreview(null);
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

    if (availableHexagrams.length === 0) return;

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

  const getCellStyle = useCallback((index, isEmptyCell) => {
    const baseStyle = {
      transition: 'all 0.2s ease-in-out'
    };

    if (hoverIndex === index && !isEmptyCell) {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '2px dashed #3b82f6',
        transform: 'scale(1.02)'
      };
    }

    if (showDropZone && isEmptyCell) {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        border: '2px dashed #22c55e',
        transform: 'scale(1.01)'
      };
    }

    return baseStyle;
  }, [hoverIndex, showDropZone]);

  // Memoized cell rendering for better performance
  const renderEmptyCell = useCallback((index) => (
    <div
      key={index}
      onDrop={(e) => handleDrop(e, index)}
      onDragOver={handleDragOver}
      onDragEnter={() => setHoverIndex(index)}
      onDragLeave={() => {
        if (hoverIndex === index) setHoverIndex(null);
      }}
      style={getCellStyle(index, true)}
      className={cn(
        "aspect-square rounded-lg border-2 border-dashed transition-all duration-200 relative group",
        "border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50",
        "hover:border-gray-400 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-800"
      )}
      aria-label={`Empty cell at position ${Math.floor(index / 8)}, ${index % 8}`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-xs p-2">
        <span className="text-lg mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          🎯
        </span>
        <span className="text-center">Drop here</span>

        {/* Grid coordinates indicator */}
        <div className="absolute top-1 left-1 text-[8px] text-gray-400 dark:text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 dark:bg-gray-800/80 px-1 rounded">
          {Math.floor(index / 8)},{index % 8}
        </div>
      </div>
    </div>
  ), [handleDrop, handleDragOver, hoverIndex, getCellStyle]);

  const renderOccupiedCell = useCallback((hexIndex, gridIndex) => {
    const isBeingDragged = dragState.isDragging && dragState.sourceIndex === gridIndex;
    const isHovered = hoverIndex === gridIndex;

    // Calculate opacity based on selection and filters
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
        key={gridIndex}
        className={`transition-all duration-200 ${opacity} ${isHovered ? 'z-10' : 'z-0'}`}
        style={getCellStyle(gridIndex, false)}
      >
        <div
          onDrop={(e) => handleDrop(e, gridIndex)}
          onDragOver={handleDragOver}
          onDragEnter={() => setHoverIndex(gridIndex)}
          onDragLeave={() => {
            if (hoverIndex === gridIndex) setHoverIndex(null);
          }}
          className={cn(
            "aspect-square rounded-lg transition-all relative group bg-white dark:bg-gray-800",
            isHovered && "ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-800"
          )}
        >
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, gridIndex, 'grid')}
            onDragEnd={handleDragEnd}
            onDoubleClick={() => handleDoubleClick(gridIndex)}
            onClick={() => onSelectHex(hexIndex)}
            className={cn(
              "cursor-grab active:cursor-grabbing transition-transform w-full h-full",
              isHovered && "scale-105"
            )}
            aria-label={`Hexagram ${hexIndex} at position ${Math.floor(gridIndex / 8)}, ${gridIndex % 8}. Double-click to remove.`}
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 rounded-lg flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDoubleClick(gridIndex);
              }}
              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all duration-200 hover:bg-red-600 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
              title="Remove hexagram"
              aria-label={`Remove hexagram ${hexIndex}`}
            >
              ×
            </button>
          </div>

          {/* Grid coordinates */}
          <div className="absolute top-1 left-1 text-[8px] text-gray-600 dark:text-gray-400 font-mono bg-white/80 dark:bg-gray-800/80 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {Math.floor(gridIndex / 8)},{gridIndex % 8}
          </div>
        </div>
      </div>
    );
  }, [
    dragState, hoverIndex, selectedHex, neighbors, filters,
    getCellStyle, handleDrop, handleDragOver, handleDragStart,
    handleDragEnd, handleDoubleClick, onSelectHex
  ]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Custom Sequence Editor
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {placementCount}/64 hexagrams placed • History: {currentIndex}/{historySize}
            {dragState.isDragging && " • Dragging..."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Undo/Redo Controls */}
          <div className="flex gap-1" role="group" aria-label="Edit history controls">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={cn(
                "px-3 py-2 text-sm rounded transition-all flex items-center gap-1 min-w-[80px] justify-center",
                canUndo
                  ? "bg-gray-500 hover:bg-gray-600 text-white shadow-sm focus:ring-2 focus:ring-gray-300"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              )}
              title="Undo (Ctrl+Z)"
              aria-label="Undo last action"
            >
              <span>↶</span>
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={cn(
                "px-3 py-2 text-sm rounded transition-all flex items-center gap-1 min-w-[80px] justify-center",
                canRedo
                  ? "bg-gray-500 hover:bg-gray-600 text-white shadow-sm focus:ring-2 focus:ring-gray-300"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              )}
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo last action"
            >
              <span>↷</span>
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleFillRandom}
            disabled={placementCount >= 64}
            className={cn(
              "px-4 py-2 text-sm rounded transition-all min-w-[100px]",
              placementCount < 64
                ? "bg-green-500 hover:bg-green-600 text-white shadow-sm focus:ring-2 focus:ring-green-300"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            )}
            aria-label="Fill empty cells with random hexagrams"
          >
            Fill Random
          </button>

          <button
            onClick={handleClear}
            disabled={isEmpty}
            className={cn(
              "px-4 py-2 text-sm rounded transition-all min-w-[100px]",
              !isEmpty
                ? "bg-red-500 hover:bg-red-600 text-white shadow-sm focus:ring-2 focus:ring-red-300"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            )}
            aria-label="Clear all hexagrams from grid"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        className={cn(
          "grid grid-cols-8 gap-2 p-2 rounded transition-all duration-300 min-h-[500px]",
          showDropZone
            ? "bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700"
            : "bg-gray-50 dark:bg-gray-900/50 border border-transparent"
        )}
        onDragOver={handleDragOver}
        onDragLeave={() => setShowDropZone(false)}
        aria-label="Editable hexagram grid"
      >
        {localStage.map((hexIndex, i) =>
          hexIndex === null
            ? renderEmptyCell(i)
            : renderOccupiedCell(hexIndex, i)
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{placementCount} placed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span>{64 - placementCount} empty</span>
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
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 text-lg">💡</span>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Get started with your custom sequence!</p>
              <p className="mt-1">
                Switch to the <strong>Filters tab</strong> to browse available hexagrams, then drag and drop them into the grid above.
                You can also use the <strong>"Fill Random"</strong> button to quickly populate the grid.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Drag Preview (for better UX) */}
      {dragState.isDragging && dragPreview !== null && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-70 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute" style={{ left: '50%', top: '50%' }}>
            <HexagramCard
              hexIndex={dragPreview}
              selected={false}
              onClick={() => { }}
              isNeighbor={false}
              filters={filters}
              inEditMode
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableHexagramGrid;
