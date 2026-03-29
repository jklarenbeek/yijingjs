// src/App.jsx

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import * as Yijing from '@yijingjs/core';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';

import useFilters from './hooks/useFilters.js';
import useSequences from './hooks/useSequences.js';
import useTheme from './hooks/useTheme.js';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

import { LOCAL_STORAGE_KEYS, TAB_NAMES, APP_VIEWS } from './utils/constants';

import HexagramCard from './components/HexagramCard';
import MainTabBar from './components/MainTabBar';
import MatrixPanel from './components/MatrixPanel';
import SequencesPanel from './components/SequencesPanel';
import SefirotPanel from './components/SefirotPanel';
import HomePanel from './components/HomePanel';
import SettingsMenu from './components/SettingsMenu';
import { YijingProvider } from './components/YijingContext';
import BackgroundEngine from './components/BackgroundEngine';

function App() {
  const [selectedHex, setSelectedHex] = useState(null);
  const [showSixiangs, setShowSixiangs] = useState(false);
  const [showKingWenNumbers, setShowKingWenNumbers] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_NAMES.FILTERS);
  const [activeAppView, setActiveAppView] = useState(APP_VIEWS.HOME);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dnd-Kit state
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragData, setActiveDragData] = useState(null);

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

  // DND Handlers
  const handleDragStart = useCallback((event) => {
    setActiveDragId(event.active.id);
    setActiveDragData(event.active.data.current);
  }, []);

  const handleDragEnd = useCallback((event) => {
    setActiveDragId(null);
    setActiveDragData(null);
    // Dispatch to EditableHexagramGrid to handle the logic
    document.dispatchEvent(new CustomEvent('yijingDndDragEnd', { detail: event }));
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveDragId(null);
    setActiveDragData(null);
  }, []);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <YijingProvider>
        <BackgroundEngine />
        <div className="min-h-screen flex flex-col bg-transparent text-gray-900 dark:text-white transition-colors">
        <main className="relative flex-1">
          <AnimatePresence mode="wait">
            {activeAppView === APP_VIEWS.HOME && (
              <motion.div key="view-home" className="w-full h-full">
                <HomePanel 
                  selectedHex={selectedHex}
                  handleSelectHex={handleSelectHex}
                  showSixiangs={showSixiangs}
                />
              </motion.div>
            )}

            {activeAppView === APP_VIEWS.GRID && (
              <MatrixPanel
                editMode={editMode}
                setEditMode={setEditMode}
                editStage={editStage}
                handleEditStageChange={handleEditStageChange}
                selectedHex={selectedHex}
                handleSelectHex={handleSelectHex}
                filters={filters}
                neighbors={neighbors}
                hasUnsavedChanges={hasUnsavedChanges}
                setHasUnsavedChanges={setHasUnsavedChanges}
                showSixiangs={showSixiangs}
                showKingWenNumbers={showKingWenNumbers}
                sequences={sequences}
                handleLoadSequence={handleLoadSequence}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {activeAppView === APP_VIEWS.SEQUENCES && (
              <motion.div key="view-sequences" className="w-full h-full">
                <SequencesPanel 
                  showKingWenNumbers={showKingWenNumbers} 
                  selectedHex={selectedHex}
                  handleSelectHex={handleSelectHex}
                  showSixiangs={showSixiangs}
                />
              </motion.div>
            )}

            {activeAppView === APP_VIEWS.SEFIROT && (
              <motion.div key="view-sefirot" className="w-full h-full">
                <SefirotPanel 
                  showKingWenNumbers={showKingWenNumbers} 
                  selectedHex={selectedHex}
                  handleSelectHex={handleSelectHex}
                  showSixiangs={showSixiangs}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <div className="sticky bottom-0 z-50 w-full relative">
          <MainTabBar 
            activeView={activeAppView} 
            setActiveView={setActiveAppView} 
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

        <SettingsMenu
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          showSixiangs={showSixiangs}
          setShowSixiangs={setShowSixiangs}
          showKingWenNumbers={showKingWenNumbers}
          setShowKingWenNumbers={setShowKingWenNumbers}
        />

        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeDragId && activeDragData ? (
            <div style={{ transform: 'scale(1.05)', cursor: 'grabbing' }}>
              <HexagramCard
                hexIndex={activeDragData.hexIndex}
                selectedHex={null}
                onClick={() => { }}
                isNeighbor={false}
                filters={filters}
                inEditMode
                showSixiangs={showSixiangs}
                showKingWenNumbers={showKingWenNumbers}
              />
            </div>
          ) : null}
        </DragOverlay>

        </div>
      </YijingProvider>
    </DndContext>
  );
}

export default App;
