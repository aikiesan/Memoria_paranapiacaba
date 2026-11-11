/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        papel: { DEFAULT: '#F7F3E8', escuro: '#EDE5D0', borda: '#D8CBA8' },
        tijolo: { DEFAULT: '#8B261D', claro: '#A8392E', escuro: '#6B1C15' },
        vagao: { DEFAULT: '#1E3F20', claro: '#2E5A31', escuro: '#132A15' },
        latao: { DEFAULT: '#C59B27', claro: '#E2C46A', escuro: '#8A6A12' },
        neblina: { DEFAULT: '#8C928E', claro: '#D9DCD8', escuro: '#5B615D' },
        tinta: { DEFAULT: '#2A2420', suave: '#5A5048' },
      },
      fontFamily: {
        titulo: ['"Playfair Display"', 'Georgia', 'serif'],
        corpo: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        maquina: ['"Special Elite"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        cartao: '0 1px 0 rgba(42,36,32,0.06), 0 6px 18px -8px rgba(42,36,32,0.25)',
        moldura: '0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 10px #132A15, 0 0 0 12px #C59B27',
      },
    },
  },
  plugins: [],
}
