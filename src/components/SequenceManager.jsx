// src/components/SequenceManager.jsx

import { useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const SequenceManager = ({
  editStage,
  setEditStage,
  setCurrentSequence,
  setEditMode,
  addSequence,
  removeSequence,
  customSequences = []
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [showConfirm, setShowConfirm] = useState(null);

  const handleSave = () => {
    if (!name.trim() || !title.trim()) {
      alert('Please enter both name and title');
      return;
    }

    const seqObj = {
      id: Date.now(),
      name: name.trim(),
      title: title.trim(),
      values: [...editStage],
    };

    if (addSequence(seqObj)) {
      setName('');
      setTitle('');
    }
    else {
      alert('Error saving sequence');
    }
  };

  const handleLoad = (seq) => {
    try {
      setEditStage(seq.values);
      setCurrentSequence(`custom-${seq.id}`);
      setEditMode(false);
    }
    catch (error) {
      console.error('Error loading sequence:', error);
      alert('Error loading sequence');
    }
  };

  const handleDelete = (id) => {
    if (removeSequence(id)) {
      setShowConfirm(null);
    }
    else {
      alert('Error deleting sequence');
    }
  };

  const handleClearStaging = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.EDIT_STAGE);
      setEditStage(Array(64).fill(null));
    }
    catch (error) {
      console.error('Error clearing staging:', error);
      alert('Error clearing staging area');
    }
  };

  const getPlacementCount = () => editStage.filter(h => h !== null).length;

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Sequence Manager
      </h3>

      {/* Save Section */}
      <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current placement: {getPlacementCount()}/64 hexagrams
        </p>
        <input
          type="text"
          placeholder="Short name (e.g. flow1)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          aria-label="Sequence short name"
        />
        <input
          type="text"
          placeholder="Display title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          aria-label="Sequence display title"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!name.trim() || !title.trim() || getPlacementCount() === 0}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded transition-colors"
            aria-label="Save current sequence"
          >
            Save Current ({getPlacementCount()}/64)
          </button>
          <button
            onClick={handleClearStaging}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            aria-label="Clear draft sequence"
          >
            Clear Draft
          </button>
        </div>
      </div>

      {/* Saved Sequences */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">
          Saved Sequences ({customSequences.length})
        </h4>
        {customSequences.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No saved sequences
          </p>
        ) : (
          customSequences.map((seq) => (
            <div
              key={seq.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{seq.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {seq.name} • {seq.values.filter(v => v !== null).length}/64 hexagrams
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleLoad(seq)}
                  className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  aria-label={`Load sequence ${seq.title}`}
                >
                  Load
                </button>
                <button
                  onClick={() => setShowConfirm(seq.id)}
                  className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  aria-label={`Delete sequence ${seq.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Delete Sequence?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showConfirm)}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceManager;
