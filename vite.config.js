import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApiHandler } from './server/backend.mjs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'signholo-backend',
      configureServer(server) {
        server.middlewares.use(createApiHandler())
      }
    }
  ],
  base: process.env.VITE_BASE || '/',
  server: {
    host: '127.0.0.1',
    strictPort: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})