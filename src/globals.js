// src/globals.js

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

export const SYMMETRY_COLORS = {
  'breath': '#ec4899',
  'mother': '#8b5cf6',
  'direction': '#3b82f6',
  'beginning': '#eab308',
  'principle': '#f97316',
  'titan': '#ef4444',
  'gigante': '#10b981'
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