/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        papel: { DEFAULT: '#F6F0E1', claro: '#FCF9F1', escuro: '#ECE2CB', borda: '#D5C6A2' },
        kraft: { DEFAULT: '#C9A97A', claro: '#E3CFA9', escuro: '#9C7B4E' },
        tijolo: { DEFAULT: '#8B261D', claro: '#A8392E', escuro: '#6B1C15' },
        vagao: { DEFAULT: '#1E3F20', claro: '#2E5A31', escuro: '#132A15' },
        latao: { DEFAULT: '#C59B27', claro: '#E2C46A', escuro: '#8A6A12' },
        neblina: { DEFAULT: '#8C928E', claro: '#D9DCD8', escuro: '#5B615D' },
        tinta: { DEFAULT: '#2A2420', suave: '#5A5048' },
      },
      fontFamily: {
        titulo: ['Alegreya', 'Georgia', 'serif'],
        mao: ['Kalam', '"Comic Sans MS"', 'cursive'],
        corpo: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        maquina: ['"Special Elite"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        cartao: '0 1px 0 rgba(42,36,32,0.06), 0 6px 18px -8px rgba(42,36,32,0.25)',
        foto: '0 1px 1px rgba(42,36,32,0.18), 0 10px 22px -10px rgba(42,36,32,0.45)',
        tinta: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}
