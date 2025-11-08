// src/utils/tools.js

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';

export const cn = (...inputs) => twMerge(clsx(inputs));

export function toBinary(hex) {
  return hex.toString(2).padStart(6, '0');
}

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
