import React from 'react';
import * as Yijing from '@yijingjs/core';
import HexagramCard from './HexagramCard';
import { getHexagramSequences } from '../globals';

const HexagramGrid = ({
    selectedHex,
    onSelectHex,
    neighbors,
    symmetryData,
    filterSymmetry
}) => {

    const sequence = getHexagramSequences()["bagua"];

    return (
        <div className="grid grid-cols-8 gap-2 p-4">
            {sequence.values.map((i) => {
                const isNeighbor = neighbors.includes(i);
                const symmetryGroup = Yijing.yijing_symmetryName(i);
                const isFiltered = filterSymmetry.length > 0 && !filterSymmetry.includes(symmetryGroup);

                return (
                    <div
                        key={i}
                        className={isFiltered ? 'opacity-20' : 'opacity-100'}
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
    );
};

export default HexagramGrid;