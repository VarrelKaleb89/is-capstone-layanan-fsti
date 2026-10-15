/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#2f4dd3',  /* Our main primary color */
          700: '#3b5bdb',
          800: '#5978ff',
          900: '#202540',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Renamed from "dark" to "light"
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          cardHover: '#f1f5f9',
          border: '#e2e8f0',
          muted: '#64748b',
        },
        accent: '#4f46e5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      zIndex: {
        '-1': '-1',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(47, 77, 211, 0.5)',
        'glow-lg': '0 0 25px rgba(47, 77, 211, 0.6)',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.animation-delay-2000': {
          'animation-delay': '2s',
        },
        '.animation-delay-3000': {
          'animation-delay': '3s',
        },
        '.animation-delay-5000': {
          'animation-delay': '5s',
        },
        '.animation-delay-7000': {
          'animation-delay': '7s',
        },
        '.animation-delay-11000': {
          'animation-delay': '11s',
        },
        // Adding negative z-index if not already there
        '.z-\\[-1\\]': {
          'z-index': '-1',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}