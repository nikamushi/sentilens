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
          primary: '#7630FF',
          'primary-dark': '#4B0082',
          secondary: '#2563EB',
          accent: '#9683EC',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          positive: '#10B981',
          neutral: '#94A3B8',
          negative: '#EF4444',
          warning: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'small': '8px',
        'medium': '12px',
        'large': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 8px 24px rgba(15, 23, 42, 0.12)',
      }
    },
  },
  plugins: [],
}

