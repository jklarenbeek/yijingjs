// src/components/HexagramPool.jsx

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';
import HexagramCard from './HexagramCard';

/**
 * Hexagram pool component for edit mode
 */
const HexagramPool = ({
  placedHexagrams = [],
  onSelectHex,
  filterSymmetry = [],
  filterMantra = [],
  filterBalance = [],
  filterUpperTrigram = [],
  filterLowerTrigram = [],
  filterTransition = [],
  filterAmino = [],
  filterBottomSixiang = [],
  filterMiddleSixiang = [],
  filterTopSixiang = []
}) => {
  const available = Array.from({ length: 64 }, (_, i) => i).filter(
    (i) =>
      !placedHexagrams.includes(i) &&
      (filterSymmetry.length === 0 || filterSymmetry.includes(Yijing.yijing_symmetryName(i))) &&
      (filterMantra.length === 0 || filterMantra.includes(Yijing.yijing_mantraName(i))) &&
      (filterBalance.length === 0 || filterBalance.includes(Yijing.yijing_taoName(i))) &&
      (filterUpperTrigram.length === 0 || filterUpperTrigram.includes(Bagua.bagua_toName(Yijing.yijing_upper(i)))) &&
      (filterLowerTrigram.length === 0 || filterLowerTrigram.includes(Bagua.bagua_toName(Yijing.yijing_lower(i)))) &&
      (filterTransition.length === 0 || filterTransition.includes(
        Wuxing.wuxing_transitionType(
          Bagua.bagua_toWuxing(Yijing.yijing_upper(i)),
          Bagua.bagua_toWuxing(Yijing.yijing_lower(i))
        )
      )) &&
      (filterAmino.length === 0 || filterAmino.includes(Yijing.yijing_toAminoAcidName(i))) &&
      (filterBottomSixiang.length === 0 || filterBottomSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_red(i)))) &&
      (filterMiddleSixiang.length === 0 || filterMiddleSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_white(i)))) &&
      (filterTopSixiang.length === 0 || filterTopSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_blue(i))))
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
            onClick={() => {}}
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
