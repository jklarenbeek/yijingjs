// src/utils/kabbalah.js
import * as Yijing from '@yijingjs/core';

/**
 * Returns the 32 pairs of the King Wen sequence.
 * In King Wen, pairs are consecutive: (1,2), (3,4)...
 */
export function getKingWenPairs() {
  const seq = Yijing.YIJING_KINGWEN_SEQUENCE;
  const pairs = [];
  for (let i = 0; i < 64; i += 2) {
    pairs.push({
      hexA: seq[i],
      hexB: seq[i + 1],
      id: `kw-${i/2}`,
      label: `Pair ${i/2 + 1}`
    });
  }
  return pairs;
}

/**
 * Returns the 32 pairs of the Binary sequence.
 * A binary pair is a hexagram and its bitwise opposite (inverse).
 */
export function getBinaryPairs() {
  const pairs = [];
  const processed = new Set();
  
  // To keep it ordered beautifully, we iterate 0 to 63
  for (let i = 0; i < 64; i++) {
    if (processed.has(i)) continue;
    const inverse = 63 - i; // bitwise NOT for 6-bit numbers
    pairs.push({
      hexA: i,
      hexB: inverse,
      id: `bin-${pairs.length}`,
      label: `Binary ${i} & ${inverse}`
    });
    processed.add(i);
    processed.add(inverse);
  }
  return pairs;
}

export function categorizePairs(pairs) {
  const balanced = [];
  const unbalanced = [];

  for (const p of pairs) {
    // A balanced pair is one where both hexagrams have exactly 3 yin and 3 yang lines.
    const isBalanced = Yijing.yijing_lineCount(p.hexA) === 3 && Yijing.yijing_lineCount(p.hexB) === 3;
    
    if (isBalanced) {
      // We calculate a score for UI consistency, though no longer needed for sorting
      balanced.push({ ...p, score: 'Balanced (3/3)' });
    } else {
      const yangCount = Yijing.yijing_lineCount(p.hexA) + Yijing.yijing_lineCount(p.hexB);
      unbalanced.push({ ...p, score: `Unbalanced (${yangCount}/12 Yang)` });
    }
  }

  return {
    balanced,
    unbalanced
  };
}
