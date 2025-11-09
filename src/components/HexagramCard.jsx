// src/components/HexagramCard.jsx

import { useMemo, useCallback } from 'react';

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import { cn, getHexagramData } from '../utils/tools.js';
import colorSystem, { getColor } from '../utils/colors.js';

import { Tooltip } from './Tooltip';

const HexagramCard = ({
  hexIndex,
  selected,
  onClick,
  isNeighbor,
  filters,
  inEditMode = false,
}) => {

  const data = useMemo(() => getHexagramData(hexIndex), [hexIndex]);

  const { borderColor /*, glowColor */ } = useMemo(() => {
    if (selected) {
      return {
        borderColor: getColor('ui', 'selected'),
        glowColor: getColor('ui', 'selected')
      };
    }

    if (filters?.filterSymmetry?.includes(data.symmetryName)) {
      const color = getColor('symmetry', data.symmetryName);
      return { borderColor: color, glowColor: color };
    }

    return {
      borderColor: getColor('ui', 'defaultBorder'),
      glowColor: getColor('ui', 'defaultBorder')
    };
  }, [selected, filters, data.symmetryName]);

  const renderLine = useCallback((position) => {
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
  }, [hexIndex]);

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
            <Tooltip title={`Symmetry: ${data.symmetryName}`} className="capitalize">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: data.symmetryColor }}
                aria-hidden="true"
              />
            </Tooltip>

            <Tooltip title={`Mantra: ${data.mantraName}`} className="capitalize">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: data.mantraColor }}
                aria-hidden="true"
              />
            </Tooltip>

            <Tooltip title={`Tao: ${data.balancedName}`} className="capitalize">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: data.balancedColor }}
                aria-hidden="true"
              />
            </Tooltip>

            {(data.foundationName && (<Tooltip title={`Foundational: ${data.foundationName}`} className="capitalize">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colorSystem.ui.foundation }}
                aria-hidden="true"
              />
            </Tooltip>))}

          </div>
        </div>

        {/* Upper trigram */}
        <div
          className="space-y-1 p-1 rounded relative"
          style={{ backgroundColor: `color-mix(in srgb, ${data.upperColor} 20%, transparent)` }}
        >
          {[0, 1, 2].map(renderLine)}
        </div>

        {/* Lower trigram */}
        <div
          className="space-y-1 p-1 rounded relative"
          style={{ backgroundColor: `color-mix(in srgb, ${data.lowerColor} 20%, transparent)` }}
        >
          {[3, 4, 5].map(renderLine)}
        </div>

        {/* Floating transition symbol */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
          <Tooltip title={data.transitionName} className="capitalize">
            <div
              className={cn(
                "pointer-events-auto w-8 h-8 rounded-full border-2 flex items-center justify-center",
                "text-lg font-bold bg-white dark:bg-gray-900 shadow-md",
                "opacity-40 hover:opacity-100 transition-opacity duration-200",
                "group"
              )}
              style={{
                borderColor: data.upperColor,
                color: data.upperColor,
              }}
            >
              {data.transitionSymbol}
            </div>
          </Tooltip>
        </div>

      </button>
    </div>
  );
};

export default HexagramCard;
