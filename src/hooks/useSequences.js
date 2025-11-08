// src/hooks/useSequences.js

import { useState, useEffect, useCallback } from 'react';
import { getAllSequences, addSequence, removeSequence as removeSequenceStorage } from '../utils/sequenceStorage.js';
import { getHexagramSequences } from '../utils/tools.js';

export const useSequences = () => {
  const [customSequences, setCustomSequences] = useState([]);
  const [currentSequence, setCurrentSequence] = useState('kingwen');

  useEffect(() => {
    try {
      const sequences = getAllSequences();
      setCustomSequences(Array.isArray(sequences) ? sequences : []);
    } catch (error) {
      console.error('Error loading sequences:', error);
      setCustomSequences([]);
    }
  }, []);

  const addCustomSequence = useCallback((sequenceObj) => {
    try {
      addSequence(sequenceObj);
      setCustomSequences(getAllSequences());
    } catch (error) {
      console.error('Error adding sequence:', error);
    }
  }, []);

  const removeSequence = useCallback((id) => {
    try {
      removeSequenceStorage(id);
      setCustomSequences(getAllSequences());
    } catch (error) {
      console.error('Error removing sequence:', error);
    }
  }, []);

  const validateSequenceId = useCallback((seqId) => {
    const baseSequences = getHexagramSequences();
    if (seqId in baseSequences) return true;

    if (seqId.startsWith('custom-')) {
      const customId = parseInt(seqId.replace('custom-', ''), 10);
      return customSequences.some(seq => seq.id === customId);
    }

    return false;
  }, [customSequences]);

  const setCurrentSequenceSafe = useCallback((seqId) => {
    if (validateSequenceId(seqId)) {
      setCurrentSequence(seqId);
    } else {
      console.warn(`Invalid sequence ID: ${seqId}, falling back to kingwen`);
      setCurrentSequence('kingwen');
    }
  }, [validateSequenceId]);

  return {
    customSequences,
    currentSequence,
    setCurrentSequence: setCurrentSequenceSafe,
    addSequence: addCustomSequence,
    removeSequence,
    validateSequenceId
  };
};
