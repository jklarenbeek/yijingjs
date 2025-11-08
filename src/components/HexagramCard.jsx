// src/components/HexagramCard.jsx
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import { BALANCED_COLORS, cn, MANTRA_COLORS, SYMMETRY_COLORS, getWuxingColor } from '../globals.js';
import { Tooltip } from './Tooltip';

const HexagramCard = ({
  hexIndex,
  selected,
  onClick,
  isNeighbor,
  neighborRelation,
  symmetryGroup,
  filterSymmetry,
  inEditMode = false,
}) => {
  const upper = Yijing.yijing_upper(hexIndex);
  const lower = Yijing.yijing_lower(hexIndex);
  const upperWuxing = Bagua.bagua_toWuxing(upper);
  const lowerWuxing = Bagua.bagua_toWuxing(lower);
  const upperColor = getWuxingColor(upperWuxing);
  const lowerColor = getWuxingColor(lowerWuxing);

  const transitionType = Wuxing.wuxing_transitionType(upperWuxing, lowerWuxing);
  const transitionSymbol = Wuxing.wuxing_transitionSymbolChar(transitionType);
  const transitionName = transitionType.charAt(0).toUpperCase() + transitionType.slice(1);

  const symmetryColor = SYMMETRY_COLORS[symmetryGroup];
  const balancedColor = BALANCED_COLORS[Yijing.yijing_balancedName(hexIndex)];
  const mantraColor = MANTRA_COLORS[Yijing.yijing_mantraName(hexIndex)];

  // ---- tooltip texts ----
  const symmetryName = Yijing.yijing_symmetryName(hexIndex);
  const balancedName = Yijing.yijing_balancedName(hexIndex);
  const mantraName = Yijing.yijing_mantraName(hexIndex);
  const foundation = Yijing.yijing_isFoundation(hexIndex)
    ? "Foundational"
    : null;

  // ---- border logic (unchanged) ----
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
          "relative rounded-lg border-2 transition-all w-full",
          "bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
          "hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          selected && "shadow-lg shadow-yellow-400/50 scale-105 z-10",
          isNeighbor && "glow-transition hexagram-glow z-20",
          isNeighbor && "shadow-glow-lg",
          inEditMode && "cursor-move"
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
        {/* Header row */}
        <div className="flex items-center justify-between ml-1 mr-1">
          {/* Hex number */}
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {hexIndex}
          </div>

          {/* Dots with tooltips */}
          <div className="flex items-center gap-1">
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

            {(foundation && (<Tooltip title={`${foundation}: ${Bagua.bagua_toName(upper)}`} className="capitalize">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#FFFF00' }}
                aria-hidden="true"
              />
            </Tooltip>))}

          </div>
        </div>

        {/* Upper trigram */}
        <div
          className="space-y-1 p-1 rounded relative"
          style={{ backgroundColor: `color-mix(in srgb, ${upperColor} 20%, transparent)` }}
        >
          {[0, 1, 2].map(renderLine)}
        </div>

        {/* Lower trigram */}
        <div
          className="space-y-1 p-1 rounded relative"
          style={{ backgroundColor: `color-mix(in srgb, ${lowerColor} 20%, transparent)` }}
        >
          {[3, 4, 5].map(renderLine)}
        </div>

        {/* Floating transition symbol */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
          <Tooltip title={transitionName} className="capitalize">
            <div
              className={cn(
                "pointer-events-auto w-8 h-8 rounded-full border-2 flex items-center justify-center",
                "text-lg font-bold bg-white dark:bg-gray-900 shadow-md",
                "opacity-40 hover:opacity-100 transition-opacity duration-200",
                "group"
              )}
              style={{
                borderColor: upperColor,
                color: upperColor,
              }}
            >
              {transitionSymbol}
            </div>
          </Tooltip>
        </div>

      </button>
    </div>
  );
};

export default HexagramCard;