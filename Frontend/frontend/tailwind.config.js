/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter var',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, rgba(99,102,241,0.9) 0%, rgba(217,70,239,0.9) 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(217,70,239,0.08) 100%)',
      },
      colors: {
        brand: {
          DEFAULT: '#7C3AED',
          500: '#7C3AED',
          600: '#6D28D9',
        },
      },
    },
  },
  plugins: [],
}
