// ./packages/core/src/yijing.js

//#region Sixiang Layers

// Deus -> Bits 0-1: top sixiang
export function yijing_red(hexagram = 0) {
  hexagram = hexagram | 0;
  return (hexagram & 3) | 0;
}

// Homo -> Bits 2-3: middle sixiang
export function yijing_white(hexagram = 0) {
  hexagram = hexagram | 0;
  return ((hexagram >> 2) & 3) | 0;
}

// Torah -> Bits 4-5: bottom sixiang
export function yijing_blue(hexagram = 0) {
  hexagram = hexagram | 0;
  return ((hexagram >> 4) & 3) | 0;
}

export function yijing_toSixiang(hexagram = 0) {
  switch (yijing_root(hexagram)) {
    case 0: return 0;
    case 21: return 1;
    case 42: return 2;
    case 63: return 3;
  }
}

export function yijing_fromSixiang(sixiang = 0) {
  switch (sixiang) {
    case 0: return 0;
    case 1: return 21;
    case 2: return 42;
    case 3: return 63;
  }
}

//#endregion

//#region Bagua Functions

// get upper trigram
export function yijing_upper(hexagram = 0) {
  hexagram = hexagram | 0;
  return hexagram & 7;
}
// get lower trigram
export function yijing_lower(hexagram = 0) {
  hexagram = hexagram | 0;
  return (hexagram >> 3) & 7;
}

//#endregion

//#region Yijing Operators

// XOR with 63 (111111): all lines flip
export function yijing_invert(hexagram = 0) {
  hexagram = hexagram | 0;
  return ((hexagram ^ -1) & 63) | 0;
}

// Extract nuclear hexagram (lines 2-5)
export function yijing_center(hexagram = 0) {
  hexagram = hexagram | 0;
  return ((hexagram << 1) & 56 | (hexagram >> 1) & 7) | 0;
}

// Is one of 4 primordial hexagrams?: 0, 63, 21, 42 (decimal)
export function yijing_isRoot(hexagram = 0) {
  hexagram = hexagram | 0;
  return (hexagram === 0
    || hexagram === 63
    || hexagram === 21
    || hexagram === 42);
}

export function yijing_getCenterChain(hex) {
  const chain = [hex];
  let current = hex;
  while (!yijing_isRoot(current)) {
    current = yijing_center(current);
    if (chain.includes(current)) break;
    chain.push(current);
  }
  return chain;
}

// Find the primordial root of a hexagram
export function yijing_root(hexagram = 0) {
  let value = hexagram | 0;
  while (!yijing_isRoot(value)) {
    value = yijing_center(value);
  }
  return value | 0;
}

// Swap upper/lower trigrams
export function yijing_opposite(hexagram = 0) {
  hexagram = hexagram | 0;
  const lower = yijing_upper(hexagram);
  const upper = yijing_lower(hexagram);
  return (lower << 3) | upper;
}

// Reverse line order (mirror)
export function yijing_reverse(hexagram = 0) {
  hexagram = hexagram | 0;
  return ((hexagram & 1) << 5) |
    ((hexagram & 2) << 3) |
    ((hexagram & 4) << 1) |
    ((hexagram & 8) >> 1) |
    ((hexagram & 16) >> 3) |
    ((hexagram & 32) >> 5);
}

// Count yang lines in hexagram
export function yijing_lineCount(hexagram = 0) {
  hexagram = hexagram | 0;
  return (hexagram & 1)
    + ((hexagram >> 1) & 1)
    + ((hexagram >> 2) & 1)
    + ((hexagram >> 3) & 1)
    + ((hexagram >> 4) & 1)
    + ((hexagram >> 5) & 1);
}

// Calculate Hamming distance (lines that differ)
export function yijing_distance(hex1, hex2) {
  return yijing_lineCount(hex1 ^ hex2);
}

/**
 * Get all hexagrams exactly one line change away (neighbors in hypercube).
 * Returns array of 6 hexagrams, each differing by exactly 1 line.
 * These represent the immediate transformational possibilities.
 *
 * @param {number} hexagram - Hexagram (0-63)
 * @returns {number[]} Array of 6 neighboring hexagrams
 */
