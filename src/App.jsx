// src/App.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import * as Yijing from '@yijingjs/core';

import HexagramGrid from './components/HexagramGrid';
import SymmetryGroupsPanel from './components/SymmetryGroupsPanel';
import InspectorPanel from './components/InspectorPanel';
import SequenceDropdown from './components/SequenceDropdown'; // Add this import

function App() {
  const [selectedHex, setSelectedHex] = useState(null);
  const [filterSymmetry, setFilterSymmetry] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [currentSequence, setCurrentSequence] = useState('bagua');

  const symmetryGroups = useMemo(() => Yijing.yijing_symmetryGroups(), []);

  const neighbors = useMemo(() => {
    if (selectedHex === null) return [];
    return Yijing.yijing_neighbors(selectedHex);
  }, [selectedHex]);

  // Toggle selection - click same hexagram to deselect
  const handleSelectHex = (hexIndex) => {
    setSelectedHex(prev => prev === hexIndex ? null : hexIndex);
  };

  const handleFilterToggle = (symmetry) => {
    setFilterSymmetry(prev => {
      if (prev.includes(symmetry)) {
        return prev.filter(s => s !== symmetry);
      } else {
        return [...prev, symmetry];
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedHex === null) return;

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
  }, [selectedHex]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 transition-colors">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <h1 className="text-2xl font-bold">Yijing Explorer</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-screen-2xl mx-auto">
        {/* Main Panel */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <SequenceDropdown
                currentSequence={currentSequence}
                onSequenceChange={setCurrentSequence}
              />
            </div>
            <div className="flex-1">
              <SymmetryGroupsPanel
                groups={symmetryGroups}
                filterSymmetry={filterSymmetry}
                onFilterToggle={handleFilterToggle}
              />
            </div>
          </div>

          <HexagramGrid
            selectedHex={selectedHex}
            onSelectHex={handleSelectHex}  // Use the new toggle function
            neighbors={neighbors}
            symmetryData={symmetryGroups}
            filterSymmetry={filterSymmetry}
            currentSequence={currentSequence}
          />
        </div>

        {/* Inspector Panel */}
        <div className="lg:w-96 lg:shrink-0">
          <InspectorPanel
            hexIndex={selectedHex}
            neighbors={neighbors}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 mt-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
        <p>Use arrow keys to navigate • Click hexagrams to explore relationships</p>
      </footer>
    </div>
  );
}

export default App;