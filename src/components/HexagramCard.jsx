// src/components/HexagramCard.jsx

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import { cn } from '../globals.js';
import { SYMMETRY_COLORS, getWuxingColor } from '../globals.js';

const HexagramCard = ({
    hexIndex,
    selected,
    onClick,
    isNeighbor,
    neighborRelation,
    symmetryGroup
}) => {
    const upper = Yijing.yijing_upper(hexIndex);
    const lower = Yijing.yijing_lower(hexIndex);
    const upperWuxing = Bagua.bagua_toWuxing(upper);
    const lowerWuxing = Bagua.bagua_toWuxing(lower);
    const transitionType = Wuxing.wuxing_transitionType(lowerWuxing, upperWuxing);
    const transitionSymbol = Wuxing.wuxing_transitionSymbolChar(transitionType);

    const symmetryColor = SYMMETRY_COLORS[symmetryGroup];
    const upperColor = getWuxingColor(upperWuxing);
    const lowerColor = getWuxingColor(lowerWuxing);

    const renderLine = (position) => {
        const isYang = (hexIndex >> position) & 1;
        return (
            <div key={position} className="w-full h-3 flex justify-center gap-1"> {/* Increased h-2 to h-3 */}
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
        <button
            onClick={() => onClick(hexIndex)}
            className={cn(
                "relative p-3 rounded-lg border-2 transition-all aspect-square", // Added aspect-square and increased padding
                "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
                "hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                selected && "border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105 ring-2 ring-yellow-400",
                !selected && "border-gray-300 dark:border-gray-700",
                isNeighbor && "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
            )}
            style={{
                ...(selected && { borderColor: '#fbbf24' }),
                ...(!selected && { borderColor: symmetryColor }),
            }}
            aria-label={`Hexagram ${hexIndex}`}
        >
            {/* Hex number */}
            <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">
                {hexIndex}
            </div>

            {/* Upper trigram */}
            <div
                className="space-y-1 mb-1 p-1 rounded" // Increased space-y-0.5 to space-y-1
                style={{ backgroundColor: `color-mix(in srgb, ${upperColor} 20%, transparent)` }}
            >
                {[0, 1, 2].map(pos => renderLine(pos))}
            </div>

            {/* Transition symbol */}
            <div className="text-center text-sm my-1 text-gray-700 dark:text-gray-300">
                {transitionSymbol}
            </div>

            {/* Lower trigram */}
            <div
                className="space-y-1 mt-1 p-1 rounded" // Increased space-y-0.5 to space-y-1
                style={{ backgroundColor: `color-mix(in srgb, ${lowerColor} 20%, transparent)` }}
            >
                {[3, 4, 5].map(pos => renderLine(pos))}
            </div>

            {/* Wuxing emoji */}
            <div className="text-xs mt-1 opacity-70">
                {Wuxing.wuxing_toEmojiChar(upperWuxing)}
            </div>

            {/* Symmetry indicator */}
            <div
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: symmetryColor }}
                aria-hidden="true"
            />

            {/* Neighbor relation badge */}
            {isNeighbor && neighborRelation && (
                <div className="absolute -top-2 -right-2 text-lg" aria-hidden="true">
                    {Yijing.yijing_relationEmojiChar(hexIndex, neighborRelation)}
                </div>
            )}
        </button>
    );
};

export default HexagramCard;