export function yijing_neighbors(hexagram) {
  hexagram = hexagram | 0;
  const neighbors = [];
  for (let i = 0; i < 6; i++) {
    neighbors.push((hexagram ^ (1 << i)) & 63);
  }
  return neighbors;
}

/**
 * Generate the complete transformation orbit of a hexagram.
 * Applies all basic transformations (invert, opposite, flip, center)
 * and returns the unique set of reachable hexagrams.
 *
 * This reveals the "family" of related hexagrams under group operations.
 *
 * @param {number} hexagram - Hexagram (0-63)
 * @returns {number[]} Sorted array of orbit members
 */
export function yijing_orbitClass(hexagram = 0) {
  hexagram = hexagram | 0;
  const orbit = {};

  // Add original and all single transformations
  orbit["selected"] = hexagram;
  orbit["inverted"] = yijing_invert(hexagram);
  orbit["opposite"] = yijing_opposite(hexagram);
  orbit["reversed"] = yijing_reverse(hexagram);
  orbit["centered"] = yijing_center(hexagram);

  return orbit;
}

/**
 * Calculate entropy (Shannon information) of hexagram.
 * Measures balance/chaos: 0 = pure (all yin or yang), 1 = perfectly balanced.
 *
 * Formula: -Σ(p_i × log₂(p_i)) where p_yang = yang/6, p_yin = yin/6
 *
 * Maximum entropy (1.0) occurs at 3 yang / 3 yin (Olympian balance).
 * Minimum entropy (0.0) occurs at 0 or 6 yang (Beginning hexagrams).
 *
 * @param {number} hexagram - Hexagram (0-63)
 * @returns {number} Entropy value (0.0 - 1.0)
 */
export function yijing_entropy(hexagram = 0) {
  hexagram = hexagram | 0;
  const yang = yijing_lineCount(hexagram);
  const yin = 6 - yang;

  if (yang === 0 || yin === 0) return 0.0;

  const p_yang = yang / 6;
  const p_yin = yin / 6;

  return -(p_yang * Math.log2(p_yang) + p_yin * Math.log2(p_yin));
}

/**
 * Calculate balance ratio (yang/total lines).
 * Returns value from 0.0 (pure yin) to 1.0 (pure yang).
 * 0.5 = perfect balance (Olympian state).
 *
 * @param {number} hexagram - Hexagram (0-63)
 * @returns {number} Balance ratio (0.0 - 1.0)
 */
export function yijing_balance(hexagram = 0) {
  hexagram = hexagram | 0;
  return yijing_lineCount(hexagram) / 6;
}

/**
 * Get the depth in the nuclear convergence tree.
 * Returns how many center() operations needed to reach cosmic root.
 * - Depth 0: Cosmic roots (4 hexagrams)
 * - Depth 1: Karmic hexagrams
 * - Depth 2+: Atomic hexagrams
 *
 * @param {number} hexagram - Hexagram (0-63)
 * @returns {number} Depth from cosmic root
 */
export function yijing_depth(hexagram = 0) {
  let value = hexagram | 0;
  let depth = 0;
  while (!yijing_isRoot(value)) {
    value = yijing_center(value);
    depth++;
  }
  return depth;
}

// Identifies which transformation relates two hexagrams (C, O, M, I, A, S)
export function yijing_relation(left = 0, right = 0) {
  if (yijing_center(left) === right)
    return 'C';
  else if (yijing_opposite(left) === right)
    return 'O';
  else if (yijing_reverse(left) === right) {
    if (yijing_lower(left) === yijing_upper(left))
      return 'S'; // lower and upper trigram are equal
    else
      return 'M';
  }
  else if (yijing_invert(left) === right) {
    if (yijing_lower(left) === yijing_upper(left))
      return 'A';
    else
      return 'I';
  }
  else return '?';
}

export function yijing_relationEmojiChar(left = 0, right = 0) {
  switch (yijing_relation(left, right)) {
    case 'C': return "💠"; // Center: Inner essence
    case 'O': return "🔄"; // Opposite: Trigram swap
    case 'S': return "🔳"; // Symmetric Flip
    case 'M': return "🪞"; // Non-Symmetric Flip
    case 'A': return "⚖️"; // Symmetric Inversion
    case 'I': return "🌗"; // General Inversion
    default: return "❓"; // No transformation
  }
}
//#endregion

