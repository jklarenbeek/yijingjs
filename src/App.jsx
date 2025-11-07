// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Edit3, X } from 'lucide-react';
import * as Yijing from '@yijingjs/core';
import { cn } from './globals.js';

import HexagramGrid from './components/HexagramGrid';
import EditableHexagramGrid from './components/EditableHexagramGrid';
import InspectorPanel from './components/InspectorPanel';
import FiltersPanel from './components/FiltersPanel.jsx';
import SequenceDropdown from './components/SequenceDropdown';
import SequenceManager from './components/SequenceManager';
import { getAllSequences } from './utils/sequenceStorage';

function App() {
  const [selectedHex, setSelectedHex] = useState(null);
  const [filterSymmetry, setFilterSymmetry] = useState([]);
  const [filterMantra, setFilterMantra] = useState([]);
  const [filterBalance, setFilterBalance] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [currentSequence, setCurrentSequence] = useState('bagua');
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('inspector');
  const [editStage, setEditStage] = useState(() => {
    const saved = localStorage.getItem('yijing_edit_stage');
    return saved ? JSON.parse(saved) : Array(64).fill(null);
  });

  const neighbors = useMemo(() => {
    if (selectedHex === null) return [];
    return Yijing.yijing_neighbors(selectedHex);
  }, [selectedHex]);

  const handleSelectHex = (hexIndex) => {
    setSelectedHex(prev => prev === hexIndex ? null : hexIndex);
  };

  const handleSymmetryToggle = (key) => {
    setFilterSymmetry(prev => {
      let newFilter = prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key];
      if (newFilter.length > 0) {
        setFilterMantra([]);
        setFilterBalance([]);
      }
      return newFilter;
    });
  };

  const handleMantraToggle = (key) => {
    setFilterMantra(prev => {
      let newFilter = prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key];
      if (newFilter.length > 0) {
        setFilterSymmetry([]);
      }
      return newFilter;
    });
  };

  const handleBalanceToggle = (key) => {
    setFilterBalance(prev => {
      let newFilter = prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key];
      if (newFilter.length > 0) {
        setFilterSymmetry([]);
      }
      return newFilter;
    });
  };

  // Autosave edit stage
  useEffect(() => {
    if (editMode) {
      localStorage.setItem('yijing_edit_stage', JSON.stringify(editStage));
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

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load custom sequences for dropdown
  const customSequences = useMemo(() => getAllSequences(), []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 transition-colors">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Yijing Explorer</h1>
            <SequenceDropdown
              currentSequence={currentSequence}
              onSequenceChange={setCurrentSequence}
              customSequences={customSequences}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                editMode
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              )}
            >
              {editMode ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {editMode ? 'Exit Edit' : 'Edit Mode'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-screen-2xl mx-auto">
        {/* Main Panel */}
        <div className="flex-1 min-w-0">
          {editMode ? (
            <div className="space-y-4">
              <EditableHexagramGrid
                editStage={editStage}
                setEditStage={setEditStage}
                selectedHex={selectedHex}
                onSelectHex={handleSelectHex}
                filterSymmetry={filterSymmetry}
                filterMantra={filterMantra}
                filterBalance={filterBalance}
              />
            </div>
          ) : (
            <>
              <HexagramGrid
                selectedHex={selectedHex}
                onSelectHex={handleSelectHex}
                neighbors={neighbors}
                filterSymmetry={filterSymmetry}
                filterMantra={filterMantra}
                filterBalance={filterBalance}
                currentSequence={currentSequence}
                customSequences={customSequences}
              />
            </>
          )}
        </div>

        {/* Side Panel with Tabs */}
        <div className="lg:w-96 lg:shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('inspector')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === 'inspector'
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                Inspector
              </button>
              <button
                onClick={() => setActiveTab('filters')}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === 'filters'
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                Filters
              </button>
              {editMode && (
                <button
                  onClick={() => setActiveTab('manager')}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === 'manager'
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  Manager
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'inspector' && (
                <InspectorPanel
                  hexIndex={selectedHex}
                  neighbors={neighbors}
                  onSelectHex={handleSelectHex}
                />
              )}
              {activeTab === 'filters' && (
                <FiltersPanel
                  filterSymmetry={filterSymmetry}
                  onSymmetryToggle={handleSymmetryToggle}
                  filterMantra={filterMantra}
                  onMantraToggle={handleMantraToggle}
                  filterBalance={filterBalance}
                  onBalanceToggle={handleBalanceToggle}
                  placedHexagrams={editMode ? editStage.filter(h => h !== null) : []}
                  onSelectHex={handleSelectHex}
                  setEditStage={setEditStage}
                  editMode={editMode}
                />)}
              {activeTab === 'manager' && editMode && (
                <SequenceManager
                  editStage={editStage}
                  setEditStage={setEditStage}
                  setCurrentSequence={setCurrentSequence}
                  setEditMode={setEditMode}
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