// src/utils/colors.js

// Color system with fallbacks
export const colorSystem = {
  // Balanced Color - organized by equal or unequal number of yang and yin lines
  balanced: {
    balanced: '#10b981',   // emerald-500
    unbalanced: '#ef4444', // red-500
  },
  // Mantra Color - organized by depth to its root (heaven, fire, water, earth)
  mantra: {
    cosmic: '#8b5cf6', // violet-500
    karmic: '#f97316', // orange-500
    atomic: '#3b82f6', // blue-500
  },
  symmetry: {
    breath: '#ec4899',    // pink-500
    mother: '#8b5cf6',    // violet-500
    direction: '#3b82f6', // blue-500
    beginning: '#eab308', // yellow-500
    principle: '#f97316', // orange-500
    titan: '#ef4444',     // red-500
    gigante: '#10b981',   // emerald-500
  },
  // Wuxing Element Colors - traditional associations
  wuxing: {
    earth: '#a16207', // yellow-700
    water: '#0284c7', // sky-600
    wood: '#16a34a',  // green-600
    fire: '#dc2626',  // red-600
    metal: '#6b7280', // gray-500
  },
  transition: {
    neutral: '#6b7280',
    creates: '#10b981',
    destroys: '#ef4444',
    weakens: '#f97316',
    insults: '#8b5cf6',
  },
  sixiang: {
    north: '#0284c7', // water
    east: '#16a34a',  // wood
    west: '#6b7280',  // metal
    south: '#dc2626', // fire
  },
  ui: {
    selected: '#fbbf24', // Selected border
    defaultBorder: '#3b82f6', // Default border
    foundation: '#ffff00', // Foundation Color
    amino: '#3b82f6', // Amino buttons
  }
};

// Safe color getter with fallbacks
export function getColor(category, key, fallback = '#6b7280') {
  return colorSystem[category]?.[key] || fallback;
}

export function getWuxingColor(element) {
  return getColor('wuxing', element);
}

export default colorSystem;
