import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Gardez '/' si vous utilisez le domaine custom www.kongoscience.com
  build: {
    outDir: 'dist',
  }
})