//#region Yijing Hierarchy

export const YIJING_BALANCED = "balanced"; // 20 hexagrams
export const YIJING_UNBALANCED = "unbalanced"; // 44 hexagrams

// Toa Balance - Divine equilibrium
export function yijing_isBalanced(hexagram = 0) {
  return (yijing_lineCount(hexagram) === 3);
}

export function yijing_balancedName(hexagram = 0) {
  return yijing_isBalanced(hexagram) ? YIJING_BALANCED : YIJING_UNBALANCED;
}

export const YIJING_FOUNDATION = "foundation"; // 8 hexagrams

export function yijing_isFoundation(hexagram) {
  return yijing_upper(hexagram) === yijing_lower(hexagram);
}

export const YIJING_COSMIC = "cosmic"; // 4 hexagrams
export const YIJING_KARMIC = "karmic"; // 12 hexagrams
export const YIJING_ATOMIC = "atomic"; // 48 hexagrams

// COSMIC (Primordial) - Chaos, Gaia, Erebus, Aether
export function yijing_isCosmic(hexagram = 0) {
  return yijing_isRoot(hexagram);
}

// KARMIC - Direct descendants of cosmic
export function yijing_isKarmic(hexagram = 0) {
  return !yijing_isCosmic(hexagram)
    && yijing_isCosmic(yijing_center(hexagram));
}

// ATOMIC - Descendants of karmic
export function yijing_isAtomic(hexagram = 0) {
  return !(yijing_isCosmic(hexagram) || yijing_isKarmic(hexagram));
}

export function yijing_mantraName(hexagram) {
  if (yijing_isCosmic(hexagram))
    return YIJING_COSMIC; // 4 hexagrams
  if (yijing_isKarmic(hexagram))
    return YIJING_KARMIC; // 12 hexagrams
  return YIJING_ATOMIC; // 48 hexagrams
}

//#endregion

//#region Seven Symmetry Classes

// Breath (1): Self-transforming through center/invert
export function yijing_isBreath(hexagram = 0) {
  return yijing_center(hexagram) === yijing_invert(hexagram);
}

// Mother (3): Balanced, with upper == lower_of_invert
export function yijing_isMother(hexagram = 0) {
  return yijing_isBalanced(hexagram)
    && yijing_upper(hexagram) === yijing_lower(yijing_invert(hexagram));
}

// Direction (6): Balanced, but neither breath nor mother
export function yijing_isDirection(hexagram = 0) {
  return yijing_isBalanced(hexagram)
    && !yijing_isMother(hexagram) && !yijing_isBreath(hexagram);
}

// Beginning (1): Unbalanced, both trigrams identical and pure (0 or 7)
export function yijing_isBeginning(hexagram = 0) {
  return yijing_lower(hexagram) === yijing_upper(hexagram)
    && (yijing_upper(hexagram) == 0 || yijing_upper(hexagram) == 7);
}

// Principle (3): Unbalanced, both trigrams identical
export function yijing_isPrinciple(hexagram = 0) {
  return yijing_lower(hexagram) === yijing_upper(hexagram);
}

// Titan (6): Extreme imbalance (1 or 5 yang lines)
export function yijing_isTitan(hexagram = 0) {
  const c = yijing_lineCount(hexagram) | 0;
  return (c === 1 || c === 5);
}

// Gigante (12): Everything else
export function yijing_isGigante(hexagram = 0) {
  return !yijing_isBalanced(hexagram)
    && !yijing_isPrinciple(hexagram)
    && !yijing_isTitan(hexagram);
}

export const YIJING_BREATH = "breath";
export const YIJING_MOTHER = "mother";
export const YIJING_DIRECTION = "direction";
export const YIJING_BEGINNING = "beginning";
export const YIJING_PRINCIPLE = "principle";
export const YIJING_TITAN = "titan";
export const YIJING_GIGANTE = "gigante";

