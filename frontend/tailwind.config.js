/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'secondary': '#775a19',
        'secondary-container': '#fed488',
        'secondary-fixed': '#ffdea5',
        'secondary-fixed-dim': '#e9c176',
        'primary': '#000000',
        'primary-container': '#1c1b1b',
        'primary-fixed': '#e5e2e1',
        'primary-fixed-dim': '#c8c6c5',
        'surface': '#faf9f6',
        'surface-container': '#efeeeb',
        'surface-container-low': '#f4f3f1',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e9e8e5',
        'surface-container-highest': '#e3e2e0',
        'surface-variant': '#e3e2e0',
        'on-surface': '#1a1c1a',
        'on-surface-variant': '#444748',
        'on-primary': '#ffffff',
        'on-primary-container': '#858383',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#785a1a',
        'outline-variant': '#c4c7c7',
        'outline': '#747878',
      },
      fontFamily: {
        'headline': ['"Noto Serif"', 'serif'],
        'body': ['"Manrope"', 'sans-serif'],
        'label': ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0px',
        'lg': '0px',
        'xl': '0px',
      },
      letterSpacing: {
        'widest-xl': '0.2em',
        'widest-2xl': '0.25em',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-in-out',
        'slideUp': 'slideUp 0.6s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
        'slideLeft': 'slideLeft 0.6s ease-out',
        'slideRight': 'slideRight 0.6s ease-out',
        'scaleIn': 'scaleIn 0.5s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
