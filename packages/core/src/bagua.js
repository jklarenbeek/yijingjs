// bagua.js

import * as w from './wuxing.js';

export const BAGUA_EARTH = "kun"; // Earth (Kun, ☷): Receptive devotion.
export const BAGUA_MOUNTAIN = "gen"; // Mountain (Gen, ☶): Still restraint.
export const BAGUA_WATER = "kan"; // Water (Kan, ☵): Perilous flow.
export const BAGUA_WIND = "xun"; // Wind (Xun, ☴): Gentle penetration.
export const BAGUA_THUNDER = "zhen"; // Thunder (Zhèn, ☳): Arousing shock.
export const BAGUA_FIRE = "li"; // Fire (Li, ☲): Radiant attachment.
export const BAGUA_LAKE = "dui"; // Lake (Dui, ☱): Joyous reflection.
export const BAGUA_HEAVEN = "qian"; // Heaven (Qian, ☰): Creative persistence.

export function bagua_toName(trigram = 0) {
  trigram = trigram | 0;
  switch (trigram) {
    case 0: return BAGUA_EARTH;
    case 1: return BAGUA_MOUNTAIN;
    case 2: return BAGUA_WATER;
    case 3: return BAGUA_WIND;
    case 4: return BAGUA_THUNDER;
    case 5: return BAGUA_FIRE;
    case 6: return BAGUA_LAKE;
    case 7: return BAGUA_HEAVEN;
    default: throw new Error("Unknown Trigram");
  }
}

export function bagua_fromName(name) {
  switch (name) {
    case BAGUA_EARTH: return 0;
    case BAGUA_MOUNTAIN: return 1;
    case BAGUA_WATER: return 2;
    case BAGUA_WIND: return 3;
    case BAGUA_THUNDER: return 4;
    case BAGUA_FIRE: return 5;
    case BAGUA_LAKE: return 6;
    case BAGUA_HEAVEN: return 7;
    default: throw new Error("Unknown Bagua name");
  }
}

export function bagua_toSixiang(trigram = 0) {
  trigram = trigram | 0;
  return (trigram >> 1) & 3;
}

export function bagua_fromSixiang(sixiang = 0) {
  sixiang = sixiang | 0;
  switch (sixiang) {
    case 0: return 0;
    case 1: return 2;
    case 2: return 5;
    case 3: return 7;
    default: throw new Error('Unknown Si xiang');
  }
}

export function bagua_toWuxing(trigram = 0) {
  trigram = trigram | 0;
  switch (trigram) {
    case 0: return w.WUXING_EARTH; // Kun
    case 1: return w.WUXING_EARTH; // Gen
    case 2: return w.WUXING_WATER; // Kan
    case 3: return w.WUXING_WOOD;  // Xun
    case 4: return w.WUXING_WOOD;  // Zhèn
    case 5: return w.WUXING_FIRE;  // Li
    case 6: return w.WUXING_METAL; // Dui
    case 7: return w.WUXING_METAL; // Qian
    default: throw new Error("Unknown trigram");
  }
}

/**
 * Reverse line order
 * swaps bit positions: 001 ↔ 100
 * @param {number} trigram
 * @returns number
 */
export function bagua_reverse(trigram = 0) {
  trigram = trigram | 0;
  return ((trigram & 1) << 2)
    + (trigram & 2)
    + ((trigram & 4) >> 2);
}

/**
 * Yin-yang inversion
 * Flips all lines: 101 → 010 (XOR with 111)
 * @param {number} trigram
 * @returns
 */
export function bagua_invert(trigram = 0) {
  trigram = trigram | 0;
  return trigram ^ 7;
}

/**
 * Population count
 * Counts set bits
 * @param {number} trigram
 * @returns
 */
export function bagua_lineCount(trigram = 0) {
  trigram = trigram | 0;
  return ((trigram & 1)
    + ((trigram >> 1) & 1)
    + ((trigram >> 2) & 1)) | 0;
}
export function bagua_isRoot(trigram = 0) {
  trigram = trigram | 0;
  return trigram === 0
    || trigram === 2
    || trigram === 5
    || trigram === 7;
}

export function bagua_toSymbolChar(trigram = 0) {
  trigram = trigram | 0;
  switch (trigram) {
    case 0: return "☷";
    case 1: return "☶";
    case 2: return "☵";
    case 3: return "☴";
    case 4: return "☳";
    case 5: return "☲";
    case 6: return "☱";
    case 7: return "☰";
    default: throw new Error("Unknown trigram");
  }
}

export const BAGUA_EARLY_HEAVEN_SEQUENCE = [
  0b111 /* 1. Qian (Heaven) */,
  0b110 /* 2. Dui (Lake) */,
  0b101 /* 3. Li (Fire) */,
  0b100 /* 4. Zhen (Thunder) */,
  0b011 /* 5. Xun (Wind) */,
  0b010 /* 6. Kan (Water) */,
  0b001 /* 7. Gen (Mountain) */,
  0b000 /* 8. Kun (Earth) */
];

export const BAGUA_LATER_HEAVEN_SEQUENCE = [
  0b101 /* 1. Li (Fire) */,
  0b000 /* 2. Kun (Earth) */,
  0b110 /* 3. Dui (Lake) */,
  0b111 /* 4. Qian (Heaven) */,
  0b010 /* 5. Kan (Water) */,
  0b001 /* 6. Gen (Mountain) */,
  0b100 /* 7. Zhen (Thunder) */,
  0b011 /* 8. Xun (Wind) */
];

export const BAGUA_KING_WEN_SEQUENCE = [
  0b111 /* 1. Qian (Heaven) */,
  0b000 /* 2. Kun (Earth) */,
  0b100 /* 3. Zhen (Thunder) */,
  0b010 /* 4. Kan (Water) */,
  0b001 /* 5. Gen (Mountain) */,
  0b011 /* 6. Xun (Wind) */,
  0b101 /* 7. Li (Fire) */,
  0b110 /* 3. Dui (Lake) */
];

export default {
  EARTH: BAGUA_EARTH,
  MOUNTAIN: BAGUA_MOUNTAIN,
  WATER: BAGUA_WATER,
  WIND: BAGUA_WIND,
  THUNDER: BAGUA_THUNDER,
  FIRE: BAGUA_FIRE,
  LAKE: BAGUA_LAKE,
  HEAVEN: BAGUA_HEAVEN,
  KING_WEN: BAGUA_KING_WEN_SEQUENCE,
  EARLY_HEAVEN: BAGUA_EARLY_HEAVEN_SEQUENCE,
  LATER_HEAVEN: BAGUA_LATER_HEAVEN_SEQUENCE,
  toName: bagua_toName,
  fromName: bagua_fromName,
  toSixiang: bagua_toSixiang,
  fromSixiang: bagua_fromSixiang,
  toWuxing: bagua_toWuxing,
  reverse: bagua_reverse,
  invert: bagua_invert,
  lineCount: bagua_lineCount,
  isRoot: bagua_isRoot,
  toSymbolChar: bagua_toSymbolChar,
}