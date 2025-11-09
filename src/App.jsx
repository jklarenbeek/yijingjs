// src/App.jsx

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as Yijing from '@yijingjs/core';

import useFilters from './hooks/useFilters.js';
import useSequences from './hooks/useSequences.js';
import useTheme from './hooks/useTheme.js';

import { LOCAL_STORAGE_KEYS, TAB_NAMES } from './utils/constants';

import HexagramGrid from './components/HexagramGrid';
import EditableHexagramGrid from './components/EditableHexagramGrid';
import InspectorPanel from './components/InspectorPanel';
import FiltersPanel from './components/FiltersPanel.jsx';
import SequenceManager from './components/SequenceManager';
import AppHeader from './components/AppHeader';
import AppTabs from './components/AppTabs';

function App() {
  const [selectedHex, setSelectedHex] = useState(null);
  const [showSixiangs, setShowSixiangs] = useState(false);
  const [showKingWenNumbers, setShowKingWenNumbers] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_NAMES.INSPECTOR);
  const [editStage, setEditStage] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EDIT_STAGE);
      return saved ? JSON.parse(saved) : Array(64).fill(null);
    } catch (error) {
      console.error('Error loading edit stage:', error);
      return Array(64).fill(null);
    }
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialEditStageRef = useRef([]);

  // Custom hooks
  const filters = useFilters();
  const sequences = useSequences();
  const { darkMode, toggleDarkMode } = useTheme();

  // Memoized neighbors calculation
  const neighbors = useMemo(() => {
    if (selectedHex === null) return [];
    return Yijing.yijing_neighbors(selectedHex);
  }, [selectedHex]);

  // Event handlers
  const handleSelectHex = useCallback((hexIndex) => {
    setSelectedHex(prev => prev === hexIndex ? null : hexIndex);
  }, []);

  // Handle edit stage changes with dirty tracking
  const handleEditStageChange = useCallback((newEditStage) => {
    setEditStage(newEditStage);
    // Check if there are unsaved changes compared to initial state
    const hasChanges = JSON.stringify(newEditStage) !== JSON.stringify(initialEditStageRef.current);
    setHasUnsavedChanges(hasChanges);
  }, []);

  // Handle edit mode toggle with proper sequence synchronization and dirty state management
  const handleToggleEditMode = useCallback(() => {
    const newEditMode = !editMode;

    if (newEditMode) {
      // Entering edit mode - save current state for dirty checking
      const currentSeqData = sequences.getCurrentSequenceData();
      if (currentSeqData && currentSeqData.values) {
        initialEditStageRef.current = [...currentSeqData.values];
      } else {
        initialEditStageRef.current = [...editStage];
      }
      setHasUnsavedChanges(false);

      // Ensure we're using a custom sequence context
      if (!sequences.currentSequence.startsWith('custom-')) {
        // If current sequence is not custom, initialize edit stage with current sequence data
        if (currentSeqData && currentSeqData.values) {
          setEditStage(currentSeqData.values);
        }
      }
    } else {
      // Exiting edit mode - check for unsaved changes
      if (hasUnsavedChanges) {
        const confirmExit = window.confirm(
          'You have unsaved changes in your edit session. Are you sure you want to exit edit mode?'
        );
        if (!confirmExit) {
          return; // Don't exit edit mode
        }
      }

      // Reset dirty state
      setHasUnsavedChanges(false);

      // Exiting edit mode - update current sequence if we have a custom sequence loaded
      if (sequences.currentSequence.startsWith('custom-')) {
        // Refresh the grid to show the updated custom sequence
        sequences.refreshCurrentSequence();
      }
    }

    setEditMode(newEditMode);
  }, [editMode, sequences, hasUnsavedChanges, editStage]);

  // Handle sequence loading from manager with confirmation
  const handleLoadSequence = useCallback((sequence) => {
    if (hasUnsavedChanges) {
      const confirmLoad = window.confirm(
        'You have unsaved changes in your current edit session. Loading a new sequence will discard these changes. Continue?'
      );
      if (!confirmLoad) {
        return false;
      }
    }

    setEditStage(sequence.values);
    setHasUnsavedChanges(false);
    return true;
  }, [hasUnsavedChanges]);

  // Autosave edit stage
  useEffect(() => {
    if (editMode) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.EDIT_STAGE, JSON.stringify(editStage));
      } catch (error) {
        console.error('Error saving edit stage:', error);
      }
    }
  }, [editStage, editMode]);

  // Keyboard navigation (only in view mode)
  useEffect(() => {
    if (editMode || selectedHex === null) return;

    const handleKeyDown = (e) => {
      const row = Math.floor(selectedHex / 8);
      const col = selectedHex % 8;

      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(7, row + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(7, col + 1);
          break;
        default:
          return;
      }

      e.preventDefault();
      setSelectedHex(newRow * 8 + newCol);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHex, editMode]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <AppHeader
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        editMode={editMode}
        setEditMode={handleToggleEditMode}
        currentSequence={sequences.currentSequence}
        setCurrentSequence={sequences.setCurrentSequence}
        customSequences={sequences.customSequences}
        hasUnsavedChanges={hasUnsavedChanges}
        showSixiangs={showSixiangs}
        setShowSixiangs={setShowSixiangs}
        showKingWenNumbers={showKingWenNumbers}
        setShowKingWenNumbers={setShowKingWenNumbers}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-screen-2xl mx-auto">
        {/* Main Panel */}
        <div className="flex-1 min-w-0">
          {editMode ? (
            <EditableHexagramGrid
              editStage={editStage}
              setEditStage={handleEditStageChange}
              selectedHex={selectedHex}
              onSelectHex={handleSelectHex}
              filters={filters}
              neighbors={neighbors}
              hasUnsavedChanges={hasUnsavedChanges}
              showSixiangs={showSixiangs}
              showKingWenNumbers={showKingWenNumbers}
            />
          ) : (
            <HexagramGrid
              selectedHex={selectedHex}
              onSelectHex={handleSelectHex}
              neighbors={neighbors}
              filters={filters}
              currentSequence={sequences.currentSequence}
              customSequences={sequences.customSequences}
              showSixiangs={showSixiangs}
              showKingWenNumbers={showKingWenNumbers}
            />
          )}
        </div>

        {/* Side Panel with Tabs */}
        <div className="lg:w-96 lg:shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <AppTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              editMode={editMode}
            />

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === TAB_NAMES.INSPECTOR && (
                <InspectorPanel
                  hexIndex={selectedHex}
                  onSelectHex={handleSelectHex}
                  showSixiangs={showSixiangs}
                  showKingWenNumbers={showKingWenNumbers}
                />
              )}
              {activeTab === TAB_NAMES.FILTERS && (
                <FiltersPanel
                  filters={filters}
                  placedHexagrams={editMode ? editStage.filter(h => h !== null) : []}
                  onSelectHex={handleSelectHex}
                  setEditStage={handleEditStageChange}
                  editMode={editMode}
                  showSixiangs={showSixiangs}
                  showKingWenNumbers={showKingWenNumbers}
                />
              )}
              {activeTab === TAB_NAMES.MANAGER && editMode && (
                <SequenceManager
                  editStage={editStage}
                  setEditStage={handleEditStageChange}
                  setCurrentSequence={sequences.setCurrentSequence}
                  setEditMode={setEditMode}
                  addSequence={sequences.addSequence}
                  removeSequence={sequences.removeSequence}
                  customSequences={sequences.customSequences}
                  currentSequence={sequences.currentSequence}
                  onLoadSequence={handleLoadSequence}
                  hasUnsavedChanges={hasUnsavedChanges}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 mt-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
        <p>
          {editMode
            ? 'Drag hexagrams from pool to grid • Drag placed hexagrams to move or swap • Double-click to remove • Save in Manager'
            : 'Use arrow keys to navigate • Click hexagrams to explore relationships'}
        </p>
        {editMode && hasUnsavedChanges && (
          <p className="text-amber-600 dark:text-amber-400 font-medium mt-1">
            • You have unsaved changes •
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