export function yijing_symmetryName(hexagram) {
  if (yijing_isBreath(hexagram)) return YIJING_BREATH;
  if (yijing_isMother(hexagram)) return YIJING_MOTHER;
  if (yijing_isDirection(hexagram)) return YIJING_DIRECTION;
  if (yijing_isBeginning(hexagram)) return YIJING_BEGINNING;
  if (yijing_isPrinciple(hexagram)) return YIJING_PRINCIPLE;
  if (yijing_isTitan(hexagram)) return YIJING_TITAN;
  if (yijing_isGigante(hexagram)) return YIJING_GIGANTE;
  throw new Error("value is out of range");
}


function yijing_computeSymmetryGroups() {
  const breath = []; // balanced breath - 1
  const mothers = []; // balanced mothers - 3
  const directions = []; // balanced directions - 6
  const beginning = []; // unbalanced beginning	- 1
  const principles = []; // unbalanced principle - 3
  const titans = []; // unbalanced titan - 6
  const gigantes = []; // unbalanced gigantes - 12
  for (var i = 0; i < 64; i++) {
    if (yijing_isBalanced(i)) {
      if (yijing_isBreath(i))
        breath[breath.length] = i;
      else if (yijing_isMother(i))
        mothers[mothers.length] = i;
      else
        directions[directions.length] = i;
    }
    else { // unbalanced
      if (yijing_isBeginning(i))
        beginning[beginning.length] = i;
      else if (yijing_isPrinciple(i))
        principles[principles.length] = i;
      else if (yijing_isTitan(i))
        titans[titans.length] = i;
      else
        gigantes[gigantes.length] = i;
    }
  }
  return { breath, mothers, directions, beginning, principles, titans, gigantes };
}

export const yijing_symmetryGroups = yijing_computeSymmetryGroups();

//#endregion

//#region Geno-Logic Coding

/**
 * Alphabetical binary mapping for DNA/RNA bases to 2-bit bigrams.
 * A=00 (0b00), C=01 (0b01), G=10 (0b10), T/U=11 (0b11).
 * This preserves dyadic group structure under XOR (modulo-2) for simulating genetic mutations.
 */
export const BASE_TO_BIN = {
  'A': 0b00,
  'C': 0b01,
  'G': 0b10,
  'T': 0b11,
  'U': 0b11  // RNA equivalent to T
};

const BIN_TO_BASE = ['A', 'C', 'G', 'T'];  // Index by 2-bit value (0=A, 1=C, 2=G, 3=T)

/**
 * Standard genetic code mapping from codons to amino acids (one-letter codes).
 * * denotes stop codons. For RNA, replace T with U in queries.
 */
export const CODON_TO_AA = {
  'AAA': 'K', 'AAC': 'N', 'AAG': 'K', 'AAT': 'N',
  'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACT': 'T',
  'AGA': 'R', 'AGC': 'S', 'AGG': 'R', 'AGT': 'S',
  'ATA': 'I', 'ATC': 'I', 'ATG': 'M', 'ATT': 'I',
  'CAA': 'Q', 'CAC': 'H', 'CAG': 'Q', 'CAT': 'H',
  'CCA': 'P', 'CCC': 'P', 'CCG': 'P', 'CCT': 'P',
  'CGA': 'R', 'CGC': 'R', 'CGG': 'R', 'CGT': 'R',
  'CTA': 'L', 'CTC': 'L', 'CTG': 'L', 'CTT': 'L',
  'GAA': 'E', 'GAC': 'D', 'GAG': 'E', 'GAT': 'D',
  'GCA': 'A', 'GCC': 'A', 'GCG': 'A', 'GCT': 'A',
  'GGA': 'G', 'GGC': 'G', 'GGG': 'G', 'GGT': 'G',
  'GTA': 'V', 'GTC': 'V', 'GTG': 'V', 'GTT': 'V',
  'TAA': '*', 'TAC': 'Y', 'TAG': '*', 'TAT': 'Y',
  'TCA': 'S', 'TCC': 'S', 'TCG': 'S', 'TCT': 'S',
  'TGA': '*', 'TGC': 'W', 'TGG': 'W', 'TGT': 'C',
  'TTA': 'L', 'TTC': 'F', 'TTG': 'L', 'TTT': 'F'
};

