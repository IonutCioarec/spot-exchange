import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    tsconfigPaths()
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'pages': '/src/pages',
      'components': '/src/components',
      'assets': '/src/assets',
    },
  },
  build: {
    outDir: 'build'
  }
});