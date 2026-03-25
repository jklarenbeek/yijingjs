// src/components/SefirotPanel.jsx

import { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { getSequencePairs, categorizeSequencePairs } from '../utils/tools';
import HexagramCard from './HexagramCard';

const NODES = [
  { id: 'keter', name: 'Keter', cx: 50, cy: 10 },
  { id: 'chokhmah', name: 'Chokhmah', cx: 80, cy: 25 },
  { id: 'binah', name: 'Binah', cx: 20, cy: 25 },
  { id: 'chesed', name: 'Chesed', cx: 80, cy: 55 },
  { id: 'gevurah', name: 'Gevurah', cx: 20, cy: 55 },
  { id: 'tiferet', name: 'Tiferet', cx: 50, cy: 70 },
  { id: 'netzach', name: 'Netzach', cx: 80, cy: 100 },
  { id: 'hod', name: 'Hod', cx: 20, cy: 100 },
  { id: 'yesod', name: 'Yesod', cx: 50, cy: 115 },
  { id: 'malkuth', name: 'Malkuth', cx: 50, cy: 140 },
];

const PATHS = [
  [0, 1], [0, 2], [0, 5],
  [1, 2], [1, 3], [1, 5],
  [2, 4], [2, 5],
  [3, 4], [3, 5], [3, 6],
  [4, 5], [4, 7],
  [5, 6], [5, 7], [5, 8],
  [6, 7], [6, 8], [6, 9],
  [7, 8], [7, 9],
  [8, 9]
];

const SefirotPanel = ({ showKingWenNumbers, selectedHex, handleSelectHex }) => {
  const [hoveredData, setHoveredData] = useState(null);

  // Load exactly 10 nodes and 22 paths relationships
  const pairsData = useMemo(() => {
    return categorizeSequencePairs(getSequencePairs(true));
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto p-1 md:p-2 w-full h-full overflow-y-auto">
      <div className="p-2 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            The Tree of Life
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
            The 10 Emanations (Sefirot) and 22 Paths of Wisdom mapped to the 32 pairs of the I Ching. Hover over the nodes and paths to reveal their hexagram mappings.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SVG Tree Container */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center relative min-h-[500px]">

          <svg
            viewBox="0 0 100 150"
            className="w-full h-full max-w-lg drop-shadow-lg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="paths">
              {PATHS.map((path, index) => {
                const startNode = NODES[path[0]];
                const endNode = NODES[path[1]];
                const pair = pairsData.unbalanced[index];
                const isHovered = hoveredData && hoveredData.type === 'path' && hoveredData.id === index;

                return (
                  <line
                    key={`path-${index}`}
                    x1={startNode.cx} y1={startNode.cy}
                    x2={endNode.cx} y2={endNode.cy}
                    stroke={isHovered ? "#3b82f6" : "currentColor"}
                    strokeWidth="1.5"
                    className={`text-gray-300 dark:text-gray-600 transition-all duration-300 cursor-pointer ${isHovered ? 'stroke-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'hover:stroke-blue-400'}`}
                    onMouseEnter={() => setHoveredData({ type: 'path', id: index, pair, label: `Path from ${startNode.name} to ${endNode.name}` })}
                    onMouseLeave={() => setHoveredData(null)}
                  />
                );
              })}
            </g>

            <g className="nodes">
              {NODES.map((node, index) => {
                const pair = pairsData.balanced[index];
                const isHovered = hoveredData && hoveredData.type === 'node' && hoveredData.id === index;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredData({ type: 'node', id: index, pair, label: `Sefirah: ${node.name}` })}
                    onMouseLeave={() => setHoveredData(null)}
                  >
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isHovered ? "6" : "5"}
                      className={`transition-all duration-300 ${isHovered ? 'fill-amber-400 stroke-amber-200 shadow-xl drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'fill-white stroke-amber-500 dark:fill-gray-900 dark:stroke-amber-600'}`}
                      strokeWidth="1"
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 8}
                      textAnchor="middle"
                      className="text-[3px] font-bold fill-gray-700 dark:fill-gray-300 pointer-events-none drop-shadow-sm select-none"
                    >
                      {node.name}
                    </text>
                    <text
                      x={node.cx}
                      y={node.cy + 1}
                      textAnchor="middle"
                      className="text-[4px] font-mono fill-gray-500 pointer-events-none select-none"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Info Panel side container */}
        <div className="w-full md:w-96 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col justify-center min-h-[300px]">
            <AnimatePresence mode="wait">
              {hoveredData ? (
                <motion.div
                  key={`info-${hoveredData.type}-${hoveredData.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-center mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${hoveredData.type === 'node' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {hoveredData.type === 'node' ? 'Emanation (Balanced)' : 'Path (Unbalanced)'}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {hoveredData.label}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {hoveredData.pair.label}
                    </p>
                  </div>

                  <div className="flex justify-center gap-6 w-full px-4">
                    <div className="flex-1 flex justify-center">
                      <HexagramCard hexIndex={hoveredData.pair.hexA} showKingWenNumbers={showKingWenNumbers} selectedHex={selectedHex} onClick={handleSelectHex} />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <HexagramCard hexIndex={hoveredData.pair.hexB} showKingWenNumbers={showKingWenNumbers} selectedHex={selectedHex} onClick={handleSelectHex} />
                    </div>
                  </div>

                  <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl w-full">
                    <p>Symmetry Score: <span className="font-mono text-gray-900 dark:text-gray-100">{hoveredData.pair.score}</span></p>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center px-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">
                    Inspect the Tree
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Hover or tap any node (Sefirah) or path on the Tree of Life to reveal its associated I Ching hexagram pair.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SefirotPanel;
