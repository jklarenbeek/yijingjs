// src/components/HexagramCard.jsx

import { useState, useMemo, useCallback } from 'react';
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
  showSixiangs = false,
  showKingWenNumbers = false,
}) => {
  // Add hover state for trigrams/sixiangs
  const [hoveredSection, setHoveredSection] = useState(null);

  const data = useMemo(() => getHexagramData(hexIndex), [hexIndex]);

  // Get sixiang data
  const sixiangs = useMemo(() => {
    const red = Yijing.yijing_red(hexIndex);      // Top two lines (bits 0-1)
    const white = Yijing.yijing_white(hexIndex);  // Middle two lines (bits 2-3)
    const blue = Yijing.yijing_blue(hexIndex);    // Bottom two lines (bits 4-5)

    return [
      {
        value: red,
        name: Wuxing.sixiang_toName(red),
        symbol: Wuxing.sixiang_toSymbolChar(red),
        color: getColor('sixiang', Wuxing.sixiang_toName(red))
      },
      {
        value: white,
        name: Wuxing.sixiang_toName(white),
        symbol: Wuxing.sixiang_toSymbolChar(white),
        color: getColor('sixiang', Wuxing.sixiang_toName(white))
      },
      {
        value: blue,
        name: Wuxing.sixiang_toName(blue),
        symbol: Wuxing.sixiang_toSymbolChar(blue),
        color: getColor('sixiang', Wuxing.sixiang_toName(blue))
      }
    ];
  }, [hexIndex]);

  const { borderColor } = useMemo(() => {
    if (selected) {
      return { borderColor: getColor('ui', 'selected') };
    }
    if (filters?.filterSymmetry?.includes(data.symmetryName)) {
      return { borderColor: getColor('symmetry', data.symmetryName) };
    }
    return { borderColor: getColor('ui', 'defaultBorder') };
  }, [selected, filters, data.symmetryName]);

  const renderTrigramLine = useCallback((position) => {
    const isYang = (hexIndex >> position) & 1;
    return (
      <div key={position} className="w-full h-2 flex justify-center gap-1">
        {isYang ? (
          <div className="w-full h-full bg-white rounded-sm transition-all duration-200" />
        ) : (
          <>
            <div className="w-5/12 h-full bg-gray-400 dark:bg-gray-500 rounded-sm transition-all duration-200" />
            <div className="w-5/12 h-full bg-gray-400 dark:bg-gray-500 rounded-sm transition-all duration-200" />
          </>
        )}
      </div>
    );
  }, [hexIndex]);

  const renderSixiangLines = useCallback((sixiangValue, sixiangIndex) => {
    return [0, 1].map(linePos => {
      const isYang = (sixiangValue >> (1 - linePos)) & 1;
      return (
        <div key={`${sixiangIndex}-${linePos}`} className="w-full h-2 flex justify-center gap-1">
          {isYang ? (
            <div className="w-full h-full bg-white rounded-sm transition-all duration-200" />
          ) : (
            <>
              <div className="w-5/12 h-full bg-gray-400 dark:bg-gray-500 rounded-sm transition-all duration-200" />
              <div className="w-5/12 h-full bg-gray-400 dark:bg-gray-500 rounded-sm transition-all duration-200" />
            </>
          )}
        </div>
      );
    });
  }, []);

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
          {/* Number display */}
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {showKingWenNumbers ? data.kingWenNumber : hexIndex}
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

        {/* Content - either trigrams or sixiangs with hover effects */}
        {showSixiangs ? (
          // Sixiangs view with hover effects
          <>
            {sixiangs.map((sixiang, index) => (
              <Tooltip
                key={index}
                title={sixiang.name}
                className="capitalize"
                block={true}
                followMouse={true}
              >
                <div
                  className={cn(
                    "space-y-1 p-1 rounded relative w-full transition-all duration-200",
                    "transform origin-center",
                    hoveredSection === `sixiang-${index}` && "scale-105 bg-opacity-40"
                  )}
                  style={{
                    backgroundColor: `color-mix(in srgb, ${sixiang.color} ${hoveredSection === `sixiang-${index}` ? '30%' : '20%'
                      }, transparent)`,
                    boxShadow: hoveredSection === `sixiang-${index}`
                      ? `0 0 12px ${sixiang.color}60`
                      : 'none'
                  }}
                  onMouseEnter={() => setHoveredSection(`sixiang-${index}`)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {renderSixiangLines(sixiang.value, index)}
                </div>
              </Tooltip>
            ))}
          </>
        ) : (
          // Trigrams view with hover effects
          <>
            {/* Upper trigram with hover effect */}
            <Tooltip title={Bagua.bagua_toName(data.upperTrigramIndex)} className="capitalize" block={true} followMouse={true}>
              <div
                className={cn(
                  "space-y-1 p-1 rounded relative w-full transition-all duration-200",
                  "transform origin-center",
                  hoveredSection === 'upper' && "scale-105 bg-opacity-40"
                )}
                style={{
                  backgroundColor: `color-mix(in srgb, ${data.upperColor} ${hoveredSection === 'upper' ? '30%' : '20%'
                    }, transparent)`,
                  boxShadow: hoveredSection === 'upper'
                    ? `0 0 12px ${data.upperColor}60`
                    : 'none'
                }}
                onMouseEnter={() => setHoveredSection('upper')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {[0, 1, 2].map(renderTrigramLine)}
              </div>
            </Tooltip>

            {/* Lower trigram with hover effect */}
            <Tooltip title={Bagua.bagua_toName(data.lowerTrigramIndex)} className="capitalize" block={true} followMouse={true}>
              <div
                className={cn(
                  "space-y-1 p-1 rounded relative w-full transition-all duration-200",
                  "transform origin-center",
                  hoveredSection === 'lower' && "scale-105 bg-opacity-40"
                )}
                style={{
                  backgroundColor: `color-mix(in srgb, ${data.lowerColor} ${hoveredSection === 'lower' ? '30%' : '20%'
                    }, transparent)`,
                  boxShadow: hoveredSection === 'lower'
                    ? `0 0 12px ${data.lowerColor}60`
                    : 'none'
                }}
                onMouseEnter={() => setHoveredSection('lower')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {[3, 4, 5].map(renderTrigramLine)}
              </div>
            </Tooltip>

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
          </>
        )}
      </button>
    </div>
  );
};

export default HexagramCard;