// AA one-letter to full name (*=Stop)
const AA_TO_NAME = {
  'A': 'alanine', 'C': 'cysteine', 'D': 'aspartic', 'E': 'glutamic',
  'F': 'phenylalanine', 'G': 'glycine', 'H': 'histidine', 'I': 'isoleucine',
  'K': 'lysine', 'L': 'leucine', 'M': 'methionine', 'N': 'asparagine',
  'P': 'proline', 'Q': 'glutamine', 'R': 'arginine', 'S': 'serine',
  'T': 'threonine', 'V': 'valine', 'W': 'tryptophan', 'Y': 'tyrosine',
  '*': 'Stop'
};

/**
 * Converts a genetic codon (3 bases, 5' to 3') to a hexagram number.
 * Maps 5' base to MSB bits 5-4 (bottom lines), middle to bits 3-2, 3' to LSB bits 1-0 (top lines).
 * Supports DNA (T) or RNA (U). Throws error on invalid input.
 * @param {string} codon - Codon string (e.g., 'ATG')
 * @returns {number} Hexagram (0-63)
 */
export function yijing_fromCodon(codon) {
  codon = codon.toUpperCase();
  if (codon.length !== 3)
    throw new Error('Codon must be exactly 3 bases');

  const first = BASE_TO_BIN[codon[0]];
  const second = BASE_TO_BIN[codon[1]];
  const third = BASE_TO_BIN[codon[2]];
  return ((first << 4) | (second << 2) | third) & 63;
}

/**
 * Converts a hexagram to a genetic codon (5' to 3').
 * Maps MSB bits 5-4 (bottom) to 5' base, bits 3-2 to middle, LSB bits 1-0 (top) to 3' base.
 * Uses DNA bases (T instead of U).
 * @param {number} hex - Hexagram (0-63)
 * @returns {string} Codon (e.g., 'ATG')
 */
export function yijing_toCodon(hex) {
  hex = hex | 0;
  if (hex < 0 || hex > 63) throw new Error('Invalid hexagram');
  const first = (hex >> 4) & 3;  // Bottom pair (first base 5')
  const second = (hex >> 2) & 3; // Middle pair
  const third = hex & 3;         // Top pair (third base 3')
  return BIN_TO_BASE[first]
    + BIN_TO_BASE[second]
    + BIN_TO_BASE[third];
}

/**
 * Gets the amino acid (or stop) for a hexagram via its mapped codon.
 * @param {number} hex - Hexagram (0-63)
 * @returns {string} Amino acid one-letter code (e.g., 'M') or '*' for stop or 'Unknown'
 */
export function yijing_toAminoAcid(hex) {
  const codon = yijing_toCodon(hex);
  return CODON_TO_AA[codon] || '?';
}

/**
 * Gets the short amino acid name for a hexagram.
 * @param {number} hex - Hexagram (0-63)
 * @returns {string} AA name (e.g., 'methionine', 'stop')
 */
export function yijing_toAminoAcidName(hex = 0) {
  const aa = yijing_toAminoAcid(hex);
  return AA_TO_NAME[aa] || 'Unknown';
}

/**
 * Checks if a hexagram maps to a stop codon.
 * @param {number} hex - Hexagram (0-63)
 * @returns {boolean}
 */
export function yijing_isStopCodon(hex = 0) {
  return yijing_toAminoAcid(hex) === '*';
}

/**
 * Applies a dyadic mutation (XOR with another hexagram) to simulate genetic changes.
 * This models geno-logic operations like base flips in dyadic groups.
 * @param {number} hex - Original hexagram
 * @param {number} mutation - Mutation mask (0-63)
 * @returns {number} Mutated hexagram
 */
export function yijing_dyadicMutate(hex, mutation) {
  return (hex ^ mutation) & 63;
}

/**
 * Computes Hamming distance between two hexagrams' codons (mutation steps).
 * @param {number} hex1
 * @param {number} hex2
 * @returns {number} Distance (0-6)
 */
