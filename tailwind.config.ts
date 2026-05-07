import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00F0FF',
          purple: '#8A2EFF',
          orange: '#FF7A00',
          green: '#00FF9C',
        },
        bg: {
          dark: '#05070D',
        },
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0,240,255,0.5)',
        'neon-purple': '0 0 20px rgba(138,46,255,0.5)',
        'neon-orange': '0 0 20px rgba(255,122,0,0.5)',
        'neon-green': '0 0 20px rgba(0,255,156,0.5)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
};

export default config;
