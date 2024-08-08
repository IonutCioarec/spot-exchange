import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    tsconfigPaths(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true }
    })
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'assets': '/src/assets',
      'components': '/src/components',
      'config': '/src/config',
      'helpers': '/src/helpers',
      'hooks': '/src/hooks',
      'pages': '/src/pages',
      'routes': '/src/routes',
      'types': '/src/types',
      'utils': '/src/utils',
    },
  },
  build: {
    outDir: 'build'
  },
  define: {
  },
});