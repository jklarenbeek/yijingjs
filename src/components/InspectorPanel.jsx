// src/components/InspectorPanel.jsx
import React, { useState, useEffect } from 'react';
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';
import HexagramCard from './HexagramCard';
import { toBinary, cn } from '../globals.js';
import * as theme from '../utils/colors.js';

const InspectorPanel = ({ hexIndex, onSelectHex }) => {
  const [history, setHistory] = useState([]);

  // Sync history when global selection changes
  useEffect(() => {
    if (hexIndex !== null) {
      setHistory([hexIndex]);
    } else {
      setHistory([]);
    }
  }, [hexIndex]);

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 shadow-sm border border-gray-200 dark:border-gray-700">
        <p>Select a hexagram to view details</p>
      </div>
    );
  }

  const currentHex = history[history.length - 1];

  const handleLocalSelect = (newHex) => {
    if (newHex !== currentHex) {
      setHistory(prev => [...prev, newHex]);
    }
  };

  const handleGoToGlobal = () => {
    onSelectHex(currentHex);
    // History is automatically reset by useEffect on hexIndex change
    // But we can be explicit:
    setHistory([currentHex]);
  };

  const upper = Yijing.yijing_upper(currentHex);
  const lower = Yijing.yijing_lower(currentHex);
  const upperSymbol = Bagua.bagua_toSymbolChar(upper);
  const lowerSymbol = Bagua.bagua_toSymbolChar(lower);
  const upperWuxing = Bagua.bagua_toWuxing(upper);
  const lowerWuxing = Bagua.bagua_toWuxing(lower);
  const symmetry = Yijing.yijing_symmetryName(currentHex);
  const foundation = Yijing.yijing_isFoundation(currentHex)
    ? "Foundational"
    : null;
  const balanced = Yijing.yijing_balancedName(currentHex);
  const mantra = Yijing.yijing_mantraName(currentHex);
  const lineCount = Yijing.yijing_lineCount(currentHex);
  const binary = toBinary(currentHex);
  const transitionType = Wuxing.wuxing_transitionType(upperWuxing, lowerWuxing);
  const orbit = Yijing.yijing_orbitClass(currentHex);
  const centerChain = Yijing.yijing_getCenterChain(currentHex);
  const localNeighbors = Yijing.yijing_neighbors(currentHex);

  const red = Yijing.yijing_red(currentHex);
  const white = Yijing.yijing_white(currentHex);
  const blue = Yijing.yijing_blue(currentHex);

  const kingWenNumber = Yijing.YIJING_KINGWEN_SEQUENCE[currentHex] + 1;

  const grayCode = Yijing.yijing_toGray(currentHex);
  const grayPosition = Yijing.yijing_fromGray(currentHex);

  const entropy = Yijing.yijing_entropy(currentHex).toFixed(3);
  const balance = Yijing.yijing_balance(currentHex).toFixed(3);
  const depth = Yijing.yijing_depth(currentHex);
  const root = Yijing.yijing_root(currentHex);
  const distanceToRoot = Yijing.yijing_distance(currentHex, root);

  const codon = Yijing.yijing_toCodon(currentHex);
  const aaName = Yijing.yijing_toAminoAcidName(currentHex);
  const isStop = Yijing.yijing_isStopCodon(currentHex);

  // Placeholder for amino acid SVGs - replace with actual inline SVG strings
  const getAASvg = (name) => {
    // Example placeholder SVG
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><rect width="200" height="100" fill="#f0f0f0"/><text x="10" y="50" font-size="16">${name} Structure</text></svg>`;
    // For real implementation, use something like:
    // if (name === 'glycine') return '<svg ... full code ... </svg>';
    // Get SVGs from sources like Wikimedia Commons individual files, e.g., for glycine: https://upload.wikimedia.org/wikipedia/commons/6/6c/Glycine-skeletal.svg
    // But since extraction was difficult, use placeholders or fetch dynamically if possible.
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* ---------- SCROLLABLE CONTENT ---------- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ---------- HEADER (sticky) ---------- */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hexagram {currentHex}</h2>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">{binary}</p>
        </div>

        {/* ---------- BREADCRUMB + GO BUTTON ---------- */}
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
                  >
                    {h}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Go Button */}
            <button
              onClick={handleGoToGlobal}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-md transition-all",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "shadow-sm hover:shadow"
              )}
              title="Set as main selection"
            >
              Go
            </button>
          </div>
        )}

        {/* ---------- BASIC INFO ---------- */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Geometry</summary>
          {foundation && (
            <div className="flex items-center gap-2 p-2 mb-1 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFFF00' }} />
              <span className="capitalize font-medium">{foundation}</span>
            </div>
          )}
          <div className="flex items-center gap-2 p-2 mb-1 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.balancedColors[balanced] }} />
            <span className="capitalize font-medium">{balanced}</span>
          </div>
          <div className="flex items-center gap-2 p-2 mb-1 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.mantraColors[mantra] }} />
            <span className="capitalize font-medium">{mantra}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.symmetryColors[symmetry] }} />
            <span className="capitalize font-medium">{symmetry}</span>
          </div>
        </details>

        {/* ---------- TRIGRAM FLOW ---------- */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Trigram Flow
          </summary>

          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {/* Upper Trigram */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Upper</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(upperWuxing)}</span>
                <span className="capitalize text-sm font-medium">{upperWuxing}<br />{upperSymbol}</span>
                <span className="text-xs text-gray-500 ml-1">({upper})</span>
              </div>
            </div>

            {/* Transition Arrow + Symbol */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transition</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {Wuxing.wuxing_transitionSymbolChar(transitionType)}
                </span>
                <span className="capitalize text-sm font-medium text-blue-700 dark:text-blue-300">
                  {transitionType}
                </span>
              </div>
            </div>

            {/* Lower Trigram */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Lower</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(lowerWuxing)}</span>
                <span className="capitalize text-sm font-medium">{lowerWuxing}<br />{lowerSymbol}</span>
                <span className="text-xs text-gray-500 ml-1">({lower})</span>
              </div>
            </div>
          </div>
        </details>

        {/* ---------- GENETIC MAPPING ---------- */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Genetic Mapping</summary>
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="">Deus (Red):</span>
              <span className="capitalize">{Wuxing.sixiang_toName(red)} {Wuxing.sixiang_toSymbolChar(red)} {Wuxing.sixiang_toEmojiChar(red)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="">Homo (White):</span>
              <span className="capitalize">{Wuxing.sixiang_toName(white)} {Wuxing.sixiang_toSymbolChar(white)} {Wuxing.sixiang_toEmojiChar(white)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="">Torah (Blue):</span>
              <span className="capitalize">{Wuxing.sixiang_toName(blue)} {Wuxing.sixiang_toSymbolChar(blue)} {Wuxing.sixiang_toEmojiChar(blue)}</span>
            </div>
          </div>
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p>Codon: {codon}</p>
            <p>Amino Acid: {aaName} {isStop ? '(Stop)' : ''}</p>
            {!isStop && (
              <div className="flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: getAASvg(aaName) }} />
              </div>
            )}
          </div>
        </details>

        {/* ---------- PATH TO ROOT ---------- */}
        {centerChain.length > 1 && (
          <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6" open>
            <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Path to Root ({centerChain.length - 1} steps)</summary>
            <div className="grid grid-cols-3 gap-0.75">
              {centerChain.map((h, idx) => (
                <div
                  key={h}
                  className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HexagramCard
                    hexIndex={h}
                    selected={h === currentHex}
                    onClick={() => handleLocalSelect(h)}
                    isNeighbor={idx > 0}
                    neighborRelation={idx > 0 ? centerChain[idx - 1] : null}
                    symmetryGroup={Yijing.yijing_symmetryName(h)}
                    filterSymmetry={[]}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                    {idx === centerChain.length - 1 ? 'Cosmic' : (idx === centerChain.length - 2 ? 'Karmic' : 'Atomic')}&nbsp;
                    ({Yijing.yijing_relationEmojiChar(currentHex, h)})
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* ---------- TRANSFORMATIONS ---------- */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6">
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Transformations</summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0.75">
            {Object.entries(orbit).map(([key, value]) => (
              <div
                key={key}
                className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <HexagramCard
                  hexIndex={value}
                  selected={false}
                  onClick={() => handleLocalSelect(value)}
                  isNeighbor={false}
                  neighborRelation={null}
                  symmetryGroup={Yijing.yijing_symmetryName(value)}
                  filterSymmetry={[]}
                />

                {/* CAPTION – always visible */}
                <span className="text-xs capitalize text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {key} ({Yijing.yijing_relationEmojiChar(currentHex, value)})
                </span>
              </div>
            ))}
          </div>
        </details>

        {/* ---------- NEIGHBORS ---------- */}
        {localNeighbors.length > 0 && (
          <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6">
            <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Neighbors ({localNeighbors.length})</summary>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-0.75">
              {localNeighbors.map(n => (
                <div
                  key={n}
                  className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HexagramCard
                    hexIndex={n}
                    selected={false}
                    onClick={() => handleLocalSelect(n)}
                    isNeighbor={true}
                    neighborRelation={currentHex}
                    symmetryGroup={Yijing.yijing_symmetryName(n)}
                    filterSymmetry={[]}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                    {Yijing.yijing_relationEmojiChar(currentHex, n)}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* ---------- ADVANCED METRICS ---------- */}
        <details className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6">
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Advanced Metrics</summary>
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p>King Wen: {kingWenNumber}</p>
            <p>Gray Code: {grayCode} (Position: {grayPosition})</p>
            <p>Yang Lines: {lineCount} / 6</p>
            <p>Root: {root}</p>
            <p>Distance to Root: {distanceToRoot}</p>
            <p>Depth: {depth}</p>
            <p>Entropy: {entropy}</p>
            <p>Balance: {balance}</p>
          </div>
        </details>

      </div>
    </div>
  );
};

export default InspectorPanel;