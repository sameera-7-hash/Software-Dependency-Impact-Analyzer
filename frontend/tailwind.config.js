/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        },
        // "Midnight" retint of slate: deeper, cooler surfaces with a hint of indigo.
        // Overriding slate here re-themes every page without touching component classes.
        slate: {
          50: '#f6f8fc',
          100: '#edf1fa',
          200: '#dae1f0',
          300: '#b8c3db',
          400: '#8d99b8',
          500: '#66729a',
          600: '#454f72',
          700: '#2d3557',
          800: '#1b2142',
          900: '#10142c',
          950: '#070919',
        },
      },
      keyframes: {
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
