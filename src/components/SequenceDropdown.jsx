// src/components/SequenceDropdown.jsx

import { getHexagramSequences } from '../globals';

const SequenceDropdown = ({ currentSequence, onSequenceChange }) => {
    const sequences = getHexagramSequences();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Sequence
            </h3>
            <select
                value={currentSequence}
                onChange={(e) => onSequenceChange(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {Object.entries(sequences).map(([key, seq]) => (
                    <option key={key} value={key}>
                        {seq.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SequenceDropdown;