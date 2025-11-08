// src/hooks/useFilters.js

import { useState, useCallback } from 'react';

export const useFilters = () => {
  const [filterSymmetry, setFilterSymmetry] = useState([]);
  const [filterMantra, setFilterMantra] = useState([]);
  const [filterBalance, setFilterBalance] = useState([]);
  const [filterUpperTrigram, setFilterUpperTrigram] = useState([]);
  const [filterLowerTrigram, setFilterLowerTrigram] = useState([]);
  const [filterTransition, setFilterTransition] = useState([]);
  const [filterAmino, setFilterAmino] = useState([]);
  const [filterBottomSixiang, setFilterBottomSixiang] = useState([]);
  const [filterMiddleSixiang, setFilterMiddleSixiang] = useState([]);
  const [filterTopSixiang, setFilterTopSixiang] = useState([]);

  const handleSymmetryToggle = useCallback((key) => {
    setFilterSymmetry(prev => {
      const newFilter = prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key];
      if (newFilter.length > 0) {
        setFilterMantra([]);
        setFilterBalance([]);
      }
      return newFilter;
    });
  }, []);

  const handleMantraToggle = useCallback((key) => {
    setFilterMantra(prev => {
      const newFilter = prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key];
      if (newFilter.length > 0) {
        setFilterSymmetry([]);
      }
      return newFilter;
    });
  }, []);

  const handleBalanceToggle = useCallback((key) => {
    setFilterBalance(prev => {
      const newFilter = prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key];
      if (newFilter.length > 0) {
        setFilterSymmetry([]);
      }
      return newFilter;
    });
  }, []);

  const handleUpperTrigramToggle = useCallback((key) => {
    setFilterUpperTrigram(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }, []);

  const handleLowerTrigramToggle = useCallback((key) => {
    setFilterLowerTrigram(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }, []);

  const handleTransitionToggle = useCallback((key) => {
    setFilterTransition(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }, []);

  const handleAminoToggle = useCallback((key) => {
    setFilterAmino(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }, []);

  const handleBottomSixiangToggle = useCallback((key) => {
    setFilterBottomSixiang(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }, []);

  const handleMiddleSixiangToggle = useCallback((key) => {
    setFilterMiddleSixiang(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }, []);

  const handleTopSixiangToggle = useCallback((key) => {
    setFilterTopSixiang(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterSymmetry([]);
    setFilterMantra([]);
    setFilterBalance([]);
    setFilterUpperTrigram([]);
    setFilterLowerTrigram([]);
    setFilterTransition([]);
    setFilterAmino([]);
    setFilterBottomSixiang([]);
    setFilterMiddleSixiang([]);
    setFilterTopSixiang([]);
  }, []);

  const hasActiveFilters =
    filterSymmetry.length > 0 || filterMantra.length > 0 || filterBalance.length > 0 ||
    filterUpperTrigram.length > 0 || filterLowerTrigram.length > 0 || filterTransition.length > 0 ||
    filterAmino.length > 0 || filterBottomSixiang.length > 0 || filterMiddleSixiang.length > 0 ||
    filterTopSixiang.length > 0;

  return {
    filterSymmetry,
    filterMantra,
    filterBalance,
    filterUpperTrigram,
    filterLowerTrigram,
    filterTransition,
    filterAmino,
    filterBottomSixiang,
    filterMiddleSixiang,
    filterTopSixiang,
    handleSymmetryToggle,
    handleMantraToggle,
    handleBalanceToggle,
    handleUpperTrigramToggle,
    handleLowerTrigramToggle,
    handleTransitionToggle,
    handleAminoToggle,
    handleBottomSixiangToggle,
    handleMiddleSixiangToggle,
    handleTopSixiangToggle,
    clearAllFilters,
    hasActiveFilters
  };
};
