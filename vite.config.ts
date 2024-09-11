import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    tsconfigPaths(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true }
    }),
    basicSsl()
  ],
  server: {
    port: 3001,
    https: true,
  },
  resolve: {
    alias: {
      'assets': '/src/assets',
      'components': '/src/components',
      'config': '/src/config',
      'contexts': '/src/contexts',
      'helpers': '/src/helpers',
      'hooks': '/src/hooks',
      'pages': '/src/pages',      
      'routes': '/src/routes',
      'storeManager': '/src/storeManager',
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