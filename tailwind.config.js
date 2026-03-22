// ./tailwind.config.js
// tailwindcss version 4.1.16
/** @type {import('tailwindcss').Config} */

import colorSystem from './src/utils/colors.js';
import animate from 'tailwindcss-animate';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: colorSystem,
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
        'pulse-glow-slow': 'pulse-glow 3s ease-in-out infinite',
        'pulse-scale': 'pulse-scale 3s ease-in-out infinite',
        'reveal-overlay': 'reveal-overlay 300ms ease-out forwards',
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
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'reveal-overlay': {
          '0%': {
            transform: 'scale(1.08)',
            opacity: '0.4',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      // Add backdrop-filter utilities if not already present
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [animate()],
}
