// ./tailwind.config.js
// tailwindcss version 4.1.16
/** @type {import('tailwindcss').Config} */

import {
  balancedColors,
  mantraColors,
  symmetryColors,
  wuxingColors,
  transitionColors,
  sixiangColors,
  additionalColors
} from './src/utils/colors.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        balanced: balancedColors,
        mantra: mantraColors,
        symmetry: symmetryColors,
        wuxing: wuxingColors,
        transition: transitionColors,
        sixiang: sixiangColors,
        ...additionalColors
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-sm': '0 0 10px currentColor',
        'glow-md': '0 0 20px currentColor',
        'glow-lg': '0 0 30px currentColor',
        'glow-xl': '0 0 40px currentColor', // Added extra large glow
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-glow-slow': 'pulse-glow 3s ease-in-out infinite', // Added slower variant
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 10px currentColor',
          },
          '50%': {
            boxShadow: '0 0 20px currentColor',
          },
        },
      },
      // Add backdrop-filter utilities if not already present
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
