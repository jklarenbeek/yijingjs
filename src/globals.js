// src/globals.js

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

export const BALANCED_COLORS = {
  [Yijing.YIJING_BALANCED]: '#10b981', // representing harmony and balance in nature (Feng Shui wood/earth influence for stability)
  [Yijing.YIJING_UNBALANCED]: '#ef4444', // symbolizing disruption and imbalance (Feng Shui fire element for dynamic change)
};

export const MANTRA_COLORS = {
  [Yijing.YIJING_COSMIC]: '#8b5cf6', // evoking spiritual and universal energies (Feng Shui prosperity and heaven associations)
  [Yijing.YIJING_KARMIC]: '#f97316', // reflecting action and cyclical fate (Feng Shui fire/earth for transformation)
  [Yijing.YIJING_ATOMIC]: '#3b82f6', // denoting fundamental structures and flow (Feng Shui water/metal for foundational essence)
};

export const SYMMETRY_COLORS = {
  [Yijing.YIJING_BREATH]: '#ec4899',
  [Yijing.YIJING_MOTHER]: '#8b5cf6',
  [Yijing.YIJING_DIRECTION]: '#3b82f6',
  [Yijing.YIJING_BEGINNING]: '#eab308',
  [Yijing.YIJING_PRINCIPLE]: '#f97316',
  [Yijing.YIJING_TITAN]: '#ef4444',
  [Yijing.YIJING_GIGANTE]: '#10b981'
};

export const WUXING_COLORS = {
  [Wuxing.WUXING_EARTH]: '#a16207',
  [Wuxing.WUXING_WATER]: '#0284c7',
  [Wuxing.WUXING_WOOD]: '#16a34a',
  [Wuxing.WUXING_FIRE]: '#dc2626',
  [Wuxing.WUXING_METAL]: '#6b7280'
};

export function getWuxingColor(element) {
  return WUXING_COLORS[element] || '#6b7280';
}

export function toBinary(hex) {
  return hex.toString(2).padStart(6, '0');
}

export const cn = (...inputs) => twMerge(clsx(inputs));

export function getHexagramSequences() {
  const seq = {
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
  return seq;
}


export function generateSymmetryInfo(groups) {
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