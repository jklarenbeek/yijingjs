import React from 'react';
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import * as Globals from '../globals.js';

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

    const symmetryColor = Globals.SYMMETRY_COLORS[symmetryGroup];
    const upperColor = Globals.getWuxingColor(upperWuxing);
    const lowerColor = Globals.getWuxingColor(lowerWuxing);

    const renderLine = (position) => {
        const isYang = (hexIndex >> position) & 1;
        return (
            <div key={position} className="w-full h-2 flex justify-center gap-1 min-h-2">
                {isYang ? (
                    <div className="w-full h-full bg-white rounded-sm min-h-2" />
                ) : (
                    <>
                        <div className="w-5/12 h-full bg-gray-400 rounded-sm min-h-2" />
                        <div className="w-5/12 h-full bg-gray-400 rounded-sm min-h-2" />
                    </>
                )}
            </div>
        );
    };

    return (
        <button
            onClick={() => onClick(hexIndex)}
            className={`
        relative p-2 rounded-lg border-2 transition-all
        ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105' : 'border-gray-700'}
        ${isNeighbor ? 'ring-2 ring-offset-2 ring-offset-gray-900' : ''}
        hover:scale-105 hover:shadow-md
        bg-gradient-to-br from-gray-800 to-gray-900
      `}
            style={{
                borderColor: selected ? '#fbbf24' : symmetryColor,
            }}
        >
            {/* Hex number */}
            <div className="text-xs font-mono text-gray-400 mb-1">
                {hexIndex}
            </div>

            {/* Upper trigram */}
            <div className="space-y-0.5 mb-1" style={{ backgroundColor: `color-mix(in srgb, ${upperColor} 30%, #1f2937)` }}>
                {[0, 1, 2].map(pos => renderLine(pos))}
            </div>

            {/* Transition symbol */}
            <div className="text-center text-sm my-1">
                {transitionSymbol}
            </div>

            {/* Lower trigram */}
            <div className="space-y-0.5 mt-1" style={{ backgroundColor: `color-mix(in srgb, ${lowerColor} 30%, #1f2937)` }}>
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
            />

            {/* Neighbor relation badge */}
            {isNeighbor && neighborRelation && (
                <div className="absolute -top-2 -right-2 text-lg">
                    {Yijing.yijing_relationEmojiChar(hexIndex, neighborRelation)}
                </div>
            )}
        </button>
    );
};

export default HexagramCard;