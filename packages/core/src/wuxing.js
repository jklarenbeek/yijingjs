// ./packages/core/src/wuxing.js

export const SIXIANG_NORTH = "north"; // ⚏ Lao Yin (from yin)
export const SIXIANG_EAST = "east"; // ⚎ Shao Yang (from yin)
export const SIXIANG_WEST = "west"; // ⚍ Shao Yin (from yang)
export const SIXIANG_SOUTH = "south"; // ⚌ Lao Yang (from yang)

export const WUXING_EARTH = "earth"; // stabilizing nourishment
export const WUXING_WATER = "water"; // adaptive flow
export const WUXING_WOOD = "wood";   // expansive growth
export const WUXING_FIRE = "fire";   // transformative energy
export const WUXING_METAL = "metal"; // refining structure

export const WUXING_NEUTRAL = "neutral";
export const WUXING_CREATES = "creates";
export const WUXING_DESTROYS = "destroys";
export const WUXING_WEAKENS = "weakens";
export const WUXING_INSULTS = "insults";

export function sixiang_toName(sixiang) {
  sixiang = (sixiang & 3) | 0
  switch (sixiang) {
    case 0: return SIXIANG_NORTH;
    case 1: return SIXIANG_EAST;
    case 2: return SIXIANG_WEST;
    case 3: return SIXIANG_SOUTH;
  }
}

export function sixiang_fromName(sixiangName) {
  switch (sixiangName) {
    case SIXIANG_NORTH: return 0;
    case SIXIANG_EAST: return 1;
    case SIXIANG_WEST: return 2;
    case SIXIANG_SOUTH: return 3;
    default: throw new Error("Unkown sixiang");
  }
}
export function sixiang_toSymbolChar(sixiang) {
  sixiang = (sixiang & 3) | 0
  switch (sixiang) {
    case 0: return "⚏";
    case 1: return "⚎";
    case 2: return "⚍";
    case 3: return "⚌";
  }
}

export function sixiang_toEmojiChar(sixiang) {
  sixiang = (sixiang & 3) | 0
  switch (sixiang) {
    case 0: return "🐢";
    case 1: return "🐉";
    case 2: return "🐅";
    case 3: return "🐦";
  }
}

export function sixiang_toWuxing(sixiangName) {
  switch (sixiangName) {
    case SIXIANG_EAST: return WUXING_WOOD; // Azure Dragon
    case SIXIANG_SOUTH: return WUXING_FIRE; // Vermilion Bird
    case SIXIANG_WEST: return WUXING_METAL; // White Tiger
    case SIXIANG_NORTH: return WUXING_WATER; // Black Tortoise
    default: throw new Error("Unknown sixiang: " + sixiangName);
  }
}

export function wuxing_createsNext(elementName) {
  // Inter-promoting (The generative cycle)
  switch (elementName) {
    // Earth bears Metal
    case WUXING_EARTH: return WUXING_METAL;
    // Metal collects, filters and purifies Water
    case WUXING_METAL: return WUXING_WATER;
    // Water nourishes Wood
    case WUXING_WATER: return WUXING_WOOD;
    // Wood feeds Fire as fuel
    case WUXING_WOOD: return WUXING_FIRE;
    // Fire produces Earth (ash, lava)
    case WUXING_FIRE: return WUXING_EARTH;
    default: throw new Error("Unknown element");
  }
}

export function wuxing_destroysNext(elementName) {
  // Inter-regulating (The destructive cycle)
  switch (elementName) {
    // Earth obstructs Water
    case WUXING_EARTH: return WUXING_WATER;
    // Water extinguishes Fire
    case WUXING_WATER: return WUXING_FIRE;
    // Fire melts Metal
    case WUXING_FIRE: return WUXING_METAL;
    // Metal chops (or carves) Wood
    case WUXING_METAL: return WUXING_WOOD;
    // Wood penetrates Earth
    case WUXING_WOOD: return WUXING_EARTH;
    default: throw new Error("Unknown element: " + elementName);
  }
}

export function wuxing_weakensNext(elementName) {
  // The reverse generative cycle
  switch (elementName) {
    // Earth smothers Fire
    case WUXING_EARTH: return WUXING_FIRE;
    // Fire burns Wood
    case WUXING_FIRE: return WUXING_WOOD;
    // Wood depletes Water
    case WUXING_WOOD: return WUXING_WATER;
    // Water rusts Metal
    case WUXING_WATER: return WUXING_METAL;
    // Metal impoverishes Earth
    case WUXING_METAL: return WUXING_EARTH;
    default: throw new Error("Unknown element: " + elementName);
  }
}

export function wuxing_insultsNext(elementName) {
  // the reverse destructive cycle (insults)
  switch (elementName) {
    // Earth rots Wood (buried wood rots)
    case WUXING_EARTH: return WUXING_WOOD;
    // Wood dulls Metal
    case WUXING_WOOD: return WUXING_METAL;
    // Metal de-energizes Fire (conducting heat away)
    case WUXING_METAL: return WUXING_FIRE;
    // Fire evaporates Water
    case WUXING_FIRE: return WUXING_WATER;
    // Water muddies (or destabilizes) Earth
    case WUXING_WATER: return WUXING_EARTH;
    default: throw new Error("Unknown element: " + elementName);
  }
}

export function wuxing_transitionType(fromElement, toElement) {
  if (fromElement === toElement) return WUXING_NEUTRAL;
  if (wuxing_createsNext(fromElement) === toElement)
    return WUXING_CREATES;
  if (wuxing_destroysNext(fromElement) === toElement)
    return WUXING_DESTROYS;
  if (wuxing_weakensNext(fromElement) === toElement)
    return WUXING_WEAKENS;
  if (wuxing_insultsNext(fromElement) === toElement)
    return WUXING_INSULTS;
  throw new Error("No direct relationship");
}

export function wuxing_transitionSymbolChar(transitionType) {
  switch (transitionType) {
    case WUXING_NEUTRAL: return "↔";
    case WUXING_CREATES: return "➡";
    case WUXING_WEAKENS: return "↩";
    // controls suggesting suppression
    case WUXING_DESTROYS: return "⬇";
    // upward rebellion
    case WUXING_INSULTS: return "⬆";
    default: throw new Error("Unknown transition: " + transitionType);
  }
}

export function wuxing_toEmojiChar(elementName) {
  switch (elementName) {
    // earth — stability, nourishment
    case WUXING_EARTH: return "⚖️";
    // droplet — fluidity, adaptability
    case WUXING_WATER: return "💧";
    // wood — growth, vitality
    case WUXING_WOOD: return "🌱";
    // fire — energy, transformation
    case WUXING_FIRE: return "🔥";
    // metal — structure, refinement
    case WUXING_METAL: return "⚙️";
    default: throw new Error("Unknown element: " + elementName);
  }
}

