// src/hooks/useFilters.js

import { useState, useCallback } from 'react';
import * as Yijing from '@yijingjs/core';
import * as Bagua from '@yijingjs/bagua';
import * as Wuxing from '@yijingjs/wuxing';

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

  const isFiltered = useCallback((hexIndex) => {
    if (hexIndex == null) return false;

    const symmetryGroup = Yijing.yijing_symmetryName(hexIndex);
    const isFilteredBySymmetry = filterSymmetry.length > 0 && !filterSymmetry.includes(symmetryGroup);

    const isFilteredByMantra = filterMantra.length > 0 && !filterMantra.includes(Yijing.yijing_mantraName(hexIndex));

    const isFilteredByBalance = filterBalance.length > 0 && !filterBalance.includes(Yijing.yijing_taoName(hexIndex));

    const isFilteredByUpperTrigram = filterUpperTrigram.length > 0 && !filterUpperTrigram.includes(Bagua.bagua_toName(Yijing.yijing_upper(hexIndex)));

    const isFilteredByLowerTrigram = filterLowerTrigram.length > 0 && !filterLowerTrigram.includes(Bagua.bagua_toName(Yijing.yijing_lower(hexIndex)));

    const transitionType = Wuxing.wuxing_transitionType(
      Bagua.bagua_toWuxing(Yijing.yijing_upper(hexIndex)),
      Bagua.bagua_toWuxing(Yijing.yijing_lower(hexIndex))
    );
    const isFilteredByTransition = filterTransition.length > 0 && !filterTransition.includes(transitionType);

    const isFilteredByAmino = filterAmino.length > 0 && !filterAmino.includes(Yijing.yijing_toAminoAcidName(hexIndex));

    const isFilteredByBottomSixiang = filterBottomSixiang.length > 0 && !filterBottomSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_red(hexIndex)));

    const isFilteredByMiddleSixiang = filterMiddleSixiang.length > 0 && !filterMiddleSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_white(hexIndex)));

    const isFilteredByTopSixiang = filterTopSixiang.length > 0 && !filterTopSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_blue(hexIndex)));

    return (
      isFilteredBySymmetry ||
      isFilteredByMantra ||
      isFilteredByBalance ||
      isFilteredByUpperTrigram ||
      isFilteredByLowerTrigram ||
      isFilteredByTransition ||
      isFilteredByAmino ||
      isFilteredByBottomSixiang ||
      isFilteredByMiddleSixiang ||
      isFilteredByTopSixiang
    );
  }, [
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
  ]);

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
    hasActiveFilters,
    isFiltered,
  };
};
