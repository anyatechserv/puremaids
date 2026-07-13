/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf9f6', 100: '#d3f2ea', 200: '#aae4d5', 300: '#70cebb',
          400: '#3cb5a0', 500: '#259a87', 600: '#1b7c6d', 700: '#196459',
          800: '#174f47', 900: '#14413b', 950: '#0b2724',
        },
        accent: {
          50: '#fff8ed', 100: '#ffefd3', 200: '#ffdba6', 300: '#ffbe6e',
          400: '#ff9a33', 500: '#ff7c0a', 600: '#f06007', 700: '#c84a0b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'bounce-y':   'bounceY 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                              to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' },               to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' },              to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot:  { '0%,100%': { opacity: '1', transform: 'scale(1)' },                 '50%': { opacity: '0.6', transform: 'scale(0.9)' } },
        bounceY:   { '0%,100%': { transform: 'translateY(0)' },                          '50%': { transform: 'translateY(-6px)' } },
      },
      boxShadow: {
        glow:    '0 0 24px rgba(27,124,109,0.18)',
        'glow-lg':'0 0 48px rgba(27,124,109,0.22)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175,0.885,0.32,1.275)',
      },
    },
  },
  plugins: [],
};
