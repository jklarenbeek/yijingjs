// src/components/FiltersPanel.jsx
import * as Yijing from '@yijingjs/core';
import * as Bagua from '@yijingjs/bagua';
import * as Wuxing from '@yijingjs/wuxing';
import HexagramCard from './HexagramCard';
import {
  SYMMETRY_COLORS,
  BALANCED_COLORS,
  MANTRA_COLORS,
  WUXING_COLORS,
  TRANSITION_COLORS, // Add to globals.js
  SIXIANG_COLORS,    // Add to globals.js
  cn,
  generateSymmetryInfo
} from '../globals.js';
import { useMemo } from 'react';

const symmetryGroups = generateSymmetryInfo(Yijing.yijing_symmetryGroups);

const FiltersPanel = ({
  filterSymmetry,
  onSymmetryToggle,
  filterMantra,
  onMantraToggle,
  filterBalance,
  onBalanceToggle,
  filterUpperTrigram,
  onUpperTrigramToggle,
  filterLowerTrigram,
  onLowerTrigramToggle,
  filterTransition,
  onTransitionToggle,
  filterAmino,
  onAminoToggle,
  filterBottomSixiang,     // (red/deus)
  onBottomSixiangToggle,
  filterMiddleSixiang,     // (white/homo)
  onMiddleSixiangToggle,
  filterTopSixiang,        // (blue/torah)
  onTopSixiangToggle,
  placedHexagrams = [],
  onSelectHex,
  setEditStage,
  editMode = false,
}) => {

  const mantraCounts = useMemo(() => ({
    [Yijing.YIJING_COSMIC]: 0,
    [Yijing.YIJING_KARMIC]: 0,
    [Yijing.YIJING_ATOMIC]: 0,
  }), []);
  const balanceCounts = useMemo(() => ({
    [Yijing.YIJING_BALANCED]: 0,
    [Yijing.YIJING_UNBALANCED]: 0,
  }), []);
  for (let i = 0; i < 64; i++) {
    mantraCounts[Yijing.yijing_mantraName(i)]++;
    balanceCounts[Yijing.yijing_balancedName(i)]++;
  }

  const transitionCounts = useMemo(() => ({
    [Wuxing.WUXING_NEUTRAL]: 0,
    [Wuxing.WUXING_CREATES]: 0,
    [Wuxing.WUXING_DESTROYS]: 0,
    [Wuxing.WUXING_WEAKENS]: 0,
    [Wuxing.WUXING_INSULTS]: 0,
  }), []);
  for (let i = 0; i < 64; i++) {
    const upper = Yijing.yijing_upper(i);
    const lower = Yijing.yijing_lower(i);
    const uw = Bagua.bagua_toWuxing(upper);
    const lw = Bagua.bagua_toWuxing(lower);
    const t = Wuxing.wuxing_transitionType(uw, lw);
    transitionCounts[t]++;
  }

  const aaCounts = useMemo(() => {
    const counts = {};
    for (let i = 0; i < 64; i++) {
      const aa = Yijing.yijing_toAminoAcidName(i);
      counts[aa] = (counts[aa] || 0) + 1;
    }
    return counts;
  }, []);

  const balanceInfo = [
    { key: Yijing.YIJING_BALANCED, label: 'Balanced', count: balanceCounts[Yijing.YIJING_BALANCED] },
    { key: Yijing.YIJING_UNBALANCED, label: 'Unbalanced', count: balanceCounts[Yijing.YIJING_UNBALANCED] },
  ];

  const mantraInfo = [
    { key: Yijing.YIJING_COSMIC, label: 'Cosmic', count: mantraCounts[Yijing.YIJING_COSMIC] },
    { key: Yijing.YIJING_KARMIC, label: 'Karmic', count: mantraCounts[Yijing.YIJING_KARMIC] },
    { key: Yijing.YIJING_ATOMIC, label: 'Atomic', count: mantraCounts[Yijing.YIJING_ATOMIC] },
  ];

  const trigramInfo = [
    { key: Bagua.BAGUA_EARTH, label: `Earth ☷`, count: 8 },
    { key: Bagua.BAGUA_MOUNTAIN, label: `Mountain ☶`, count: 8 },
    { key: Bagua.BAGUA_WATER, label: `Water ☵`, count: 8 },
    { key: Bagua.BAGUA_WIND, label: `Wind ☴`, count: 8 },
    { key: Bagua.BAGUA_THUNDER, label: `Thunder ☳`, count: 8 },
    { key: Bagua.BAGUA_FIRE, label: `Fire ☲`, count: 8 },
    { key: Bagua.BAGUA_LAKE, label: `Lake ☱`, count: 8 },
    { key: Bagua.BAGUA_HEAVEN, label: `Heaven ☰`, count: 8 },
  ];

  const transitionInfo = [
    { key: Wuxing.WUXING_NEUTRAL, label: 'Neutral', count: transitionCounts[Wuxing.WUXING_NEUTRAL] },
    { key: Wuxing.WUXING_CREATES, label: 'Creates', count: transitionCounts[Wuxing.WUXING_CREATES] },
    { key: Wuxing.WUXING_DESTROYS, label: 'Destroys', count: transitionCounts[Wuxing.WUXING_DESTROYS] },
    { key: Wuxing.WUXING_WEAKENS, label: 'Weakens', count: transitionCounts[Wuxing.WUXING_WEAKENS] },
    { key: Wuxing.WUXING_INSULTS, label: 'Insults', count: transitionCounts[Wuxing.WUXING_INSULTS] },
  ];

  const aminoInfo = Object.keys(aaCounts).sort().map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    count: aaCounts[key],
  }));

  const sixiangInfo = [
    { key: Wuxing.SIXIANG_NORTH, label: `North ⚏ 🐢`, count: 16 },
    { key: Wuxing.SIXIANG_EAST, label: `East ⚎ 🐉`, count: 16 },
    { key: Wuxing.SIXIANG_WEST, label: `West ⚍ 🐅`, count: 16 },
    { key: Wuxing.SIXIANG_SOUTH, label: `South ⚌ 🐦`, count: 16 },
  ];

  // Check if any filters are active
  const hasActiveFilters = filterBalance.length > 0 || filterMantra.length > 0 || filterSymmetry.length > 0 ||
    filterUpperTrigram.length > 0 || filterLowerTrigram.length > 0 || filterTransition.length > 0 ||
    filterAmino.length > 0 || filterBottomSixiang.length > 0 || filterMiddleSixiang.length > 0 ||
    filterTopSixiang.length > 0;

  const clearAllFilters = () => {
    filterBalance.forEach(onBalanceToggle);
    filterMantra.forEach(onMantraToggle);
    filterSymmetry.forEach(onSymmetryToggle);
    filterUpperTrigram.forEach(onUpperTrigramToggle);     // New
    filterLowerTrigram.forEach(onLowerTrigramToggle);     // New
    filterTransition.forEach(onTransitionToggle);         // New
    filterAmino.forEach(onAminoToggle);                   // New
    filterBottomSixiang.forEach(onBottomSixiangToggle);   // New
    filterMiddleSixiang.forEach(onMiddleSixiangToggle);   // New
    filterTopSixiang.forEach(onTopSixiangToggle);         // New
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Existing: Tao Balance Filter */}
        <details open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Tao Balance
          </summary>
          <div className="flex flex-wrap gap-2">
            {balanceInfo.map(({ key, label, count }) => {
              const isActive = filterBalance.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onBalanceToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: BALANCED_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Existing: Mantra Levels Filter */}
        <details open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Mantra Levels
          </summary>
          <div className="flex flex-wrap gap-2">
            {mantraInfo.map(({ key, label, count }) => {
              const isActive = filterMantra.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onMantraToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: MANTRA_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Existing: Symmetry Groups Filter */}
        <details open>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Symmetry Groups
          </summary>
          <div className="flex flex-wrap gap-2">
            {symmetryGroups.map(({ key, label, count }) => {
              const isActive = filterSymmetry.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onSymmetryToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: SYMMETRY_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label} symmetry group`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Upper Trigram Filter */}
        <details>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Upper Trigram
          </summary>
          <div className="flex flex-wrap gap-2">
            {trigramInfo.map(({ key, label, count }) => {
              const isActive = filterUpperTrigram.includes(key);
              const wuxing = Bagua.bagua_toWuxing(Bagua.bagua_fromName(key));
              return (
                <button
                  key={key}
                  onClick={() => onUpperTrigramToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: WUXING_COLORS[wuxing],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Lower Trigram Filter */}
        <details>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Lower Trigram
          </summary>
          <div className="flex flex-wrap gap-2">
            {trigramInfo.map(({ key, label, count }) => {
              const isActive = filterLowerTrigram.includes(key);
              const wuxing = Bagua.bagua_toWuxing(Bagua.bagua_fromName(key));
              return (
                <button
                  key={key}
                  onClick={() => onLowerTrigramToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: WUXING_COLORS[wuxing],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Transition Types Filter */}
        <details>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Wuxing Transitions
          </summary>
          <div className="flex flex-wrap gap-2">
            {transitionInfo.map(({ key, label, count }) => {
              const isActive = filterTransition.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onTransitionToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: TRANSITION_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Bottom Sixiang (Deus/Red) Filter */}
        <details>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Top Layer (Deus)
          </summary>
          <div className="flex flex-wrap gap-2">
            {sixiangInfo.map(({ key, label, count }) => {
              const isActive = filterBottomSixiang.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onBottomSixiangToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: SIXIANG_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Middle Sixiang (Homo/White) Filter */}
        <details>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Middle Layer (Homo)
          </summary>
          <div className="flex flex-wrap gap-2">
            {sixiangInfo.map(({ key, label, count }) => {
              const isActive = filterMiddleSixiang.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onMiddleSixiangToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: SIXIANG_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Top Sixiang (Torah/Blue) Filter */}
        <details>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Bottom Layer (Torah)
          </summary>
          <div className="flex flex-wrap gap-2">
            {sixiangInfo.map(({ key, label, count }) => {
              const isActive = filterTopSixiang.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onTopSixiangToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: SIXIANG_COLORS[key],
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Amino Acids Filter */}
        <details>
          <summary className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Amino Acids
          </summary>
          <div className="flex flex-wrap gap-2">
            {aminoInfo.map(({ key, label, count }) => {
              const isActive = filterAmino.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => onAminoToggle(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "flex items-center gap-2",
                    "hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive
                      ? "ring-2 ring-white dark:ring-gray-900 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: '#3b82f6', // Default blue for amino acids
                    color: 'white'
                  }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? 'Hide' : 'Show'} ${label}`}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isActive ? "bg-white" : "bg-white/30"
                    )}
                  />
                  <span>{label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </details>

        {/* Single Clear All Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline transition-colors"
          >
            Clear all filters
          </button>
        )}

        {/* Hexagram Pool - Only in Edit Mode */}
        {editMode && (
          <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Available Hexagrams
              </h3>
            </div>
            {(() => {
              const available = Array.from({ length: 64 }, (_, i) => i).filter(
                (i) =>
                  !placedHexagrams.includes(i) &&
                  (filterSymmetry.length === 0 ||
                    filterSymmetry.includes(Yijing.yijing_symmetryName(i))) &&
                  (filterMantra.length === 0 ||
                    filterMantra.includes(Yijing.yijing_mantraName(i))) &&
                  (filterBalance.length === 0 ||
                    filterBalance.includes(Yijing.yijing_balancedName(i))) &&
                  // New filters
                  (filterUpperTrigram.length === 0 ||
                    filterUpperTrigram.includes(Bagua.bagua_toName(Yijing.yijing_upper(i)))) &&
                  (filterLowerTrigram.length === 0 ||
                    filterLowerTrigram.includes(Bagua.bagua_toName(Yijing.yijing_lower(i)))) &&
                  (filterTransition.length === 0 ||
                    filterTransition.includes(
                      Wuxing.wuxing_transitionType(
                        Bagua.bagua_toWuxing(Yijing.yijing_upper(i)),
                        Bagua.bagua_toWuxing(Yijing.yijing_lower(i))
                      )
                    )) &&
                  (filterAmino.length === 0 ||
                    filterAmino.includes(Yijing.yijing_toAminoAcidName(i))) &&
                  (filterBottomSixiang.length === 0 ||
                    filterBottomSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_red(i)))) &&
                  (filterMiddleSixiang.length === 0 ||
                    filterMiddleSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_white(i)))) &&
                  (filterTopSixiang.length === 0 ||
                    filterTopSixiang.includes(Wuxing.sixiang_toName(Yijing.yijing_blue(i))))
              );

              const handleDragStart = (e, hexIndex) => {
                e.dataTransfer.setData('text/plain', `pool:${hexIndex}`);
              };

              return available.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hexagrams match current filters
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {available.map((hexIndex) => (
                    <div
                      key={hexIndex}
                      draggable
                      onDragStart={(e) => handleDragStart(e, hexIndex)}
                      onClick={() => onSelectHex(hexIndex)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <HexagramCard
                        hexIndex={hexIndex}
                        selected={false}
                        onClick={() => { }}
                        isNeighbor={false}
                        symmetryGroup={Yijing.yijing_symmetryName(hexIndex)}
                        filterSymmetry={filterSymmetry}
                        inEditMode
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </section>
        )}

        {/* Info Message when not in edit mode */}
        {!editMode && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            <p>Hexagram pool is available in Edit Mode</p>
          </div>
        )}
      </div>

      {/* Optional Footer */}
      {editMode && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Drag from pool to grid • Double-click to remove
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;