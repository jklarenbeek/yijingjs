// src/components/SequenceDropdown.jsx
import { getHexagramSequences } from '../globals';

const SequenceDropdown = ({ currentSequence, onSequenceChange, customSequences = [] }) => {
  const sequences = getHexagramSequences();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <select
        value={currentSequence}
        onChange={(e) => onSequenceChange(e.target.value)}
        className="w-full p-2 pr-8 border-0 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg cursor-pointer"
      >
        <optgroup label="Standard Sequences">
          {Object.entries(sequences).map(([key, seq]) => (
            <option key={key} value={key}>
              {seq.title}
            </option>
          ))}
        </optgroup>
        {customSequences.length > 0 && (
          <optgroup label="My Sequences">
            {customSequences.map((seq) => (
              <option key={`custom-${seq.id}`} value={`custom-${seq.id}`}>
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