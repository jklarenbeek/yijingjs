// scripts/generate.js
/* eslint-env node */

import {
  generateAminoAcidInfo,
  generateSixiangInfo,
  generateTransitionInfo,
  generateSymmetryInfo,
  generateMantraInfo,
  generateTaoInfo,
  generateTrigramInfo,
  getHexagramSequences
} from '../src/utils/tools.js';

// eslint-disable-next-line no-undef
const command = process.argv[2];

const functions = {
  amino: generateAminoAcidInfo,
  sixiang: generateSixiangInfo,
  transition: generateTransitionInfo,
  symmetry: generateSymmetryInfo,
  mantra: generateMantraInfo,
  tao: generateTaoInfo,
  trigram: generateTrigramInfo,
  sequences: getHexagramSequences,
  all: () => ({
    aminoAcidInfo: generateAminoAcidInfo(),
    sixiangInfo: generateSixiangInfo(),
    transitionInfo: generateTransitionInfo(),
    symmetryInfo: generateSymmetryInfo(),
    mantraInfo: generateMantraInfo(),
    taoInfo: generateTaoInfo(),
    trigramInfo: generateTrigramInfo(),
    hexagramSequences: getHexagramSequences()
  })
};

if (!command || !functions[command]) {
  console.error('Usage: vite-node generate.js <command>');
  console.error('Available commands: amino, sixiang, transition, symmetry, mantra, tao, trigram, sequences, all');
  // eslint-disable-next-line no-undef
  process.exit(1);
}

const result = functions[command]();
console.log(JSON.stringify(result, null, 2));
