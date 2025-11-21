/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196F3',
          dark: '#1976D2',
          light: '#42A5F5',
        },
        secondary: {
          DEFAULT: '#1A1A2E',
          dark: '#0F0F1E',
          light: '#2C2C3E',
        },
        accent: {
          DEFAULT: '#00D4FF',
          dark: '#00B8E6',
          light: '#33DDFF',
        },
        background: '#F5F7FA',
        text: {
          primary: '#2C3E50',
          secondary: '#7F8C9B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2196F3 0%, #00D4FF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A2E 0%, #2C2C3E 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
