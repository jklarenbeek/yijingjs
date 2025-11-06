import React from 'react';
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import { SYMMETRY_COLORS, toBinary } from '../globals.js';

const InspectorPanel = ({ hexIndex, neighbors }) => {
    if (hexIndex === null) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
                <p>Select a hexagram to view details</p>
            </div>
        );
    }

    const upper = Yijing.yijing_upper(hexIndex);
    const lower = Yijing.yijing_lower(hexIndex);
    const upperWuxing = Bagua.bagua_toWuxing(upper);
    const lowerWuxing = Bagua.bagua_toWuxing(lower);
    const symmetry = Yijing.yijing_symmetryName(hexIndex);
    const lineCount = Yijing.yijing_lineCount(hexIndex);
    const binary = toBinary(hexIndex);
    const transitionType = Wuxing.wuxing_transitionType(lowerWuxing, upperWuxing);

    return (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-gray-100">Hexagram {hexIndex}</h2>
                <p className="text-sm text-gray-400 font-mono">{binary}</p>
            </div>

            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Symmetry</h3>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: SYMMETRY_COLORS[symmetry] }}
                        />
                        <span className="text-gray-100 capitalize">{symmetry}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Yang Lines</h3>
                    <p className="text-gray-100">{lineCount} / 6</p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Trigrams</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-700 rounded p-2">
                            <span className="text-sm text-gray-300">Upper ({upper})</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(upperWuxing)}</span>
                                <span className="text-sm capitalize text-gray-300">{upperWuxing}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-700 rounded p-2">
                            <span className="text-sm text-gray-300">Lower ({lower})</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(lowerWuxing)}</span>
                                <span className="text-sm capitalize text-gray-300">{lowerWuxing}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Transition</h3>
                    <div className="flex items-center gap-2 bg-gray-700 rounded p-2">
                        <span className="text-lg">{Wuxing.wuxing_transitionSymbolChar(transitionType)}</span>
                        <span className="text-sm capitalize text-gray-300">{transitionType}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Neighbors ({neighbors.length})</h3>
                <div className="grid grid-cols-3 gap-2">
                    {neighbors.map(n => {
                        const relation = Yijing.yijing_relation(hexIndex, n);
                        const emoji = Yijing.yijing_relationEmojiChar(hexIndex, n);
                        return (
                            <div
                                key={n}
                                className="bg-gray-700 rounded p-2 text-center hover:bg-gray-600 cursor-pointer transition-colors"
                            >
                                <div className="text-lg">{emoji}</div>
                                <div className="text-xs text-gray-300">{n}</div>
                                <div className="text-xs text-gray-500">{relation}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InspectorPanel;