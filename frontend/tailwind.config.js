/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#feeddb',
          200: '#fcd3b6',
          300: '#fab387',
          400: '#f68952',
          500: '#f16424',
          600: '#e54d19',
          700: '#be3914',
          800: '#972f17',
          900: '#7a2916',
          brand: '#FF7A00',
          accent: '#FF9933',
        },
        navy: {
          50: '#f0f4f9',
          100: '#dce5f1',
          200: '#becfe5',
          300: '#94b2d3',
          400: '#648ebd',
          500: '#4371a5',
          600: '#325888',
          700: '#28466e',
          800: '#1e3452',
          900: '#0b192c',
          950: '#050c18',
        },
        tiranga: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          blue: '#000080',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 25, 44, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(11, 25, 44, 0.14)',
        'glow-saffron': '0 0 25px -5px rgba(255, 153, 51, 0.4)',
        'glow-navy': '0 0 25px -5px rgba(11, 25, 44, 0.4)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
