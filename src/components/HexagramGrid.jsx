// src/components/HexagramGrid.jsx

import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';
import { getHexagramSequences } from '../globals';

const HexagramGrid = ({
    selectedHex,
    onSelectHex,
    neighbors,
    symmetryData,
    filterSymmetry,
    currentSequence
}) => {
    const sequence = getHexagramSequences()[currentSequence]; // Use the current sequence

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3"> {/* Increased gap from gap-2 to gap-3 */}
                {sequence.values.map((i) => {
                    const isNeighbor = neighbors.includes(i);
                    const symmetryGroup = Yijing.yijing_symmetryName(i);
                    const isFiltered = filterSymmetry.length > 0 && !filterSymmetry.includes(symmetryGroup);

                    return (
                        <div
                            key={i}
                            className={`transition-opacity duration-200 ${isFiltered ? 'opacity-20' : 'opacity-100'
                                }`}
                        >
                            <HexagramCard
                                hexIndex={i}
                                selected={selectedHex === i}
                                onClick={onSelectHex}
                                isNeighbor={isNeighbor}
                                neighborRelation={selectedHex}
                                symmetryGroup={symmetryGroup}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HexagramGrid;