/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Status colors
        status: {
          open: '#0ea5e9',        // blue-500
          'in-progress': '#8b5cf6', // purple-500
          resolved: '#10b981',    // green-500
          closed: '#6b7280',      // gray-500
        },
        // Priority colors
        priority: {
          low: '#10b981',        // green-500
          medium: '#f59e0b',      // amber-500
          high: '#ef4444',        // red-500
          critical: '#7f1d1d',    // red-900
        },
      },
    },
  },
  plugins: [],
}