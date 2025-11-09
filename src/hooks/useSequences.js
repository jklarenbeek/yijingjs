// src/hooks/useSequences.js

import { useState, useEffect, useCallback } from 'react';
import { getAllSequences, addSequence, removeSequence as removeSequenceStorage } from '../utils/storage.js';
import { getHexagramSequences } from '../utils/tools.js';

const useSequences = () => {
  const [customSequences, setCustomSequences] = useState([]);
  const [currentSequence, setCurrentSequence] = useState('kingwen');

  useEffect(() => {
    try {
      const sequences = getAllSequences();
      setCustomSequences(Array.isArray(sequences) ? sequences : []);
    }
    catch (error) {
      console.error('Error loading sequences:', error);
      setCustomSequences([]);
    }
  }, []);

  const addCustomSequence = useCallback((sequenceObj) => {
    try {
      // Validate sequence name
      const standardSequences = getHexagramSequences();
      if (sequenceObj.name in standardSequences) {
        throw new Error('Sequence name conflicts with standard sequence');
      }

      const existingCustom = getAllSequences();
      if (existingCustom.some(seq => seq.name === sequenceObj.name)) {
        throw new Error('Sequence name already exists');
      }

      addSequence(sequenceObj);
      setCustomSequences(getAllSequences());
      return true;
    }
    catch (error) {
      console.error('Error adding sequence:', error);
      throw error;
    }
  }, []);

  const removeSequence = useCallback((id) => {
    try {
      removeSequenceStorage(id);
      setCustomSequences(getAllSequences());
      return true;
    }
    catch (error) {
      console.error('Error removing sequence:', error);
      return false;
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

  const getCurrentSequenceData = useCallback(() => {
    const baseSequences = getHexagramSequences();

    if (currentSequence in baseSequences) {
      return baseSequences[currentSequence];
    }

    if (currentSequence.startsWith('custom-')) {
      const customId = parseInt(currentSequence.replace('custom-', ''), 10);
      return customSequences.find(seq => seq.id === customId) || null;
    }

    return null;
  }, [currentSequence, customSequences]);

  const refreshCurrentSequence = useCallback(() => {
    // Force refresh by triggering a state update
    setCustomSequences([...getAllSequences()]);
  }, []);

  return {
    customSequences,
    currentSequence,
    setCurrentSequence: setCurrentSequenceSafe,
    addSequence: addCustomSequence,
    removeSequence,
    validateSequenceId,
    getCurrentSequenceData,
    refreshCurrentSequence
  };
};

export default useSequences;
