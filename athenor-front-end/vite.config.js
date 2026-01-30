import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // For GitHub Pages deployment, set base to your repo name in production
  // In development, use root path for proper routing
  base: command === 'build' ? '/athenor-demo/' : '/',
  plugins: [
     tailwindcss(),
     react()
    ],
}))
