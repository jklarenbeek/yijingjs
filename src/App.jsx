import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import HexagramGrid from './components/HexagramGrid';
import SymmetryGroupsPanel from './components/SymmetryGroupsPanel';
import InspectorPanel from './components/InspectorPanel';

import './App.css'

function App() {
  const [selectedHex, setSelectedHex] = useState(null);
  const [filterSymmetry, setFilterSymmetry] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const symmetryGroups = useMemo(() => Yijing.yijing_symmetryGroups(), []);

  const neighbors = useMemo(() => {
    if (selectedHex === null) return [];
    return Yijing.yijing_neighbors(selectedHex);
  }, [selectedHex]);

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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Yijing Explorer</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Main Panel */}
        <div className="flex-1">
          <SymmetryGroupsPanel
            groups={symmetryGroups}
            filterSymmetry={filterSymmetry}
            onFilterToggle={handleFilterToggle}
          />

          <HexagramGrid
            selectedHex={selectedHex}
            onSelectHex={setSelectedHex}
            neighbors={neighbors}
            symmetryData={symmetryGroups}
            filterSymmetry={filterSymmetry}
          />
        </div>

        {/* Inspector Panel */}
        <div className="lg:w-96">
          <InspectorPanel
            hexIndex={selectedHex}
            neighbors={neighbors}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-4 mt-8 text-center text-sm text-gray-400">
        <p>Use arrow keys to navigate • Click hexagrams to explore relationships</p>
      </footer>
    </div>
  );
}

export default App;