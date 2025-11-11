import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      port: 5174,
    },
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    }
  },
})
