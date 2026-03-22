// src/components/EditableHexagramGrid.jsx

import { useCallback, useEffect, useMemo } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import HexagramCard from './HexagramCard';
import { cn } from '../utils/tools.js';
import useEditHistory from '../hooks/useEditHistory.js';

const EmptyGridCell = ({ gridIndex }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `grid-${gridIndex}`,
    data: { type: 'grid', gridIndex }
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "aspect-square rounded-lg border-2 border-dashed transition-all duration-200 relative group",
        isOver
          ? "bg-green-100/50 border-green-500 scale-[1.01]"
          : "border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-800"
      )}
      aria-label={`Empty cell at ${Math.floor(gridIndex / 8)}, ${gridIndex % 8}`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-xs p-2">
        <span className="text-lg mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">🎯</span>
        <span className="text-center">Drop</span>
        {/* Grid coordinates indicator */}
        <div className="absolute top-1 left-1 text-[8px] text-gray-400 dark:text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 dark:bg-gray-800/80 px-1 rounded">
          {Math.floor(gridIndex / 8)},{gridIndex % 8}
        </div>
      </div>
    </div>
  );
};

const OccupiedGridCell = ({ 
  gridIndex, hexIndex, selectedHex, neighbors, filters, 
  onSelectHex, onDoubleClick, showSixiangs, showKingWenNumbers 
}) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `grid-${gridIndex}`,
    data: { type: 'grid', gridIndex }
  });

  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
    id: `grid-item-${gridIndex}`,
    data: { type: 'grid', gridIndex, hexIndex }
  });

  const setNodeRef = (node) => {
    setDroppableRef(node);
    setDraggableRef(node);
  };

  let opacity = 'opacity-100';
  if (selectedHex !== null) {
    const isNeighbor = neighbors.includes(hexIndex);
    if (!isNeighbor && selectedHex !== hexIndex) {
      opacity = 'opacity-40';
    }
  }
  if (filters.isFiltered(hexIndex)) opacity = 'opacity-20';
  if (isDragging) opacity = 'opacity-30';

  return (
    <div
      className={cn(
        "transition-all duration-200", opacity,
        isOver ? "z-10" : "z-0"
      )}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={() => {
          // Prevent drag click from swallowing selection
          if (!isDragging) onSelectHex(hexIndex);
        }}
        className={cn(
          "aspect-square rounded-lg transition-all relative group bg-white dark:bg-gray-800 cursor-grab active:cursor-grabbing w-full h-full",
          isOver && "ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-800 scale-105",
          isDragging && "opacity-50"
        )}
        style={{ touchAction: 'none' }}
        aria-label={`Hexagram ${hexIndex}. Drag to move or swap.`}
      >
        <HexagramCard
          hexIndex={hexIndex}
          selectedHex={selectedHex}
          onClick={() => {}}
          isNeighbor={false}
          filters={filters}
          inEditMode
          showSixiangs={showSixiangs}
          showKingWenNumbers={showKingWenNumbers}
        />

        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 rounded-lg flex items-center justify-center">
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDoubleClick(gridIndex);
            }}
            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all duration-200 hover:bg-red-600 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
            title="Remove hexagram"
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
};

