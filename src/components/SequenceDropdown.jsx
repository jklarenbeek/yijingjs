// src/components/SequenceDropdown.jsx

import { getHexagramSequences } from '../utils/tools.js';

const SequenceDropdown = ({ currentSequence, onSequenceChange, customSequences = [] }) => {
  const sequences = getHexagramSequences();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <select
        value={currentSequence}
        onChange={(e) => onSequenceChange(e.target.value)}
        className="w-full p-2 pr-8 border-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg cursor-pointer appearance-none"
      >
        <optgroup
          label="Standard Sequences"
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {Object.entries(sequences).map(([key, seq]) => (
            <option
              key={key}
              value={key}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {seq.title}
            </option>
          ))}
        </optgroup>
        {customSequences.length > 0 && (
          <optgroup
            label="My Sequences"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {customSequences.map((seq) => (
              <option
                key={`custom-${seq.id}`}
                value={`custom-${seq.id}`}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {seq.title} ({seq.name})
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
};

export default SequenceDropdown;
