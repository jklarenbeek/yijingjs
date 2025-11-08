// src/utils/colors.js

// Balanced Color - organized by equal or unequal number of yang and yin lines
export const balancedColors = {
  balanced: '#10b981',    // emerald-500
  unbalanced: '#ef4444', // red-500
};

// Mantra Color - organized by depth to its root (heaven, fire, water, earth)
export const mantraColors = {
  cosmic: '#8b5cf6', // violet-500
  karmic: '#f97316', // orange-500
  atomic: '#3b82f6', // blue-500
};

// Symmetry Group Colors - organized by visual hierarchy
export const symmetryColors = {
  breath: '#ec4899',     // pink-500
  mother: '#8b5cf6',     // violet-500
  direction: '#3b82f6',  // blue-500
  beginning: '#eab308',  // yellow-500
  principle: '#f97316',  // orange-500
  titan: '#ef4444',      // red-500
  gigante: '#10b981',    // emerald-500
};

// Wuxing Element Colors - traditional associations
export const wuxingColors = {
  earth: '#a16207', // yellow-700
  water: '#0284c7', // sky-600
  wood: '#16a34a',  // green-600
  fire: '#dc2626',  // red-600
  metal: '#6b7280', // gray-500
};

export const transitionColors = {
  neutral: '#6b7280',
  creates: '#10b981',
  destroys: '#ef4444',
  weakens: '#f97316',
  insults: '#8b5cf6',
};

export const sixiangColors = {
  north: wuxingColors.water,
  east: wuxingColors.wood,
  west: wuxingColors.metal,
  south: wuxingColors.fire,
};

// Hardcoded from components
export const additionalColors = {
  selected: '#fbbf24', // Selected border
  defaultBorder: '#3b82f6', // Default border
  foundation: '#ffff00', // Foundation dot
  amino: '#3b82f6', // Amino buttons
};

export function getWuxingColor(element) {
  return wuxingColors[element] || '#6b7280';
}