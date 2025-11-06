/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Symmetry Group Colors - organized by visual hierarchy
                symmetry: {
                    breath: '#ec4899',     // pink-500
                    mother: '#8b5cf6',     // violet-500
                    direction: '#3b82f6',  // blue-500
                    beginning: '#eab308',  // yellow-500
                    principle: '#f97316',  // orange-500
                    titan: '#ef4444',      // red-500
                    gigante: '#10b981',    // emerald-500
                },
                // Wuxing Element Colors - traditional associations
                wuxing: {
                    earth: '#a16207',  // yellow-700
                    water: '#0284c7',  // sky-600
                    wood: '#16a34a',   // green-600
                    fire: '#dc2626',   // red-600
                    metal: '#6b7280',  // gray-500
                },
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
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
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
        },
    },
    plugins: [],
}