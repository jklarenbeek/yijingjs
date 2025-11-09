// src/App.jsx

import { useState, useEffect, useMemo, useCallback } from 'react';
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
        setEditMode={setEditMode}
        currentSequence={sequences.currentSequence}
        setCurrentSequence={sequences.setCurrentSequence}
        customSequences={sequences.customSequences}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-screen-2xl mx-auto">
        {/* Main Panel */}
        <div className="flex-1 min-w-0">
          {editMode ? (
            <EditableHexagramGrid
              editStage={editStage}
              setEditStage={setEditStage}
              selectedHex={selectedHex}
              onSelectHex={handleSelectHex}
              filters={filters}
              neighbors={neighbors}
            />
          ) : (
            <HexagramGrid
              selectedHex={selectedHex}
              onSelectHex={handleSelectHex}
              neighbors={neighbors}
              filters={filters}
              currentSequence={sequences.currentSequence}
              customSequences={sequences.customSequences}
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
                />
              )}
              {activeTab === TAB_NAMES.FILTERS && (
                <FiltersPanel
                  filters={filters}
                  placedHexagrams={editMode ? editStage.filter(h => h !== null) : []}
                  onSelectHex={handleSelectHex}
                  setEditStage={setEditStage}
                  editMode={editMode}
                />
              )}
              {activeTab === TAB_NAMES.MANAGER && editMode && (
                <SequenceManager
                  editStage={editStage}
                  setEditStage={setEditStage}
                  setCurrentSequence={sequences.setCurrentSequence}
                  setEditMode={setEditMode}
                  addSequence={sequences.addSequence}
                  removeSequence={sequences.removeSequence}
                  customSequences={sequences.customSequences}
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
            ? 'Drag hexagrams from pool to grid • Double-click to remove • Save in Manager'
            : 'Use arrow keys to navigate • Click hexagrams to explore relationships'}
        </p>
      </footer>
    </div>
  );
}

export default App;
