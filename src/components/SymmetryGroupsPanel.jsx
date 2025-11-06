import React from 'react';

import {
    YIJING_BREATH,
    YIJING_MOTHER,
    YIJING_DIRECTION,
    YIJING_BEGINNING,
    YIJING_PRINCIPLE,
    YIJING_TITAN,
    YIJING_GIGANTE
} from '@yijingjs/core';

import { SYMMETRY_COLORS } from '../globals.js';

const SymmetryGroupsPanel = ({ groups, filterSymmetry, onFilterToggle }) => {
    const groupInfo = [
        { key: YIJING_BREATH, label: 'Breath', count: groups.breath.length },
        { key: YIJING_MOTHER, label: 'Mother', count: groups.mothers.length },
        { key: YIJING_DIRECTION, label: 'Direction', count: groups.directions.length },
        { key: YIJING_BEGINNING, label: 'Beginning', count: groups.beginning.length },
        { key: YIJING_PRINCIPLE, label: 'Principle', count: groups.principles.length },
        { key: YIJING_TITAN, label: 'Titan', count: groups.titans.length },
        { key: YIJING_GIGANTE, label: 'Gigante', count: groups.gigantes.length }
    ];

    return (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-100">Symmetry Groups</h3>
            <div className="flex flex-wrap gap-2">
                {groupInfo.map(({ key, label, count }) => {
                    const isActive = filterSymmetry.includes(key);
                    return (
                        <button
                            key={key}
                            onClick={() => onFilterToggle(key)}
                            className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                flex items-center gap-2
                ${isActive
                                    ? 'ring-2 ring-white shadow-lg scale-105'
                                    : 'hover:scale-105 opacity-60'
                                }
              `}
                            style={{
                                backgroundColor: SYMMETRY_COLORS[key],
                                color: 'white'
                            }}
                        >
                            <div
                                className={`w-3 h-3 rounded-full ${isActive ? 'bg-white' : 'bg-white/30'}`}
                            />
                            <span>{label}</span>
                            <span className="text-xs opacity-75">({count})</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SymmetryGroupsPanel;