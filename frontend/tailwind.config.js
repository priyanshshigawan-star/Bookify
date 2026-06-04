/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black:    '#08090d',
        dark:     '#0e1120',
        dark2:    '#161929',
        dark3:    '#1e2235',
        gold:     '#c9a84c',
        'gold-light': '#e4c97e',
        'gold-dark':  '#a07830',
        cream:    '#f5f0e4',
        muted:    '#9a9da8',
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", 'serif'],
        body:    ["'DM Sans'", 'sans-serif'],
      },
      animation: {
        'fade-up':  'fadeUp 0.6s ease both',
        'fade-in':  'fadeIn 0.5s ease both',
        'float':    'float 3s ease-in-out infinite',
        'spin-slow':'spin 1s linear infinite',
        'slide-in': 'slideIn 0.3s ease',
      },
      keyframes: {
        fadeUp:  { from: { opacity:'0', transform:'translateY(24px)' }, to: { opacity:'1', transform:'translateY(0)' }},
        fadeIn:  { from: { opacity:'0' }, to: { opacity:'1' }},
        float:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-10px)' }},
        slideIn: { from: { transform:'translateX(-16px)', opacity:'0' }, to: { transform:'translateX(0)', opacity:'1' }},
      },
      boxShadow: {
        gold:    '0 4px 24px rgba(201,168,76,0.25)',
        'gold-lg':'0 8px 40px rgba(201,168,76,0.35)',
        card:    '0 2px 16px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
