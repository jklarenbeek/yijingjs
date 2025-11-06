// src/components/InspectorPanel.jsx
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';
import HexagramCard from './HexagramCard';
import { MANTRA_COLORS, SYMMETRY_COLORS, toBinary } from '../globals.js';

const InspectorPanel = ({ hexIndex, neighbors, onSelectHex }) => {
  if (hexIndex === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 shadow-sm border border-gray-200 dark:border-gray-700">
        <p>Select a hexagram to view details</p>
      </div>
    );
  }

  const upper = Yijing.yijing_upper(hexIndex);
  const lower = Yijing.yijing_lower(hexIndex);
  const upperWuxing = Bagua.bagua_toWuxing(upper);
  const lowerWuxing = Bagua.bagua_toWuxing(lower);
  const symmetry = Yijing.yijing_symmetryName(hexIndex);
  const balanced = Yijing.yijing_balancedName(hexIndex);
  const mantra = Yijing.yijing_mantraName(hexIndex);
  const lineCount = Yijing.yijing_lineCount(hexIndex);
  const binary = toBinary(hexIndex);
  const transitionType = Wuxing.wuxing_transitionType(upperWuxing, lowerWuxing);
  const orbit = Yijing.yijing_orbitClass(hexIndex);
  const centerChain = Yijing.yijing_getCenterChain(hexIndex);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* ---------- SCROLLABLE CONTENT ---------- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ---------- HEADER (sticky) ---------- */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hexagram {hexIndex}</h2>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">{binary}</p>
        </div>

        {/* ---------- BASIC INFO ---------- */}
        <section>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Mantra</h3>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MANTRA_COLORS[mantra] }} />
            <span className="capitalize font-medium">{balanced} {mantra}</span>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Symmetry</h3>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: SYMMETRY_COLORS[symmetry] }} />
            <span className="capitalize font-medium">{symmetry}</span>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Yang Lines</h3>
          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded"><p className="font-medium">{lineCount} / 6</p></div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Trigram Flow
          </h3>

          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {/* Upper Trigram */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Upper</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(upperWuxing)}</span>
                <span className="capitalize text-sm font-medium">{upperWuxing}</span>
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
                <span className="capitalize text-sm font-medium">{lowerWuxing}</span>
                <span className="text-xs text-gray-500 ml-1">({lower})</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- TRANSFORMATIONS ---------- */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Transformations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0.75">
            {Object.entries(orbit).map(([key, value]) => (
              <div
                key={key}
                className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <HexagramCard
                  hexIndex={value}
                  selected={false}
                  onClick={() => onSelectHex(value)}
                  isNeighbor={false}
                  symmetryGroup={Yijing.yijing_symmetryName(value)}
                  filterSymmetry={[]}
                />

                {/* CAPTION – always visible */}
                <span className="text-xs capitalize text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {key} ({Yijing.yijing_relationEmojiChar(hexIndex, value)})
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- PATH TO ROOT ---------- */}
        {centerChain.length > 1 && (
          <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Path to Root ({centerChain.length - 1} steps)</h3>
            <div className="grid grid-cols-3 gap-0.75">
              {centerChain.map((h, idx) => (
                <div
                  key={h}
                  className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HexagramCard
                    hexIndex={h}
                    selected={h === hexIndex}
                    onClick={() => onSelectHex(h)}
                    isNeighbor={idx > 0}
                    neighborRelation={idx > 0 ? centerChain[idx - 1] : null}
                    symmetryGroup={Yijing.yijing_symmetryName(h)}
                    filterSymmetry={[]}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                    {idx === centerChain.length - 1 ? 'Cosmic' : (idx === centerChain.length - 2 ? 'Karmic' : 'Atomic')}&nbsp;
                    ({Yijing.yijing_relationEmojiChar(hexIndex, h)})
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- NEIGHBORS ---------- */}
        {neighbors.length > 0 && (
          <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Neighbors ({neighbors.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-0.75">
              {neighbors.map(n => (
                <div
                  key={n}
                  onClick={() => onSelectHex(n)}
                  className="group flex flex-col items-center p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HexagramCard
                    hexIndex={n}
                    selected={false}
                    onClick={() => onSelectHex(n)}
                    isNeighbor={true}
                    neighborRelation={hexIndex}
                    symmetryGroup={Yijing.yijing_symmetryName(n)}
                    filterSymmetry={[]}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                    {Yijing.yijing_relationEmojiChar(hexIndex, n)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InspectorPanel;