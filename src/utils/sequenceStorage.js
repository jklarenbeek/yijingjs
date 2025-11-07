// src/utils/sequenceStorage.js
const STORAGE_KEY = 'yijing_custom_sequences';

export function getAllSequences() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return [];
  }
}

export function addSequence(sequenceObj) {
  const sequences = getAllSequences();
  sequences.push(sequenceObj);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sequences));
}

export function getSequenceById(id) {
  const sequences = getAllSequences();
  return sequences.find(s => s.id === id) || null;
}

export function removeSequence(id) {
  const sequences = getAllSequences();
  const filtered = sequences.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}