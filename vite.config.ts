import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
     base: './',
    root: resolve(__dirname), // Use resolve for root path
    cacheDir: resolve('../../node_modules/.vite/apps/org'), // Use resolve for cache directory

    server: {
      port: 4200,
      host: 'localhost',
    },
  plugins: [react()],
     build: {
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: undefined,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
})
