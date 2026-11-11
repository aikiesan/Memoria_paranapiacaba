import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base do GitHub Pages: https://aikiesan.github.io/Memoria_paranapiacaba/
export default defineConfig({
  plugins: [react()],
  base: '/Memoria_paranapiacaba/',
})
