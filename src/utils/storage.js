// src/utils/storage.js

import { LOCAL_STORAGE_KEYS } from './constants.js';

const STORAGE_KEY = LOCAL_STORAGE_KEYS.CUSTOM_SEQUENCES;

export function getAllSequences() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  catch (error) {
    console.error('Error loading sequences from storage:', error);
    return [];
  }
}

export function addSequence(sequenceObj) {
  try {
    const sequences = getAllSequences();
    if (sequences.some(s => s.name === sequenceObj.name))
      return false;

    // Ensure the sequence has exactly 64 values, filling with null if necessary
    const values = Array.from({ length: 64 }, (_, index) => {
      return sequenceObj.values && index < sequenceObj.values.length
        ? sequenceObj.values[index]
        : null;
    });

    const sequenceWithFixedLength = {
      ...sequenceObj,
      values: values
    };

    sequences.push(sequenceWithFixedLength);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sequences));

    return true;
  }
  catch (error) {
    console.error('Error saving sequence to storage:', error);
    return false;
  }
}

export function getSequenceById(id) {
  try {
    const sequences = getAllSequences();
    return sequences.find(s => s.id === id) || null;
  }
  catch (error) {
    console.error('Error getting sequence by ID:', error);
    return null;
  }
}

export function removeSequence(id) {
  try {
    const sequences = getAllSequences();
    const filtered = sequences.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  catch (error) {
    console.error('Error removing sequence from storage:', error);
    return false;
  }
}
