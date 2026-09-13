import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Frontend dev server proxies /api to the backend so the SPA and API share an origin,
// exactly as they do in production (the backend serves the built SPA).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
  },
})
