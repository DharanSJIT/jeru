/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        outfit: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: '#0052CC',        // Vibrant Blue — primary actions, links, accents
        'brand-dark': '#003D99', // Deeper Blue — hover / pressed states
        'brand-light': '#E8F0FE',// Tinted Blue — icon chips, soft fills
        accent: '#2563EB',       // Blue Accent — highlights, focus rings
        primary: '#0F172A',      // Near-Black Slate — headings, main text
        secondary: '#475569',    // Slate Gray — subtext
        surface: '#FFFFFF',      // Pure White
        background: '#F8FAFC',   // Subtle Off-White — alternating sections
        navy: '#0A101D',         // Deep Navy — dark bands (stats, footer)
        'navy-light': '#131C2E', // Slightly lighter navy for card fills
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)',
        lift: '0 2px 4px rgba(15, 23, 42, 0.08), 0 16px 40px rgba(15, 23, 42, 0.12)',
        'brand-glow': '0 10px 30px -8px rgba(0, 82, 204, 0.45)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.8s ease-out both',
        'zoom-in': 'zoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-right': 'slideRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-left': 'slideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        'spin-slow': 'spin 14s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2.4s ease-in-out infinite',
        sheen: 'sheen 2.8s ease-in-out infinite',
        'line-grow': 'lineGrow 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'drop-in': 'dropIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%': { transform: 'translateY(36px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.06)', opacity: '0.85' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-100%)' },
          '60%, 100%': { transform: 'translateX(100%)' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        dropIn: {
          '0%': { transform: 'translateY(-24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}