// src/components/ExplainPanel.jsx
import React from 'react';
import { useKingWenText } from '../hooks/useKingWenText';

const HexagramTextPanel = ({ hexIndex }) => {
  const { data, loading, error } = useKingWenText(hexIndex);

  if (!Number.isInteger(hexIndex)) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <p>Select a hexagram to view its I Ching text</p>
      </div>
    );
  }

  // King Wen sequence uses 1-based indexing
  if (!data) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        <p>No text data available for this hexagram</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        <p>Loading ancient wisdom...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        <p>Error loading texts.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-serif">{data.hex_font}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.english}
            </h2>
          </div>
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>#{data.hex}</span>
            <span>{data.trad_chinese}</span>
            <span>{data.pinyin}</span>
          </div>
        </div>

        {/* Trigrams */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Trigrams
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Above:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {data.above.chinese} - {data.above.symbolic} {data.above.alchemical}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Below:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {data.below.chinese} - {data.below.symbolic} {data.below.alchemical}
              </span>
            </div>
          </div>
        </section>

        {/* Symbolic */}
        {data.symbolic && (
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Symbolic Meaning
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.symbolic}
            </p>
          </section>
        )}

        {/* Judgment */}
        {data.judgment && (
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              The Judgment
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-800 dark:text-gray-200 leading-relaxed border-l-4 border-blue-500 pl-4">
                {data.judgment.text}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.judgment.comments}
              </p>
            </div>
          </section>
        )}

        {/* Image */}
        {data.image && (
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              The Image
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-800 dark:text-gray-200 leading-relaxed border-l-4 border-green-500 pl-4">
                {data.image.text}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.image.comments}
              </p>
            </div>
          </section>
        )}

        {/* Lines */}
        {data.lines && (
          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              The Lines
            </h3>
            <div className="space-y-6">
              {Object.entries(data.lines).map(([lineNum, lineData]) => (
                <div
                  key={lineNum}
                  className="border-l-2 border-gray-300 dark:border-gray-600 pl-4"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Line {lineNum}
                  </h4>
                  <div className="space-y-2">
                    <p className="italic text-gray-700 dark:text-gray-300 text-sm">
                      {lineData.text}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {lineData.comments}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HexagramTextPanel;
