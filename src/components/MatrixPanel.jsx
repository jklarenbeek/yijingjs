// src/components/MatrixPanel.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import HexagramGrid from './HexagramGrid';
import EditableHexagramGrid from './EditableHexagramGrid';
import InspectorPanel from './InspectorPanel';
import FiltersPanel from './FiltersPanel.jsx';
import KingWenPanel from './KingWenPanel.jsx';
import SequenceManager from './SequenceManager';
import AppTabs from './AppTabs';
import { TAB_NAMES } from '../utils/constants';

const MatrixPanel = ({
  editMode,
  setEditMode,
  editStage,
  handleEditStageChange,
  selectedHex,
  handleSelectHex,
  filters,
  neighbors,
  hasUnsavedChanges,
  setHasUnsavedChanges,
  showSixiangs,
  showKingWenNumbers,
  sequences,
  handleLoadSequence,
  activeTab,
  setActiveTab
}) => {
  return (
    <motion.div
      key="view-grid"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col p-4 md:p-8 w-full h-full max-w-screen-2xl mx-auto overflow-y-auto"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          The Matrix
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
          Interactive 64 Hexagram sequence layout. Explore, filter, and edit the foundational grid of the I Ching system.
          {editMode
            ? ' Drag hexagrams from pool to grid • Drag placed hexagrams to move or swap • Double-click to remove • Save in Manager'
            : ' Use arrow keys to navigate • Click hexagrams to explore relationships.'}
        </p>
        {editMode && hasUnsavedChanges && (
          <p className="text-amber-600 dark:text-amber-400 font-medium mt-1">
            • You have unsaved changes •
          </p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Main Panel */}
        <div className="flex-1 min-w-0">
          {editMode ? (
            <EditableHexagramGrid
              editStage={editStage}
              setEditStage={handleEditStageChange}
              selectedHex={selectedHex}
              onSelectHex={handleSelectHex}
              filters={filters}
              neighbors={neighbors}
              hasUnsavedChanges={hasUnsavedChanges}
              showSixiangs={showSixiangs}
              showKingWenNumbers={showKingWenNumbers}
            />
          ) : (
            <HexagramGrid
              selectedHex={selectedHex}
              onSelectHex={handleSelectHex}
              neighbors={neighbors}
              filters={filters}
              currentSequence={sequences.currentSequence}
              customSequences={sequences.customSequences}
              showSixiangs={showSixiangs}
              showKingWenNumbers={showKingWenNumbers}
            />
          )}
        </div>

        {/* Side Panel with Tabs */}
        <div className="lg:w-96 lg:shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <AppTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              editMode={editMode}
            />

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === TAB_NAMES.READER && (
                <KingWenPanel
                  hexIndex={selectedHex}
                />
              )}
              {activeTab === TAB_NAMES.INSPECTOR && (
                <InspectorPanel
                  hexIndex={selectedHex}
                  onSelectHex={handleSelectHex}
                  filters={filters}
                  showSixiangs={showSixiangs}
                  showKingWenNumbers={showKingWenNumbers}
                />
              )}
              {activeTab === TAB_NAMES.FILTERS && (
                <FiltersPanel
                  filters={filters}
                  placedHexagrams={editMode ? editStage.filter(h => h !== null) : []}
                  onSelectHex={handleSelectHex}
                  currentSequence={sequences.currentSequence}
                  setCurrentSequence={sequences.setCurrentSequence}
                  customSequences={sequences.customSequences}
                  editMode={editMode}
                  showSixiangs={showSixiangs}
                  showKingWenNumbers={showKingWenNumbers}
                />
              )}
              {activeTab === TAB_NAMES.MANAGER && editMode && (
                <SequenceManager
                  editStage={editStage}
                  setEditStage={handleEditStageChange}
                  setCurrentSequence={sequences.setCurrentSequence}
                  setEditMode={setEditMode}
                  addSequence={sequences.addSequence}
                  removeSequence={sequences.removeSequence}
                  customSequences={sequences.customSequences}
                  currentSequence={sequences.currentSequence}
                  onLoadSequence={handleLoadSequence}
                  hasUnsavedChanges={hasUnsavedChanges}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatrixPanel;
