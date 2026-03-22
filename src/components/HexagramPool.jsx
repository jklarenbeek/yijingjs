// src/components/HexagramPool.jsx

import * as Yijing from '@yijingjs/core';
import { useDraggable } from '@dnd-kit/core';
import HexagramCard from './HexagramCard';

const PoolItem = ({ 
  hexIndex, selected, onSelectHex, filters, showSixiangs, showKingWenNumbers 
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool-${hexIndex}`,
    data: { type: 'pool', hexIndex }
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : ''}`}
      style={{ touchAction: 'none' }}
      onClick={() => {
        if (!isDragging) onSelectHex(hexIndex);
      }}
    >
      <HexagramCard
        hexIndex={hexIndex}
        selectedHex={selected ? hexIndex : null}
        onClick={() => {}}
        isNeighbor={false}
        filters={filters}
        inEditMode
        showSixiangs={showSixiangs}
        showKingWenNumbers={showKingWenNumbers}
      />
    </div>
  );
};

/**
 * Hexagram pool component for edit mode
 */
const HexagramPool = ({
  placedHexagrams = [],
  onSelectHex,
  filters,
  showSixiangs = false,
  showKingWenNumbers = false
}) => {

  const available = Array.from({ length: 64 }, (_, i) => i).filter(
    (i) => !placedHexagrams.includes(i) && !filters.isFiltered(i)
  );

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
        <PoolItem
          key={hexIndex}
          hexIndex={hexIndex}
          selected={false}
          onSelectHex={onSelectHex}
          filters={filters}
          showSixiangs={showSixiangs}
          showKingWenNumbers={showKingWenNumbers}
        />
      ))}
    </div>
  );
};

export default HexagramPool;
