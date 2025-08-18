import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'build', // Explicitly set output directory to 'build'
    emptyOutDir: true, // Clear the output directory before building
  }
})