const EditableHexagramGrid = ({
  editStage,
  setEditStage,
  selectedHex,
  onSelectHex,
  filters,
  neighbors = [],
  hasUnsavedChanges = false,
  showSixiangs = false,
  showKingWenNumbers = false,
}) => {
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

  // Handle Dnd-kit drop events triggered from App.jsx
  useEffect(() => {
    const handleDndDrop = (e) => {
      const event = e.detail;
      const { active, over } = event;
      if (!over) return;

      const sourceData = active.data.current;
      const targetData = over.data.current;
      if (!sourceData || !targetData) return;

      const newStage = [...localStage];
      const targetIndex = targetData.gridIndex;
      const dragType = sourceData.type;
      
      if (dragType === 'pool') {
        const sourceHex = sourceData.hexIndex;
        if (localStage.includes(sourceHex)) return; // Already in grid

        if (localStage[targetIndex] !== null) {
          // Swap logic: bump existing item to an empty slot
          const temp = newStage[targetIndex];
          newStage[targetIndex] = sourceHex;
          const emptyIndex = newStage.findIndex(val => val === null);
          if (emptyIndex !== -1) newStage[emptyIndex] = temp;
        } else {
          newStage[targetIndex] = sourceHex;
        }
      } else if (dragType === 'grid') {
        const sourceIndex = sourceData.gridIndex;
        const sourceHex = localStage[sourceIndex];
        
        if (localStage[targetIndex] !== null) {
          // Swap
          const temp = localStage[targetIndex];
          newStage[targetIndex] = sourceHex;
          newStage[sourceIndex] = temp;
        } else {
          // Move
          newStage[sourceIndex] = null;
          newStage[targetIndex] = sourceHex;
        }
      }

      pushState(newStage);
    };

    document.addEventListener('yijingDndDragEnd', handleDndDrop);
    return () => document.removeEventListener('yijingDndDragEnd', handleDndDrop);
  }, [localStage, pushState]);

  const placementCount = useMemo(() => localStage.filter(h => h !== null).length, [localStage]);
  const isEmpty = placementCount === 0;

  const handleDoubleClick = useCallback((index) => {
    if (localStage[index] !== null) {
      const newStage = [...localStage];
      newStage[index] = null;
      pushState(newStage);
    }
  }, [localStage, pushState]);

  const handleClear = useCallback(() => {
    pushState(Array(64).fill(null));
    clearHistory();
  }, [pushState, clearHistory]);

  const handleFillRandom = useCallback(() => {
    const availableHexagrams = Array.from({ length: 64 }, (_, i) => i).filter(i => !localStage.includes(i));
    if (availableHexagrams.length === 0) return;

    const shuffled = [...availableHexagrams].sort(() => Math.random() - 0.5);
    const newStage = [...localStage];
    let idx = 0;
    for (let i = 0; i < newStage.length; i++) {
      if (newStage[i] === null && idx < shuffled.length) {
        newStage[i] = shuffled[idx++];
      }
    }
    pushState(newStage);
  }, [localStage, pushState]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Custom Sequence Editor
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {placementCount}/64 hexagrams placed • History: {currentIndex}/{historySize}
            {hasUnsavedChanges && " • Unsaved changes"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={cn("px-3 py-2 text-sm rounded", canUndo ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed")}
            >↶ Undo</button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={cn("px-3 py-2 text-sm rounded", canRedo ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed")}
            >↷ Redo</button>
          </div>
          <button
            onClick={handleFillRandom}
            disabled={placementCount >= 64}
            className={cn("px-4 py-2 text-sm rounded", placementCount < 64 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed")}
          >Fill Random</button>
          <button
            onClick={handleClear}
            disabled={isEmpty}
            className={cn("px-4 py-2 text-sm rounded", !isEmpty ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed")}
          >Clear All</button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1 sm:gap-2 p-1 sm:p-2 rounded transition-all duration-300 w-full max-w-[calc(100vh-250px)] aspect-square mx-auto bg-gray-50 dark:bg-gray-900/50">
        {localStage.map((hexIndex, i) =>
          hexIndex === null ? (
            <EmptyGridCell key={`empty-${i}`} gridIndex={i} />
          ) : (
            <OccupiedGridCell
              key={`occ-${hexIndex}`}
              gridIndex={i}
              hexIndex={hexIndex}
              selectedHex={selectedHex}
              neighbors={neighbors}
              filters={filters}
              onSelectHex={onSelectHex}
              onDoubleClick={handleDoubleClick}
              showSixiangs={showSixiangs}
              showKingWenNumbers={showKingWenNumbers}
            />
          )
        )}
      </div>

      {isEmpty && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
          💡 Drag hexagrams from the Filters tab to populate the grid.
        </div>
      )}
    </div>
  );
};

export default EditableHexagramGrid;
