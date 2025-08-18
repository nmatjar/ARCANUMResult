import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Explicitly set output directory to 'build'
    emptyOutDir: true, // Clear the output directory before building
  }
})
