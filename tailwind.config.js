/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        bounceDelay: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        bounce1: 'bounceDelay 1.5s infinite 0s',
        bounce2: 'bounceDelay 1.5s infinite 0.4s',
        bounce3: 'bounceDelay 1.5s infinite 0.8s',
      },
    },
  },
 
  plugins: []
}