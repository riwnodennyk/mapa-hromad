import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
