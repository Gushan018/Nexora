import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
=======
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
    },
  },
})
