import { useState, useCallback } from 'react';

const useEditHistory = (initialState, setParentStage) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const pushState = useCallback((newState) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newState))); // Deep clone
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setParentStage(newState);
  }, [history, currentIndex, setParentStage]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setParentStage(history[newIndex]);
    }
  }, [currentIndex, history, setParentStage]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setParentStage(history[newIndex]);
    }
  }, [currentIndex, history, setParentStage]);

  const clearHistory = useCallback(() => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    currentState,
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historySize: history.length,
    currentIndex: currentIndex + 1,
    clearHistory
  };
};

export default useEditHistory;
