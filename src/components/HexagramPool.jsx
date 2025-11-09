// src/components/HexagramPool.jsx

import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';

/**
 * Hexagram pool component for edit mode
 */
const HexagramPool = ({
  placedHexagrams = [],
  onSelectHex,
  filters,
}) => {
  const { filterSymmetry, isFiltered } = filters;

  const available = Array.from({ length: 64 }, (_, i) => i).filter(
    (i) =>
      !placedHexagrams.includes(i) && !isFiltered(i)
  );

  const handleDragStart = (e, hexIndex) => {
    e.dataTransfer.setData('text/plain', `pool:${hexIndex}`);
  };

  if (available.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        No hexagrams match current filters
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {available.map((hexIndex) => (
        <div
          key={hexIndex}
          draggable
          onDragStart={(e) => handleDragStart(e, hexIndex)}
          onClick={() => onSelectHex(hexIndex)}
          className="cursor-grab active:cursor-grabbing"
        >
          <HexagramCard
            hexIndex={hexIndex}
            selected={false}
            onClick={() => { }}
            isNeighbor={false}
            symmetryGroup={Yijing.yijing_symmetryName(hexIndex)}
            filterSymmetry={filterSymmetry}
            inEditMode
          />
        </div>
      ))}
    </div>
  );
};

export default HexagramPool;
