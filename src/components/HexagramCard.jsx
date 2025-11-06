// src/components/HexagramCard.jsx
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import { BALANCED_COLORS, cn, MANTRA_COLORS } from '../globals.js';
import { SYMMETRY_COLORS, getWuxingColor } from '../globals.js';
import { Tooltip } from './Tooltip';               // <-- new import

const HexagramCard = ({
  hexIndex,
  selected,
  onClick,
  isNeighbor,
  neighborRelation,
  symmetryGroup,
  filterSymmetry,
}) => {
  const upper = Yijing.yijing_upper(hexIndex);
  const lower = Yijing.yijing_lower(hexIndex);
  const upperWuxing = Bagua.bagua_toWuxing(upper);
  const lowerWuxing = Bagua.bagua_toWuxing(lower);
  const upperColor = getWuxingColor(upperWuxing);
  const lowerColor = getWuxingColor(lowerWuxing);

  const transitionType = Wuxing.wuxing_transitionType(upperWuxing, lowerWuxing);
  const transitionSymbol = Wuxing.wuxing_transitionSymbolChar(transitionType);

  const symmetryColor = SYMMETRY_COLORS[symmetryGroup];
  const balancedColor = BALANCED_COLORS[Yijing.yijing_balancedName(hexIndex)];
  const mantraColor = MANTRA_COLORS[Yijing.yijing_mantraName(hexIndex)];

  // ---- tooltip texts ----
  const symmetryName = Yijing.yijing_symmetryName(hexIndex);
  const balancedName = Yijing.yijing_balancedName(hexIndex);
  const mantraName = Yijing.yijing_mantraName(hexIndex);

  // ---- border logic ----
  let borderColor;
  if (selected) {
    borderColor = '#fbbf24';
  } else if (filterSymmetry.includes(symmetryGroup)) {
    borderColor = symmetryColor;
  } else {
    borderColor = '#3b82f6';
  }

  const renderLine = (position) => {
    const isYang = (hexIndex >> position) & 1;
    return (
      <div key={position} className="w-full h-2 flex justify-center gap-1">
        {isYang ? (
          <div className="w-full h-full bg-white rounded-sm" />
        ) : (
          <>
            <div className="w-5/12 h-full bg-gray-400 dark:bg-gray-500 rounded-sm" />
            <div className="w-5/12 h-full bg-gray-400 dark:bg-gray-500 rounded-sm" />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => onClick(hexIndex)}
        className={cn(
          "relative rounded-lg border-2 transition-all aspect-square w-full",
          "bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
          "hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          selected && "shadow-lg shadow-yellow-400/50 scale-105 z-10",
          isNeighbor && "glow-transition hexagram-glow z-20",
          isNeighbor && "shadow-glow-lg"
        )}
        style={{
          borderColor,
          ...(isNeighbor && {
            color: borderColor,
            boxShadow: `0 0 25px ${borderColor}40`,
          }),
        }}
        aria-label={`Hexagram ${hexIndex}`}
      >
        {/* Hex number */}
        <div className="flex justify-start px-2 pt-1">
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {hexIndex}
          </div>
        </div>

        {/* Upper trigram */}
        <div
          className="space-y-1 p-1 rounded"
          style={{ backgroundColor: `color-mix(in srgb, ${upperColor} 20%, transparent)` }}
        >
          {[0, 1, 2].map(renderLine)}
        </div>

        {/* Transition symbol */}
        <div className="text-center text-sm text-gray-700 dark:text-gray-300">
          {transitionSymbol}
        </div>

        {/* Lower trigram */}
        <div
          className="space-y-1 p-1 rounded"
          style={{ backgroundColor: `color-mix(in srgb, ${lowerColor} 20%, transparent)` }}
        >
          {[3, 4, 5].map(renderLine)}
        </div>

        <div className="absolute top-1 right-1 flex flex-row space-x-1">
          <Tooltip title={`Symmetry: ${symmetryName}`} className="capitalize">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: symmetryColor }}
              aria-hidden="true"
            />
          </Tooltip>

          <Tooltip title={`Mantra: ${mantraName}`} className="capitalize">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: mantraColor }}
              aria-hidden="true"
            />
          </Tooltip>

          <Tooltip title={`Tao: ${balancedName}`} className="capitalize">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: balancedColor }}
              aria-hidden="true"
            />
          </Tooltip>
        </div>

      </button>
    </div>
  );
};

export default HexagramCard;