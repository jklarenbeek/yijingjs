// src/utils/tools.js

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';
import * as Tools from '@yijingjs/tools';

import colorSystem, { getWuxingColor } from './colors.js';

export const cn = (...inputs) => twMerge(clsx(inputs));

export function toBinary(hex) {
  return hex.toString(2).padStart(6, '0');
}

export function getHexagramSequences() {
  return {
    "binary": {
      "title": "Binary Sequence",
      "values": Array.from({ length: 64 }, (_, i) => i)
    },
    "gray": {
      "title": "Gray Code Sequence",
      "values": Yijing.YIJING_GRAYCODE_SEQUENCE
    },
    "kingwen": {
      "title": "King Wen Sequence",
      "values": Yijing.YIJING_KINGWEN_SEQUENCE
    },
    "bagua": {
      "title": "King Wen Bagua Sequence",
      "values": Yijing.generateHexagrams(Bagua.BAGUA_KING_WEN_SEQUENCE)
    },
    "early": {
      "title": "Early Heaven Sequence",
      "values": Yijing.generateHexagrams(Bagua.BAGUA_EARLY_HEAVEN_SEQUENCE)
    },
    "later": {
      "title": "Later Heaven Sequence",
      "values": Yijing.generateHexagrams(Bagua.BAGUA_LATER_HEAVEN_SEQUENCE),
    },
  }
}

export function generateTrigramInfo() {
  return [
    { key: Bagua.BAGUA_EARTH, label: `Earth ☷`, count: 8 },
    { key: Bagua.BAGUA_MOUNTAIN, label: `Mountain ☶`, count: 8 },
    { key: Bagua.BAGUA_WATER, label: `Water ☵`, count: 8 },
    { key: Bagua.BAGUA_WIND, label: `Wind ☴`, count: 8 },
    { key: Bagua.BAGUA_THUNDER, label: `Thunder ☳`, count: 8 },
    { key: Bagua.BAGUA_FIRE, label: `Fire ☲`, count: 8 },
    { key: Bagua.BAGUA_LAKE, label: `Lake ☱`, count: 8 },
    { key: Bagua.BAGUA_HEAVEN, label: `Heaven ☰`, count: 8 },
  ];
}

export function generateTaoInfo() {
  const groups = Tools.yijing_taoGroups;
  return [
    { key: Yijing.YIJING_BALANCED, label: 'Balanced', count: groups.balanced.length },
    { key: Yijing.YIJING_UNBALANCED, label: 'Unbalanced', count: groups.unbalanced.length },
  ]
}

export function generateMantraInfo() {
  const groups = Tools.yijing_mantraGroups;
  return [
    { key: Yijing.YIJING_COSMIC, label: 'Cosmic', count: groups.cosmic.length },
    { key: Yijing.YIJING_KARMIC, label: 'Karmic', count: groups.karmic.length },
    { key: Yijing.YIJING_ATOMIC, label: 'Atomic', count: groups.atomic.length },
  ];
}

export function generateSymmetryInfo() {
  const groups = Tools.yijing_symmetryGroups;
  return [
    { key: Yijing.YIJING_BREATH, label: 'Breath', count: groups.breath.length },
    { key: Yijing.YIJING_MOTHER, label: 'Mother', count: groups.mothers.length },
    { key: Yijing.YIJING_DIRECTION, label: 'Direction', count: groups.directions.length },
    { key: Yijing.YIJING_BEGINNING, label: 'Beginning', count: groups.beginning.length },
    { key: Yijing.YIJING_PRINCIPLE, label: 'Principle', count: groups.principles.length },
    { key: Yijing.YIJING_TITAN, label: 'Titan', count: groups.titans.length },
    { key: Yijing.YIJING_GIGANTE, label: 'Gigante', count: groups.gigantes.length }
  ];
}

export function generateTransitionInfo() {
  const groups = Tools.yijing_transitionGroups;
  return [
    { key: Wuxing.WUXING_NEUTRAL, label: 'Neutral', count: groups.neutral.length },
    { key: Wuxing.WUXING_CREATES, label: 'Creates', count: groups.creates.length },
    { key: Wuxing.WUXING_DESTROYS, label: 'Destroys', count: groups.destroys.length },
    { key: Wuxing.WUXING_WEAKENS, label: 'Weakens', count: groups.weakens.length },
    { key: Wuxing.WUXING_INSULTS, label: 'Insults', count: groups.insults.length },
  ];
}

