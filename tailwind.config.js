/** @type {import('tailwindcss').Config} */

//import typegraphy from '@tailwindcss/typegraphy';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Important for theme switching
    theme: {
        extend: {
            colors: {
                // Symmetry Group Colors
                symmetry: {
                    breath: '#ec4899',
                    mother: '#8b5cf6',
                    direction: '#3b82f6',
                    beginning: '#eab308',
                    principle: '#f97316',
                    titan: '#ef4444',
                    gigante: '#10b981',
                },
                // Wuxing Element Colors
                wuxing: {
                    earth: '#a16207',
                    water: '#0284c7',
                    wood: '#16a34a',
                    fire: '#dc2626',
                    metal: '#6b7280',
                },
                // Base theme colors
                border: 'var(--border)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)',
                },
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif',
                ],
                mono: [
                    'ui-monospace',
                    'SFMono-Regular',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    'Liberation Mono',
                    'Courier New',
                    'monospace',
                ],
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'glow-sm': '0 0 10px currentColor',
                'glow-md': '0 0 20px currentColor',
                'glow-lg': '0 0 30px currentColor',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.3s ease-in',
                'slide-in': 'slide-in 0.3s ease-out',
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
                'fade-in': {
                    '0%': {
                        opacity: '0',
                    },
                    '100%': {
                        opacity: '1',
                    },
                },
                'slide-in': {
                    '0%': {
                        transform: 'translateY(-10px)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'translateY(0)',
                        opacity: '1',
                    },
                },
            },
            gridTemplateColumns: {
                '8': 'repeat(8, minmax(0, 1fr))',
            },
            screens: {
                'xs': '475px',
            },
        },
    },
    plugins: [
        //typegraphy,
    ],
}