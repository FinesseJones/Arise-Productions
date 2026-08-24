import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~backend/client': fileURLToPath(new URL('./src/client', import.meta.url)),
      '~backend': fileURLToPath(new URL('../backend', import.meta.url)),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    minify: mode === 'production',
    sourcemap: mode === 'development',
    outDir: 'dist',
  },
  server: {
    port: 5055,
    host: true,
    allowedHosts: true
  }
}))