export function generateSixiangInfo() {
  return [
    { key: Wuxing.SIXIANG_NORTH, label: `North ⚏ 🐢`, count: 16 },
    { key: Wuxing.SIXIANG_EAST, label: `East ⚎ 🐉`, count: 16 },
    { key: Wuxing.SIXIANG_WEST, label: `West ⚍ 🐅`, count: 16 },
    { key: Wuxing.SIXIANG_SOUTH, label: `South ⚌ 🐦`, count: 16 },
  ];
}

export function generateAminoAcidInfo() {
  const groups = Tools.yijing_aminoAcidGroups;
  return Object.keys(groups).sort().map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    count: groups[key].length,
  }));
}

export function getHexagramData(hexIndex) {
  hexIndex = hexIndex | 0;
  if (hexIndex == null || hexIndex < 0 || hexIndex > 63)
    return null;

  const upper = Yijing.yijing_upper(hexIndex);
  const lower = Yijing.yijing_lower(hexIndex);
  const upperSymbol = Bagua.bagua_toSymbolChar(upper);
  const lowerSymbol = Bagua.bagua_toSymbolChar(lower);
  const upperWuxing = Bagua.bagua_toWuxing(upper);
  const lowerWuxing = Bagua.bagua_toWuxing(lower);
  const transitionType = Wuxing.wuxing_transitionType(upperWuxing, lowerWuxing);
  const transitionSymbol = Wuxing.wuxing_transitionSymbolChar(transitionType);
  const transitionName = transitionType.charAt(0).toUpperCase() + transitionType.slice(1);

  const symmetryName = Yijing.yijing_symmetryName(hexIndex);
  const foundationName = Yijing.yijing_isFoundation(hexIndex)
    ? Bagua.bagua_toName(upper) : null;

  const balancedName = Yijing.yijing_taoName(hexIndex);
  const mantraName = Yijing.yijing_mantraName(hexIndex);

  // Derived colors (for HexagramCard)
  const upperColor = getWuxingColor(upperWuxing);
  const lowerColor = getWuxingColor(lowerWuxing);
  const symmetryColor = colorSystem.symmetry[symmetryName];
  const balancedColor = colorSystem.balanced[balancedName];
  const mantraColor = colorSystem.mantra[mantraName];
  const foundationColor = colorSystem.ui.foundation;

  // Derived Texts

  // InspectorPanel-specific
  const lineCount = Yijing.yijing_lineCount(hexIndex);
  const binaryString = toBinary(hexIndex);
  const orbit = Yijing.yijing_orbitClass(hexIndex);
  const centerChain = Yijing.yijing_getCenterChain(hexIndex);
  const localNeighbors = Yijing.yijing_neighbors(hexIndex);
  const red = Yijing.yijing_red(hexIndex);
  const white = Yijing.yijing_white(hexIndex);
  const blue = Yijing.yijing_blue(hexIndex);
  const kingWenNumber = Yijing.YIJING_KINGWEN_SEQUENCE.findIndex(num => num === hexIndex) + 1;
  const grayCode = Yijing.yijing_toGray(hexIndex);
  const grayPosition = Yijing.yijing_fromGray(hexIndex);
  const entropy = Yijing.yijing_entropy(hexIndex).toFixed(3);
  const balance = Yijing.yijing_balance(hexIndex).toFixed(3);
  const depth = Yijing.yijing_depth(hexIndex);
  const root = Yijing.yijing_root(hexIndex);
  const distanceToRoot = Yijing.yijing_distance(hexIndex, root);
  const codon = Yijing.yijing_toCodon(hexIndex);
  const aaName = Yijing.yijing_toAminoAcidName(hexIndex);
  const isStop = Yijing.yijing_isStopCodon(hexIndex);

  return {
    upper, lower, upperSymbol, lowerSymbol,
    upperWuxing, lowerWuxing,
    upperColor, lowerColor,
    transitionType, transitionSymbol, transitionName,
    foundationName, foundationColor,
    symmetryName, symmetryColor,
    balancedName, balancedColor,
    mantraName, mantraColor,
    lineCount, binaryString, orbit, centerChain, localNeighbors,
    red, white, blue,
    kingWenNumber, grayCode, grayPosition,
    entropy, balance, depth, root, distanceToRoot,
    codon, aaName, isStop
  };
}

export function getSixiangData(sixiangValue) {
  const name = Wuxing.sixiang_toName(sixiangValue);
  const symbol = Wuxing.sixiang_toSymbolChar(sixiangValue);
  const color = colorSystem.sixiang[name];

  return { name, symbol, color };
}
