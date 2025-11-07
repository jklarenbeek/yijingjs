// src/components/HexagramGrid.jsx

import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';
import { getHexagramSequences } from '../globals.js';

const HexagramGrid = ({
  selectedHex,
  onSelectHex,
  neighbors,
  filterSymmetry,
  filterMantra,
  filterBalance,
  currentSequence,
  customSequences = []
}) => {
  const baseSequences = { ...getHexagramSequences(), ...customSequences };
  let sequence = baseSequences[currentSequence];

  const values = sequence.values.filter(v => v !== null && v !== undefined);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {values.map((i) => {
          const isNeighbor = neighbors.includes(i);
          const symmetryGroup = Yijing.yijing_symmetryName(i);

          let opacity = 'opacity-100';
          if (selectedHex !== null) {
            if (!isNeighbor && i !== selectedHex) {
              opacity = 'opacity-40';
            }
          }
          const isFilteredBySymmetry = filterSymmetry.length > 0 && !filterSymmetry.includes(symmetryGroup);
          const isFilteredByMantra = filterMantra.length > 0 && !filterMantra.includes(Yijing.yijing_mantraName(i));
          const isFilteredByBalance = filterBalance.length > 0 && !filterBalance.includes(Yijing.yijing_balancedName(i));
          if (isFilteredBySymmetry || isFilteredByMantra || isFilteredByBalance) {
            opacity = 'opacity-20';
          }

          return (
            <div
              key={i}
              className={`transition-opacity duration-200 ${opacity}`}
            >
              <HexagramCard
                hexIndex={i}
                selected={selectedHex === i}
                onClick={onSelectHex}
                isNeighbor={isNeighbor}
                neighborRelation={selectedHex}
                symmetryGroup={symmetryGroup}
                filterSymmetry={filterSymmetry}
              />
            </div>
          );
        })}
        {values.length < 64 && (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-sm py-4">
            Incomplete sequence ({values.length}/64 hexagrams)
          </div>
        )}
      </div>
    </div>
  );
};

export default HexagramGrid;