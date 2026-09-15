import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Vendor groups. Matched on the package directory, so subpath imports such as
// react-dom/client and @hookform/resolvers/zod land with their package.
const VENDOR_CHUNKS: [name: string, packages: string[]][] = [
  ['react', ['react', 'react-dom', 'react-router', 'scheduler']],
  ['query', ['@tanstack/react-query', '@tanstack/query-core']],
  ['forms', ['react-hook-form', '@hookform/resolvers', 'zod']],
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Libraries change far less often than app code. In their own chunks
        // they stay cached across deploys instead of being re-downloaded.
        // Vite normalises module ids to forward slashes on every platform.
        manualChunks(id) {
          const group = VENDOR_CHUNKS.find(([, packages]) =>
            packages.some((pkg) => id.includes(`/node_modules/${pkg}/`)),
          );
          return group?.[0];
        },
      },
    },
  },
});
