// src/components/SequenceManager.jsx
import React, { useState, useEffect } from 'react';
import { getAllSequences, addSequence, removeSequence } from '../utils/sequenceStorage';

const SequenceManager = ({
    editStage,
    setEditStage,
    setCurrentSequence,
    setEditMode,
}) => {
    const [sequences, setSequences] = useState([]);
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [showConfirm, setShowConfirm] = useState(null);

    useEffect(() => {
        setSequences(getAllSequences());
    }, []);

    const handleSave = () => {
        if (!name.trim() || !title.trim()) return;
        const seqObj = {
            id: Date.now(),
            name: name.trim(),
            title: title.trim(),
            values: [...editStage],
        };
        addSequence(seqObj);
        setSequences(getAllSequences());
        setName('');
        setTitle('');
    };

    const handleLoad = (seq) => {
        setEditStage(seq.values);
        setCurrentSequence(`custom-${seq.id}`);
        setEditMode(false);
    };

    const handleDelete = (id) => {
        removeSequence(id);
        setSequences(getAllSequences());
        setShowConfirm(null);
    };

    const handleClearStaging = () => {
        localStorage.removeItem('yijing_edit_stage');
        setEditStage(Array(64).fill(null));
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Sequence Manager
            </h3>

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Short name (e.g. flow1)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                    type="text"
                    placeholder="Display title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || !title.trim()}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded transition-colors"
                    >
                        Save Current
                    </button>
                    <button
                        onClick={handleClearStaging}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                        Clear Draft
                    </button>
                </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {sequences.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No saved sequences
                    </p>
                ) : (
                    sequences.map((seq) => (
                        <div
                            key={seq.id}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                            <div>
                                <p className="font-medium text-sm">{seq.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{seq.name}</p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleLoad(seq)}
                                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                                >
                                    Load
                                </button>
                                <button
                                    onClick={() => setShowConfirm(seq.id)}
                                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                        <p className="mb-3">Delete this sequence?</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowConfirm(null)}
                                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showConfirm)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
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