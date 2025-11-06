import React from 'react';
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import { SYMMETRY_COLORS, toBinary } from '../globals.js';

const InspectorPanel = ({ hexIndex, neighbors }) => {
    if (hexIndex === null) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors sticky top-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Hexagram {hexIndex}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                    {binary}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Symmetry
                    </h3>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: SYMMETRY_COLORS[symmetry] }}
                        />
                        <span className="text-gray-900 dark:text-gray-100 capitalize font-medium">
                            {symmetry}
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Yang Lines
                    </h3>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {lineCount} / 6
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Trigrams
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-3 transition-colors">
                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                Upper ({upper})
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(upperWuxing)}</span>
                                <span className="text-sm capitalize text-gray-900 dark:text-gray-100">
                                    {upperWuxing}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-3 transition-colors">
                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                Lower ({lower})
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{Wuxing.wuxing_toEmojiChar(lowerWuxing)}</span>
                                <span className="text-sm capitalize text-gray-900 dark:text-gray-100">
                                    {lowerWuxing}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Transition
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded p-3 transition-colors">
                        <span className="text-lg">{Wuxing.wuxing_transitionSymbolChar(transitionType)}</span>
                        <span className="text-sm capitalize text-gray-900 dark:text-gray-100 font-medium">
                            {transitionType}
                        </span>
                    </div>
                </div>
            </div>

            {neighbors.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        Neighbors ({neighbors.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {neighbors.map(n => {
                            const relation = Yijing.yijing_relation(hexIndex, n);
                            const emoji = Yijing.yijing_relationEmojiChar(hexIndex, n);
                            return (
                                <div
                                    key={n}
                                    className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-center hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                >
                                    <div className="text-lg mb-1">{emoji}</div>
                                    <div className="text-xs text-gray-900 dark:text-gray-100 font-medium">
                                        {n}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {relation}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectorPanel;