import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs';
export default defineConfig({
  plugins: [react(),
    basicSsl()
  ],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'tinymce': resolve(__dirname, './public/tinymce'), // ensure self-hosted TinyMCE assets
    },
  },
  build: {
    commonjsOptions: {
      include: [/tinymce/, /node_modules/],
    },
  },
})
