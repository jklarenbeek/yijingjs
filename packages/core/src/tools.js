// packages/core/src/tools.js

import {
  bagua_toWuxing,
} from './bagua.js';

import {
  yijing_isBalanced,
  yijing_isCosmic,
  yijing_isKarmic,
  yijing_isBreath,
  yijing_isMother,
  yijing_isBeginning,
  yijing_isPrinciple,
  yijing_isTitan,
  yijing_upper,
  yijing_lower,
  yijing_toAminoAcidName,
} from './yijing.js';

import {
  WUXING_NEUTRAL,
  WUXING_CREATES,
  WUXING_DESTROYS,
  WUXING_WEAKENS,
  WUXING_INSULTS,
  wuxing_transitionType,
} from './wuxing.js';


function yijing_computeTaoGroups() {
  const balanced = [];
  const unbalanced = [];
  for (let i = 0; i < 64; i++) {
    if (yijing_isBalanced(i))
      balanced[balanced.length] = i;
    else
      unbalanced[unbalanced.length] = i;
  }

  return { balanced, unbalanced };
}

export const yijing_taoGroups = yijing_computeTaoGroups();

function yijing_computeMantraGroups() {
  const cosmic = [];
  const karmic = [];
  const atomic = [];
  for (let i = 0; i < 64; i++) {
    if (yijing_isCosmic(i))
      cosmic[cosmic.length] = i;
    else if (yijing_isKarmic(i))
      karmic[karmic.length] = i;
    else
      atomic[atomic.length] = i;
  }
  return { cosmic, karmic, atomic };
}

export const yijing_mantraGroups = yijing_computeMantraGroups();

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

function yijing_computeTransitionGroups() {
  const transitions = {
    [WUXING_NEUTRAL]: [],
    [WUXING_CREATES]: [],
    [WUXING_DESTROYS]: [],
    [WUXING_WEAKENS]: [],
    [WUXING_INSULTS]: []
  }

  for (let i = 0; i < 64; i++) {
    const upper = yijing_upper(i);
    const lower = yijing_lower(i);
    const uw = bagua_toWuxing(upper);
    const lw = bagua_toWuxing(lower);
    const t = wuxing_transitionType(uw, lw);
    transitions[t]++;
  }

  return {
    neutral: transitions[WUXING_NEUTRAL],
    creates: transitions[WUXING_CREATES],
    destroys: transitions[WUXING_DESTROYS],
    weakens: transitions[WUXING_WEAKENS],
    insults: transitions[WUXING_INSULTS],
  }
}

export const yijing_transitionGroups = yijing_computeTransitionGroups();

function yijing_computeAminoAcidGroups() {
  const aminos = {};
  for (let i = 0; i < 64; i++) {
    const name = yijing_toAminoAcidName(i);
    const members = aminos[name] || [];
    members[members.length] = i;
    aminos[name] = members;
  }
  return aminos;
}

export const yijing_aminoAcidGroups = yijing_computeAminoAcidGroups();
