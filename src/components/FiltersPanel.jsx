// src/components/FiltersPanel.jsx

import * as Bagua from '@yijingjs/bagua';

import {
  generateAminoAcidInfo,
  generateMantraInfo,
  generateSixiangInfo,
  generateSymmetryInfo,
  generateTaoInfo,
  generateTransitionInfo,
  generateTrigramInfo
} from '../utils/tools.js';

import * as theme from '../utils/colors.js';
import FilterSection from './FilterSection';
import FilterButton from './FilterButton';
import HexagramPool from './HexagramPool';

// Precompute filter groups (memoized in production)
const trigramGroups = generateTrigramInfo();
const taoGroups = generateTaoInfo();
const mantraGroups = generateMantraInfo();
const symmetryGroups = generateSymmetryInfo();
const transitionGroups = generateTransitionInfo();
const sixiangGroups = generateSixiangInfo();
const aminoAcidGroups = generateAminoAcidInfo();

const FiltersPanel = ({
  filters,
  placedHexagrams = [],
  onSelectHex,
  setEditStage,
  editMode = false,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Tao Balance Filter */}
        <FilterSection title="Tao Balance" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {taoGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterBalance?.includes(key) ?? false}
                onClick={() => filters.handleBalanceToggle(key)}
                label={label}
                count={count}
                color={theme.balancedColors[key]}
                ariaLabel={`${filters.filterBalance?.includes(key) ? 'Hide' : 'Show'} ${label}`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Mantra Levels Filter */}
        <FilterSection title="Mantra Levels" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {mantraGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterMantra?.includes(key) ?? false}
                onClick={() => filters.handleMantraToggle(key)}
                label={label}
                count={count}
                color={theme.mantraColors[key]}
                ariaLabel={`${filters.filterMantra?.includes(key) ? 'Hide' : 'Show'} ${label}`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Symmetry Groups Filter */}
        <FilterSection title="Symmetry Groups" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {symmetryGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterSymmetry?.includes(key) ?? false}
                onClick={() => filters.handleSymmetryToggle(key)}
                label={label}
                count={count}
                color={theme.symmetryColors[key]}
                ariaLabel={`${filters.filterSymmetry?.includes(key) ? 'Hide' : 'Show'} ${label} symmetry group`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Upper Trigram Filter */}
        <FilterSection title="Upper Trigram" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {trigramGroups.map(({ key, label, count }) => {
              const wuxing = Bagua.bagua_toWuxing(Bagua.bagua_fromName(key));
              return (
                <FilterButton
                  key={key}
                  isActive={filters.filterUpperTrigram?.includes(key) ?? false}
                  onClick={() => filters.handleUpperTrigramToggle(key)}
                  label={label}
                  count={count}
                  color={theme.wuxingColors[wuxing]}
                  ariaLabel={`${filters.filterUpperTrigram?.includes(key) ? 'Hide' : 'Show'} ${label}`}
                />
              );
            })}
          </div>
        </FilterSection>

        {/* Lower Trigram Filter */}
        <FilterSection title="Lower Trigram" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {trigramGroups.map(({ key, label, count }) => {
              const wuxing = Bagua.bagua_toWuxing(Bagua.bagua_fromName(key));
              return (
                <FilterButton
                  key={key}
                  isActive={filters.filterLowerTrigram?.includes(key) ?? false}
                  onClick={() => filters.handleLowerTrigramToggle(key)}
                  label={label}
                  count={count}
                  color={theme.wuxingColors[wuxing]}
                  ariaLabel={`${filters.filterLowerTrigram?.includes(key) ? 'Hide' : 'Show'} ${label}`}
                />
              );
            })}
          </div>
        </FilterSection>

        {/* Transition Types Filter */}
        <FilterSection title="Wuxing Transitions" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {transitionGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterTransition?.includes(key) ?? false}
                onClick={() => filters.handleTransitionToggle(key)}
                label={label}
                count={count}
                color={theme.transitionColors[key]}
                ariaLabel={`${filters.filterTransition?.includes(key) ? 'Hide' : 'Show'} ${label}`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Sixiang Filters */}
        <FilterSection title="Top Layer (Deus)" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {sixiangGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterBottomSixiang?.includes(key) ?? false}
                onClick={() => filters.handleBottomSixiangToggle(key)}
                label={label}
                count={count}
                color={theme.sixiangColors[key]}
                ariaLabel={`${filters.filterBottomSixiang?.includes(key) ? 'Hide' : 'Show'} ${label}`}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Middle Layer (Homo)" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {sixiangGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterMiddleSixiang?.includes(key) ?? false}
                onClick={() => filters.handleMiddleSixiangToggle(key)}
                label={label}
                count={count}
                color={theme.sixiangColors[key]}
                ariaLabel={`${filters.filterMiddleSixiang?.includes(key) ? 'Hide' : 'Show'} ${label}`}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Bottom Layer (Torah)" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {sixiangGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterTopSixiang?.includes(key) ?? false}
                onClick={() => filters.handleTopSixiangToggle(key)}
                label={label}
                count={count}
                color={theme.sixiangColors[key]}
                ariaLabel={`${filters.filterTopSixiang?.includes(key) ? 'Hide' : 'Show'} ${label}`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Amino Acids Filter */}
        <FilterSection title="Amino Acids" className="mb-1">
          <div className="flex flex-wrap gap-2">
            {aminoAcidGroups.map(({ key, label, count }) => (
              <FilterButton
                key={key}
                isActive={filters.filterAmino?.includes(key) ?? false}
                onClick={() => filters.handleAminoToggle(key)}
                label={label}
                count={count}
                color={theme.additionalColors.amino}
                ariaLabel={`${filters.filterAmino?.includes(key) ? 'Hide' : 'Show'} ${label}`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Clear All Filters Button */}
        {filters.hasActiveFilters && (
          <button
            onClick={filters.clearAllFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline transition-colors"
            aria-label="Clear all filters"
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
            <HexagramPool
              placedHexagrams={placedHexagrams}
              onSelectHex={onSelectHex}
              filters={filters}
            />
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
