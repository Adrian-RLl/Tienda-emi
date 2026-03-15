import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Importamos el motor de Tailwind

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),     // Habilita el soporte para JSX/React
    tailwindcss(), // Habilita el motor de Tailwind v4
  ],
})