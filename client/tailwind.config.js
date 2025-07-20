/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'psb-red': '#EF4444',
        'psb-green': '#22C55E',
        'psb-blue': '#3B82F6',
      },
    },
  },
  plugins: [],
};

