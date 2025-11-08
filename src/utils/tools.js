// src/utils/tools.js

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

import * as Tools from '@yijingjs/tools';

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
