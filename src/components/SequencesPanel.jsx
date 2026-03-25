// src/components/SequencesPanel.jsx

import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { getSequencePairs, categorizeSequencePairs } from '../utils/tools.js';
import HexagramCard from './HexagramCard';

const PairRow = ({ pair, index, delay, showKingWenNumbers, selectedHex, handleSelectHex }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: delay * 0.05 }}
    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
  >
    <div className="text-gray-400 dark:text-gray-500 font-mono text-sm w-8 text-center">
      #{index + 1}
    </div>
    <div className="flex gap-2 w-24 h-24">
      <HexagramCard hexIndex={pair.hexA} showKingWenNumbers={showKingWenNumbers} selectedHex={selectedHex} onClick={handleSelectHex} />
      <HexagramCard hexIndex={pair.hexB} showKingWenNumbers={showKingWenNumbers} selectedHex={selectedHex} onClick={handleSelectHex} />
    </div>
    <div className="flex flex-col ml-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{pair.label}</h4>
      <p className="text-xs text-gray-500">
        Score: {pair.score}
      </p>
    </div>
  </motion.div>
);

const SequencesPanel = ({ showKingWenNumbers, selectedHex, handleSelectHex }) => {

  const pairsData = useMemo(() => {
    const rawPairs = getSequencePairs(showKingWenNumbers);
    return categorizeSequencePairs(rawPairs);
  }, [showKingWenNumbers]);

  return (
    <div className="max-w-screen-2xl mx-auto p-4 md:p-8 w-full h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {showKingWenNumbers ? 'King Wen Sequences' : 'Binary Sequences'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
            Mapping the 64 hexagrams into 32 pairs, categorized into 10 Balanced Pairs (Emanations) and 22 Unbalanced Pairs (Paths).
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={showKingWenNumbers ? 'kingwen' : 'binary'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* 10 Balanced Pairs */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">10 Balanced Pairs</h3>
                <p className="text-sm text-gray-500">The 10 Emanations (Sefirot)</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-bold">
                20 Hexagrams
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {pairsData.balanced.map((pair, idx) => (
                <PairRow key={pair.id} pair={pair} index={idx} delay={idx} showKingWenNumbers={showKingWenNumbers} selectedHex={selectedHex} handleSelectHex={handleSelectHex} />
              ))}
            </div>
          </div>

          {/* 22 Unbalanced Pairs */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">22 Unbalanced Pairs</h3>
                <p className="text-sm text-gray-500">The 22 Paths of Wisdom</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-bold">
                44 Hexagrams
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {pairsData.unbalanced.map((pair, idx) => (
                <PairRow key={pair.id} pair={pair} index={idx} delay={idx} showKingWenNumbers={showKingWenNumbers} selectedHex={selectedHex} handleSelectHex={handleSelectHex} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SequencesPanel;
