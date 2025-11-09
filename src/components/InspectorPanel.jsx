// src/components/InspectorPanel.jsx

import React, { useState, useEffect, useMemo } from 'react';

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';

import HexagramCard from './HexagramCard';
import { cn, getHexagramData } from '../utils/tools.js';

const InspectorPanel = ({ hexIndex, onSelectHex }) => {
  const [history, setHistory] = useState([]);

  // Define currentHex early, with fallback to hexIndex for initial sync
  const currentHex = history[history.length - 1] ?? hexIndex;

  // Memoize expensive calculations
  const currentData = useMemo(() => getHexagramData(currentHex), [currentHex]);

  // Sync history when global selection changes
  useEffect(() => {
    if (hexIndex !== null) {
      setHistory([hexIndex]);
    } else {
      setHistory([]);
    }
  }, [hexIndex]);

  const handleLocalSelect = (newHex) => {
    if (newHex !== (history[history.length - 1] || null)) {
      setHistory(prev => [...prev, newHex]);
    }
  };

  const handleGoToGlobal = () => {
    if (currentData) {
      onSelectHex(history[history.length - 1]);
      setHistory([history[history.length - 1]]);
    }
  };

  if (!currentData || history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 shadow-sm border border-gray-200 dark:border-gray-700">
        <p>Select a hexagram to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hexagram {currentHex}</h2>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">{currentData.binaryString}</p>
        </div>

        {/* Breadcrumb Navigation */}
        {history.length > 1 && (
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6 flex items-center justify-between gap-2 text-sm mb-4">
            <div className="flex items-center gap-2 flex-1 overflow-x-auto">
              {history.map((h, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-gray-400 dark:text-gray-500">›</span>}
                  <button
                    onClick={() => setHistory(history.slice(0, idx + 1))}
                    className={cn(
                      "font-medium transition-colors whitespace-nowrap",
                      idx === history.length - 1
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                    aria-label={`Navigate to hexagram ${h} in history`}
                  >
                    {h}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <button
              onClick={handleGoToGlobal}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-md transition-all",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "shadow-sm hover:shadow"
              )}
              aria-label="Set as main selection"
            >
              Go
            </button>
          </div>
        )}

        {/* Basic Info */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Geometry</summary>
          {currentData.foundationName && (
            <div className="flex items-center gap-2 p-2 mb-1 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentData.foundationColor }} />
              <span className="capitalize font-medium">Foundational</span>
            </div>
          )}
          <div className="flex items-center gap-2 p-2 mb-1 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentData.balancedColor }} />
            <span className="capitalize font-medium">{currentData.balancedName}</span>
          </div>
          <div className="flex items-center gap-2 p-2 mb-1 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentData.mantraColor }} />
            <span className="capitalize font-medium">{currentData.mantraName}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentData.symmetryColor }} />
            <span className="capitalize font-medium">{currentData.symmetryName}</span>
          </div>
        </details>

        {/* Trigram Flow */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Trigram Flow
          </summary>
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Upper</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(currentData.upperWuxing)}</span>
                <span className="capitalize text-sm font-medium">{currentData.upperWuxing}<br />{currentData.upperSymbol}</span>
                <span className="text-xs text-gray-500 ml-1">({currentData.upper})</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transition</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {Wuxing.wuxing_transitionSymbolChar(currentData.transitionType)}
                </span>
                <span className="capitalize text-sm font-medium text-blue-700 dark:text-blue-300">
                  {currentData.transitionType}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Lower</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(currentData.lowerWuxing)}</span>
                <span className="capitalize text-sm font-medium">{currentData.lowerWuxing}<br />{currentData.lowerSymbol}</span>
                <span className="text-xs text-gray-500 ml-1">({currentData.lower})</span>
              </div>
            </div>
          </div>
        </details>

        {/* Genetic Mapping */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Genetic Mapping</summary>
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span>Deus (Red):</span>
              <span className="capitalize">
                {Wuxing.sixiang_toName(currentData.red)}
                {Wuxing.sixiang_toSymbolChar(currentData.red)}
                {Wuxing.sixiang_toEmojiChar(currentData.red)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Homo (White):</span>
              <span className="capitalize">
                {Wuxing.sixiang_toName(currentData.white)}
                {Wuxing.sixiang_toSymbolChar(currentData.white)}
                {Wuxing.sixiang_toEmojiChar(currentData.white)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Torah (Blue):</span>
              <span className="capitalize">
                {Wuxing.sixiang_toName(currentData.blue)}
                {Wuxing.sixiang_toSymbolChar(currentData.blue)}
                {Wuxing.sixiang_toEmojiChar(currentData.blue)}
              </span>
            </div>
          </div>
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p>Codon: {currentData.codon}</p>
            <p>Amino Acid: {currentData.aaName} {currentData.isStop ? '(Stop)' : ''}</p>
          </div>
        </details>

        {/* Path to Root */}
        {currentData.centerChain.length > 1 && (
          <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
            <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              Path to Root ({currentData.centerChain.length - 1} steps)
            </summary>
            <div className="grid grid-cols-3 gap-0.75">
              {currentData.centerChain.map((h, idx) => (
                <div
                  key={h}
                  className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HexagramCard
                    hexIndex={h}
                    selected={h === currentHex}
                    onClick={() => handleLocalSelect(h)}
                    isNeighbor={idx > 0}
                    filters={{}}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                    {idx === currentData.centerChain.length - 1 ? 'Cosmic' : (idx === currentData.centerChain.length - 2 ? 'Karmic' : 'Atomic')}&nbsp;
                    ({Yijing.yijing_relationEmojiChar(currentHex, h)})
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Transformations */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6">
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Transformations</summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0.75">
            {Object.entries(currentData.orbit).map(([key, value]) => (
              <div
                key={key}
                className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <HexagramCard
                  hexIndex={value}
                  selected={false}
                  onClick={() => handleLocalSelect(value)}
                  isNeighbor={false}
                  filters={{}}
                />

                <span className="text-xs capitalize text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {key} ({Yijing.yijing_relationEmojiChar(currentHex, value)})
                </span>
              </div>
            ))}
          </div>
        </details>

        {/* Neighbors */}
        {currentData.localNeighbors.length > 0 && (
          <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6">
            <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              Neighbors ({currentData.localNeighbors.length})
            </summary>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-0.75">
              {currentData.localNeighbors.map(n => (
                <div
                  key={n}
                  className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HexagramCard
                    hexIndex={n}
                    selected={false}
                    onClick={() => handleLocalSelect(n)}
                    isNeighbor={true}
                    filters={{}}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                    {Yijing.yijing_relationEmojiChar(currentHex, n)}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Advanced Metrics */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6">
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Advanced Metrics</summary>
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p>King Wen: {currentData.kingWenNumber}</p>
            <p>Gray Code: {currentData.grayCode} (Position: {currentData.grayPosition})</p>
            <p>Yang Lines: {currentData.lineCount} / 6</p>
            <p>Root: {currentData.root}</p>
            <p>Distance to Root: {currentData.distanceToRoot}</p>
            <p>Depth: {currentData.depth}</p>
            <p>Entropy: {currentData.entropy}</p>
            <p>Balance: {currentData.balance}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default InspectorPanel;
