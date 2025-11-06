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
    const sequence = getHexagramSequences()[currentSequence];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {sequence.values.map((i) => {
                    const isNeighbor = neighbors.includes(i);
                    const symmetryGroup = Yijing.yijing_symmetryName(i);

                    // Calculate opacity based on selection and symmetry filters
                    let opacity = 'opacity-100';

                    if (selectedHex !== null) {
                        // When a hexagram is selected, dim non-neighbors
                        if (!isNeighbor && i !== selectedHex) {
                            opacity = 'opacity-40';
                        }
                    }

                    // Apply symmetry filtering on top of neighbor dimming
                    const isFilteredBySymmetry = filterSymmetry.length > 0 && !filterSymmetry.includes(symmetryGroup);
                    if (isFilteredBySymmetry) {
                        opacity = 'opacity-20';
                    }

                    return (
                        <div
                            key={i}
                            className={`transition-opacity duration-200 ${opacity}`}
                        >
                            <HexagramCard
                                hexIndex={i}
                                selected={selectedHex === i}
                                onClick={onSelectHex}
                                isNeighbor={isNeighbor}
                                neighborRelation={selectedHex}
                                symmetryGroup={symmetryGroup}
                                filterSymmetry={filterSymmetry} // Pass filter to determine border color
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HexagramGrid;