import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'

let commitSha = 'dev'
try {
  commitSha = execSync('git rev-parse --short HEAD').toString().trim()
} catch (e) {
  commitSha = 'dev-' + Date.now().toString(36)
}

const buildTime = new Date().toLocaleTimeString('en-US', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}) + ' ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default defineConfig(({ mode }) => ({
  base: './',
  define: {
    'import.meta.env.VITE_COMMIT_SHA': JSON.stringify(commitSha),
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
    '__COMMIT_SHA__': JSON.stringify(commitSha),
    '__BUILD_TIME__': JSON.stringify(buildTime),
  },
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
