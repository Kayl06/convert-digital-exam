import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'frontend/lookbook/index.jsx'),
      name: 'Lookbook',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'lookbook.js',
        assetFileNames: 'lookbook[extname]',
      },
    },
  },
});
