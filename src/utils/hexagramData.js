// src/utils/hexagramData.js

import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/wuxing';
import * as Bagua from '@yijingjs/bagua';
import { toBinary } from './tools.js';  // Assuming toBinary is exported from tools.js
import * as theme from './colors.js';

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
  const upperColor = theme.getWuxingColor(upperWuxing);
  const lowerColor = theme.getWuxingColor(lowerWuxing);
  const symmetryColor = theme.symmetryColors[symmetryName];
  const balancedColor = theme.balancedColors[balancedName];
  const mantraColor = theme.mantraColors[mantraName];
  const foundationColor = theme.additionalColors.foundation;

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
  const kingWenNumber = Yijing.YIJING_KINGWEN_SEQUENCE[hexIndex] + 1;
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
    lineCount, binary: binaryString, orbit, centerChain, localNeighbors,
    red, white, blue,
    kingWenNumber, grayCode, grayPosition,
    entropy, balance, depth, root, distanceToRoot,
    codon, aaName, isStop
  };
}
