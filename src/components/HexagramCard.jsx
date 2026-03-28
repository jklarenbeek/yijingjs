// src/components/HexagramCard.jsx

import { useState, useMemo, useCallback, forwardRef } from 'react';
import { cn, getHexagramData, getSixiangData } from '../utils/tools.js';
import colorSystem, { getColor } from '../utils/colors.js';
import { Tooltip } from './Tooltip';

const HexagramCard = forwardRef(({
  hexIndex,
  selectedHex,
  onClick,
  isNeighbor,
  filters,
  inEditMode = false,
  showSixiangs = false,
  showKingWenNumbers = false,
  movingLinesMask = 0,
}, ref) => {
  // Add hover state for trigrams/sixiangs
  const [hoveredSection, setHoveredSection] = useState(null);

  const selected = useMemo(() => selectedHex === hexIndex, [selectedHex, hexIndex]);

  // Get hexagram data
  const data = useMemo(() => getHexagramData(hexIndex), [hexIndex]);

  // Get sixiang data
  const sixiangs = useMemo(() => getSixiangData(hexIndex), [hexIndex]);

  const { borderColor, opacity } = useMemo(() => {

    function getOpacity() {
      if (Number.isInteger(selectedHex) && !isNeighbor && !selected) {
        return 'opacity-20';
      }
      if (filters != null && filters.isFiltered(hexIndex)) {
        return 'opacity-30';
      }
      return 'opacity-100';
    }

    if (selected) {
      return { borderColor: getColor('ui', 'selected'), opacity: getOpacity() };
    }
    if (filters) {
      if (filters.filterBalance?.includes(data.balancedName))
        return { borderColor: data.symmetryColor, opacity: getOpacity() };
      else if (filters.filterMantra?.includes(data.mantraName))
        return { borderColor: data.mantraColor, opacity: getOpacity() };
      else if (filters.filterSymmetry?.includes(data.symmetryName))
        return { borderColor: data.symmetryColor, opacity: getOpacity() };
      else if (filters.filterTransition?.includes(data.transitionName))
        return { borderColor: data.transitionColor, opacity: getOpacity() };
    }

    return { borderColor: getColor('ui', 'defaultBorder'), opacity: getOpacity() };
  }, [hexIndex, selectedHex, isNeighbor, selected, filters, data]);

  const { stripBackground, propertiesTooltip } = useMemo(() => {
    const colors = [data.symmetryColor, data.mantraColor, data.balancedColor];
    const parts = [
      `Symmetry: ${data.symmetryName}`,
      `Mantra: ${data.mantraName}`,
      `Tao: ${data.balancedName}`
    ];

    if (data.foundationName) {
      colors.push(colorSystem.ui.foundation);
      parts.push(`Foundational: ${data.foundationName}`);
    }

    const background = colors.length === 3
      ? `linear-gradient(to right, ${colors[0]} 0% 33.33%, ${colors[1]} 33.33% 66.66%, ${colors[2]} 66.66% 100%)`
      : `linear-gradient(to right, ${colors[0]} 0% 25%, ${colors[1]} 25% 50%, ${colors[2]} 50% 75%, ${colors[3]} 75% 100%)`;

    return {
      stripBackground: background,
      propertiesTooltip: parts.join(' • ')
    };
  }, [data]);

  const renderTrigramLine = useCallback((position) => {
    const isYang = (hexIndex >> position) & 1;
    const isMoving = (movingLinesMask >> position) & 1;

    return (
      <div key={position} className="w-full h-2 flex justify-center gap-0">
        {isYang ? (
          <div className={cn(
            "w-full h-full rounded-sm transition-all duration-200",
            isMoving ? "bg-[var(--red-chi-light)] shadow-[0_0_8px_rgba(231,76,60,0.6)] animate-blink" : "bg-white"
          )} />
        ) : (
          <>
            <div className={cn(
              "w-[42%] h-full rounded-sm transition-all duration-200",
              isMoving ? "bg-[var(--jade-glow)] animate-blink" : "bg-gray-400 dark:bg-gray-500"
            )} />
            <div className={cn(
              "w-[42%] h-full rounded-sm transition-all duration-200 ml-auto",
              isMoving ? "bg-[var(--jade-glow)] animate-blink" : "bg-gray-400 dark:bg-gray-500"
            )} />
          </>
        )}
      </div>
    );
  }, [hexIndex, movingLinesMask]);

  const renderSixiangLines = useCallback((sixiangValue, sixiangIndex) => {
    return [1, 0].map(linePos => {
      const isYang = (sixiangValue >> (1 - linePos)) & 1;
      const globalLinePosition = sixiangIndex * 2 + (1 - linePos);
      const isMoving = (movingLinesMask >> globalLinePosition) & 1;

      return (
        <div key={`${sixiangIndex}-${offset}`} className="w-full h-2 flex justify-center gap-0">
          {isYang ? (
            <div className={cn(
              "w-full h-full rounded-sm transition-all duration-200",
              isMoving ? "bg-[var(--red-chi-light)] shadow-[0_0_8px_rgba(231,76,60,0.6)] animate-blink" : "bg-white"
            )} />
          ) : (
            <>
              <div className={cn(
                "w-[42%] h-full rounded-sm transition-all duration-200",
                isMoving ? "bg-[var(--jade-glow)] animate-blink" : "bg-gray-400 dark:bg-gray-500"
              )} />
              <div className={cn(
                "w-[42%] h-full rounded-sm transition-all duration-200 ml-auto",
                isMoving ? "bg-[var(--jade-glow)] animate-blink" : "bg-gray-400 dark:bg-gray-500"
              )} />
            </>
          )}
        </div>
      );
    });
  }, [movingLinesMask]);

  return (
    <button
      ref={ref}
      onClick={() => onClick(hexIndex)}
      className={cn(
        `transition-opacity duration-200 ${opacity}`,
        "relative rounded-lg border-2 transition-all w-full",
        "bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
        "hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isNeighbor && "glow-transition hexagram-glow z-20",
        isNeighbor && "shadow-glow-lg",
        inEditMode && "cursor-move"
      )}
      style={{
        borderColor: selected ? borderColor : 'var(--gold-dark)',
        ...(isNeighbor && {
          boxShadow: `0 0 25px ${borderColor}40`,
        }),
      }}
      aria-label={`Hexagram ${hexIndex}`}
    >
      {/* Properties Strip */}
      <div className="w-full">
        <Tooltip title={propertiesTooltip} className="capitalize" block={true}>
          <div
            className="w-full h-1.5 opacity-80 rounded-t-[6px]"
            style={{ background: stripBackground }}
            aria-hidden="true"
          />
        </Tooltip>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mt-0.5 px-2">
        <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
          {showKingWenNumbers ? data.kingWenNumber : hexIndex}
        </div>
        <Tooltip title={data.transitionName} className="capitalize">
          <div className="text-xs font-bold" style={{ color: data.transitionColor }}>
            {data.transitionSymbol}
          </div>
        </Tooltip>
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
                  "space-y-1 px-1 py-0.75 rounded relative w-full transition-all duration-200",
                  "transform origin-center",
                  hoveredSection === `sixiang-${index}` && "scale-105 bg-opacity-40"
                )}
                style={{
                  backgroundColor: `color-mix(in srgb, ${sixiang.color} ${hoveredSection === `sixiang-${index}` ? '30%' : '15%'
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
          <Tooltip title={data.upperName} className="capitalize" block={true} followMouse={true}>
            <div
              className={cn(
                "space-y-1 p-1 rounded relative w-full transition-all duration-200",
                "transform origin-center",
                hoveredSection === 'upper' && "scale-105 bg-opacity-40"
              )}
              style={{
                backgroundColor: `color-mix(in srgb, ${data.upperColor} ${hoveredSection === 'upper' ? '30%' : '15%'
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
          <Tooltip title={data.lowerName} className="capitalize" block={true} followMouse={true}>
            <div
              className={cn(
                "space-y-1 p-1 rounded relative w-full transition-all duration-200",
                "transform origin-center",
                hoveredSection === 'lower' && "scale-105 bg-opacity-40"
              )}
              style={{
                backgroundColor: `color-mix(in srgb, ${data.lowerColor} ${hoveredSection === 'lower' ? '30%' : '15%'
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


        </>
      )}
    </button>
  );
});

HexagramCard.displayName = 'HexagramCard';

export default HexagramCard;
