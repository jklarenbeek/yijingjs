// src/components/MatrixManager.jsx

import { useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { getHexagramSequences } from '../utils/tools.js';
import { Edit3, X } from 'lucide-react';
import { cn } from '../utils/tools.js';

const MatrixManager = ({
  editMode,
  editStage,
  setEditStage,
  setCurrentSequence,
  setEditMode,
  addSequence,
  removeSequence,
  customSequences = [],
  currentSequence,
  onLoadSequence,
  hasUnsavedChanges = false,
  setHasUnsavedChanges
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [showConfirm, setShowConfirm] = useState(null);

  const validateSequenceName = (name) => {
    if (!name.trim()) return 'Name is required';

    // Check if name is valid JavaScript property name
    const validPropertyRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    if (!validPropertyRegex.test(name)) {
      return 'Name must be a valid JavaScript identifier (letters, numbers, _, $, no spaces)';
    }

    // Check if name conflicts with standard sequences
    const standardSequences = getHexagramSequences();
    if (name in standardSequences) {
      return 'Name conflicts with a standard sequence';
    }

    // Check if name already exists in custom sequences
    if (customSequences.some(seq => seq.name === name)) {
      return 'Name already exists in custom sequences';
    }

    return null;
  };

  const handleSave = () => {
    const nameError = validateSequenceName(name);
    if (nameError) {
      alert(nameError);
      return;
    }

    if (!title.trim()) {
      alert('Please enter a display title');
      return;
    }

    const placementCount = editStage.filter(h => h !== null).length;
    if (placementCount === 0) {
      alert('Please place at least one hexagram in the grid before saving');
      return;
    }

    const seqObj = {
      id: Date.now(),
      name: name.trim(),
      title: title.trim(),
      values: [...editStage], // This will be exactly 64 in length with null for empty slots
    };

    try {
      if (addSequence(seqObj)) {
        setName('');
        setTitle('');
        setHasUnsavedChanges(false);
        // Switch to the new sequence
        setCurrentSequence(`custom-${seqObj.id}`);
        setEditMode(false);
      }
    }
    catch (error) {
      alert(`Error saving sequence: ${error.message}`);
    }
  };

  const handleLoad = (seq) => {
    if (onLoadSequence && !onLoadSequence(seq)) {
      return; // Load was cancelled due to unsaved changes
    }

    try {
      setEditStage(seq.values);
      setCurrentSequence(`custom-${seq.id}`);
      setEditMode(false);
      setHasUnsavedChanges(false);
    }
    catch (error) {
      console.error('Error loading sequence:', error);
      alert('Error loading sequence');
    }
  };

  const handleDelete = (id) => {
    if (removeSequence(id)) {
      setShowConfirm(null);
      // If we're currently viewing the deleted sequence, switch to default
      if (currentSequence === `custom-${id}`) {
        setCurrentSequence('kingwen');
      }
    }
    else {
      alert('Error deleting sequence');
    }
  };

  const handleClearStaging = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.EDIT_STAGE);
      setEditStage(Array(64).fill(null));
      setHasUnsavedChanges(false);
    }
    catch (error) {
      console.error('Error clearing staging:', error);
      alert('Error clearing staging area');
    }
  };

  const getPlacementCount = () => editStage.filter(h => h !== null).length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Sequence Manager
        </h3>
        <button
          onClick={() => setEditMode(!editMode)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm shrink-0 text-sm",
            editMode
              ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
          )}
          aria-label={editMode ? 'Exit edit mode' : 'Enter edit mode'}
        >
          {editMode ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {editMode ? 'Exit Edit' : 'Edit Mode'}
        </button>
      </div>

      {editMode && (
        <div className="space-y-4">
          {hasUnsavedChanges && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm">
            <span>💡</span>
            <span>You have unsaved changes in your current edit session</span>
          </div>
        </div>
      )}

      {/* Save Section */}
      <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current placement: {getPlacementCount()}/64 hexagrams
        </p>
        <div>
          <input
            type="text"
            placeholder="Short name (e.g. flow1)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Sequence short name"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Must be a valid JavaScript identifier (no spaces, starts with letter)
          </p>
        </div>
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
      )}
    </div>
  );
};

export default MatrixManager;