export function yijing_codonDistance(hex1 = 0, hex2 = 0) {
  return yijing_distance(hex1, hex2);  // Reuse existing distance
}

//#endregion

//#region King Wen Sequence

// REMEMBER: The root sequence is binary! (Early Heaven)

/**
 * Helper: Create inverse sequence lookup table.
 * Given a sequence mapping [a, b, c, ...], creates reverse lookup
 * where result[sequence[i]] = i.
 *
 * @param {number[]} src - Source sequence
 * @returns {number[]} Inverse sequence
 */
export function yijing_invertSequence(src) {
  const len = 64;
  const inverse = new Array(len);
  for (let i = 0; i < len; i++) {
    inverse[src[i]] = i;
  }
  return inverse;
}

export const YIJING_KINGWEN_SEQUENCE = [
  // First Book - The Universe
  0b111111 /* 1 Qian (The Creative, Heaven) */,
  0b000000 /* 2 Kun (The Receptive, Earth) */,
  0b100010 /* 3 Zhun (Difficulty at the Beginning) */,
  0b010001 /* 4 Meng (Youthful Folly) */,
  0b111010 /* 5 Xu (Waiting) */,
  0b010111 /* 6 Song (Conflict) */,
  0b010000 /* 7 Shi (The Army) */,
  0b000010 /* 8 Bi (Holding Together) */,
  0b111011 /* 9 Xiao Chu (The Taming Power of the Small) */,
  0b110111 /* 10 Lu (Treading) */,
  0b111000 /* 11 Tai (Peace) */,
  0b000111 /* 12 Pi (Standstill, Stagnation) */,
  0b101111 /* 13 Tong Ren (Fellowship with Men) */,
  0b111101 /* 14 Da You (Possession in Great Measure) */,
  0b001000 /* 15 Qian (Modesty) */,
  0b000100 /* 16 Yu (Enthusiasm) */,
  0b100110 /* 17 Sui (Following) */,
  0b011001 /* 18 Gu (Work on What Has Been Spoiled, Decay) */,
  0b110000 /* 19 Lin (Approach) */,
  0b000011 /* 20 Guan (Contemplation) */,
  0b100101 /* 21 Shi He (Biting Through) */,
  0b101001 /* 22 Bi (Grace) */,
  0b000001 /* 23 Bo (Splitting Apart) */,
  0b100000 /* 24 Fu (Return, The Turning Point) */,
  0b100111 /* 25 Wu Wang (Innocence) */,
  0b111001 /* 26 Da Chu (The Taming Power of the Great) */,
  0b100001 /* 27 Yi (The Corners of the Mouth) */,
  0b011110 /* 28 Da Guo (Preponderance of the Great) */,
  0b010010 /* 29 Kan (The Abysmal, Water) */,
  0b101101 /* 30 Li (The Clinging, Fire) */,
  /* Second Book - Socio Economic */
  0b001110 /* 31 Xian (Influence) */,
  0b011100 /* 32 Heng (Duration) */,
  0b001111 /* 33 Dun (Retreat) */,
  0b111100 /* 34 Da Zhuang (The Power of the Great) */,
  0b000101 /* 35 Jin (Progress) */,
  0b101000 /* 36 Ming Yi (Darkening of the Light) */,
  0b101011 /* 37 Jia Ren (The Family) */,
  0b110101 /* 38 Kui (Opposition) */,
  0b001010 /* 39 Jian (Obstruction) */,
  0b010100 /* 40 Xie (Deliverance) */,
  0b110001 /* 41 Sun (Decrease) */,
  0b100011 /* 42 Yi (Increase) */,
  0b111110 /* 43 Guai (Breakthrough, Resoluteness) */,
  0b011111 /* 44 Gou (Coming to Meet) */,
  0b000110 /* 45 Cui (Gathering Together, Massing) */,
  0b011000 /* 46 Sheng (Pushing Upward) */,
  0b010110 /* 47 Kong (Oppression) */,
  0b011010 /* 48 Jing (The Well) */,
  0b101110 /* 49 Ge (Revolution, Molting) */,
  0b011101 /* 50 Ding (The Cauldron) */,
  0b100100 /* 51 Zhen (The Arousing, Thunder) */,
  0b001001 /* 52 Gen (Keeping Still, Mountain) */,
  0b001011 /* 53 Jian (Development, Gradual Progress) */,
  0b110100 /* 54 Gui Mei (The Marrying Maiden) */,
  0b101100 /* 55 Feng (Abundance) */,
  0b001101 /* 56 Lu (The Wanderer) */,
  0b011011 /* 57 Xun (The Gentle, The Penetrating, Wind) */,
  0b110110 /* 58 Dui (The Joyous, Lake) */,
  0b010011 /* 59 Huan (Dispersion, Dissolution) */,
  0b110010 /* 60 Jie (Limitation) */,
  0b110011 /* 61 Zhong Fu (Inner Truth) */,
  0b001100 /* 62 Xiao Guo (Preponderance of the Small) */,
  0b101010 /* 63 Ji Ji (After Completion) */,
  0b010101 /* 64 Wei Ji (Before Completion) */
];

