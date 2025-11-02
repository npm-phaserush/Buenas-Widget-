import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      keyframes: {
        scrollList: {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-90%)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(90%)' },
          '100%': { transform: 'translateY(0)' },
        },
        bulbGlow: {
          '0%': { opacity: '0.85', transform: 'scale(0.95)', filter: 'brightness(1)' },
          '100%': { opacity: '1', transform: 'scale(1.15)', filter: 'brightness(1.4)' },
        },
      },
      animation: {
        scrollList: 'scrollList 20s ease-in-out infinite',
        bulbGlow: 'bulbGlow 1.3s ease-in-out infinite alternate',
      },
      fontFamily: {
        'geologica': ['Geologica', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'bulb': '0 0 25px 8px rgba(255, 200, 0, 0.7)',
        'winner': '0 0 25px rgb(219, 187, 1)',
        'white': '0 0 10px #fff',
      },
      spacing: {
        '18': '4.5rem',
        '19': '4.75rem',
        '58': '14.5rem',
      },
    },
  },
} satisfies Config;