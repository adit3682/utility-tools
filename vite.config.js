import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { vercelPreset } from '@react-router/vercel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter({
      presets: [vercelPreset()], 
    }),
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
})