export const YIJING_KINGWEN_INVERTED =
  (() => yijing_invertSequence(YIJING_KINGWEN_SEQUENCE));

/**
 * Generates 64 hexagrams from a Bagua sequence.
 * @param {number[]} sequence - Array of 8 trigrams (3-bit integers: 0b000 to 0b111)
 * @returns {number[]} Array of 64 hexagrams (6-bit integers: 0x00 to 0x3F)
 */
export function generateHexagrams(sequence) {
  if (!Array.isArray(sequence) || sequence.length !== 8) {
    throw new Error('Sequence must be an array of exactly 8 trigrams');
  }

  const hexagrams = [];

  // Outer loop: upper trigram (first in pair) → comes from LSB of hexagram
  // Inner loop: lower trigram (second in pair) → comes from MSB of hexagram
  for (let upper of sequence) {
    for (let lower of sequence) {
      // Validate each trigram is 3-bit
      if ((upper & 0b111) !== upper || (lower & 0b111) !== lower) {
        throw new Error('Each trigram must be a 3-bit value (0–7)');
      }

      // Combine: lower trigram in upper 3 bits (MSB), upper trigram in lower 3 bits (LSB)
      const hexagram = ((lower & 0b111) << 3) | (upper & 0b111);
      hexagrams.push(hexagram);
    }
  }

  return hexagrams;
}


//#endregion

//#region Gray Code Sequence

/**
 * Gray Code Sequence (reflected binary encoding).
 * Adjacent values differ by exactly 1 bit - smooth transitions.
 *
 * Invented by Frank Gray (1953) but mathematically implicit.
 * Creates a Hamiltonian path through the 6D hypercube.
 *
 * Formula: gray(n) = n XOR (n >> 1)
 *
 * INTEGRATION: Maps to gradual transformation paths, meditation sequences
 *
 * @param {number} binval - Binary value
 * @returns {number} Gray code value
 */
export function yijing_toGray(binval = 0) {
  binval = Math.abs(binval | 0) | 0;
  return ((binval >> 1) ^ binval) | 0;
}

/**
 * Inverse Gray Code (Gray → Binary).
 * Recursive XOR to undo Gray encoding.
 *
 * @param {number} grayval - Gray code value
 * @returns {number} Binary value
 */
export function yijing_fromGray(grayval = 0) {
  grayval = grayval | 0;
  let temp = grayval ^ (grayval >> 8);
  temp ^= temp >> 4;
  temp ^= temp >> 2;
  temp ^= temp >> 1;
  return temp | 0;
}

/**
 * Precomputed Gray Code sequence for all 64 hexagrams.
 */
export const YIJING_GRAYCODE_SEQUENCE = Object.freeze(
  (function () {
    const gray = new Array(64);
    for (let i = 0; i < 64; ++i) {
      gray[i] = yijing_toGray(i);
    }
    return gray;
  })()
);


/**
 * Inverse Gray Code sequence (Gray position → binary hexagram).
 */
export const YIJING_GRAYCODE_INVERTED = Object.freeze(
  yijing_invertSequence(YIJING_GRAYCODE_SEQUENCE)
);

//#endregion
